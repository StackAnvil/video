import { resolve, isAbsolute, relative } from "node:path";
import { bundle } from "@remotion/bundler";
import {
  renderMedia,
  renderStill,
  selectComposition,
} from "@remotion/renderer";
import type { Caption } from "@remotion/captions";
import {
  FPS,
  scenes,
  shortScenes,
  VOICE_DELAY,
  type Edition,
} from "../src/config";
import {
  chapters,
  readiness,
  timeline,
  type VideoProps,
} from "../src/production";
import { subtitles } from "./caption-timing";
import { directory, hash, load, mediaDuration, root, run, save } from "./io";
import { music } from "./music";
import { masterAudio } from "./master-audio";
import { voiceover } from "./voiceover";

async function verify(edition: Edition = "landscape") {
  const production = await load();
  const failures = readiness(production, edition);
  const assets = [
    ...Object.values(production.clips),
    ...Object.values(production.voices),
    ...(production.music ? [production.music] : []),
  ];
  for (const asset of assets) {
    const path = resolve(root, "public", asset.file);
    const location = relative(resolve(root, "public/media"), path);
    if (isAbsolute(location) || location.startsWith("..")) {
      failures.push(`Media path outside public/media: ${asset.file}`);
      continue;
    }
    if (!(await Bun.file(path).exists()))
      failures.push(`Missing file: ${asset.file}`);
    else if ((await hash(path)) !== asset.sha256)
      failures.push(`Media changed after review: ${asset.file}`);
  }
  if (failures.length) throw new Error(failures.join("\n"));
  console.log("All required footage, narration, captions, and music are ready");
}

async function footage(args: string[]) {
  const [id, source, startText, secondsText, ...provenance] = args;
  if (
    ![...scenes, ...shortScenes].some(
      (scene) => "clip" in scene && scene.clip === id,
    ) ||
    !source ||
    !provenance.length
  )
    throw new Error(
      'Usage: bun run footage <clip-id> <source.mp4> <start-seconds> <duration-seconds> "provenance"',
    );
  const start = Number(startText);
  const seconds = Number(secondsText);
  if (
    !Number.isFinite(start) ||
    start < 0 ||
    !Number.isFinite(seconds) ||
    seconds <= 0
  )
    throw new Error("Invalid clip range");
  const input = resolve(source);
  if (start + seconds > (await mediaDuration(input)) + 0.03)
    throw new Error("Clip range exceeds source duration");
  const production = await load();
  await directory("public/media/footage");
  const file = `media/footage/${id}.mp4`;
  const output = resolve(root, "public", file);
  const temporary = output.replace(/\.mp4$/, ".tmp.mp4");
  await run([
    "ffmpeg",
    "-nostdin",
    "-y",
    "-v",
    "error",
    "-ss",
    String(start),
    "-i",
    input,
    "-t",
    String(seconds),
    "-an",
    "-vf",
    "fps=30,scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2",
    "-c:v",
    "libx264",
    "-crf",
    "18",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    temporary,
  ]);
  const { rename } = await import("node:fs/promises");
  await rename(temporary, output);
  production.clips[id] = {
    file,
    sha256: await hash(output),
    duration: await mediaDuration(output),
    reviewed: false,
    provenance: provenance.join(" "),
    recordedAt: new Date().toISOString(),
  };
  await save(production);
  console.log(
    `Imported ${id}. Review the entire trimmed clip, then run bun run review ${id}.`,
  );
}

async function exportSubtitles(
  production: VideoProps["production"],
  edition: Edition,
) {
  const prefix = edition === "vertical" ? "showcase-vertical" : "showcase";
  const captions: Caption[] = timeline(production, edition).flatMap(
    ({ scene, start }) =>
      (production.voices[scene.id]?.captions ?? []).map((caption) => ({
        ...caption,
        startMs: caption.startMs + ((start + VOICE_DELAY) / FPS) * 1000,
        endMs: caption.endMs + ((start + VOICE_DELAY) / FPS) * 1000,
      })),
  );
  await Bun.write(resolve(root, `out/${prefix}.srt`), subtitles(captions));
  await Bun.write(
    resolve(root, `out/${prefix}.vtt`),
    subtitles(captions, true),
  );
  await Bun.write(
    resolve(root, `out/${prefix}.captions.json`),
    JSON.stringify(captions, null, 2),
  );
  const coverageText =
    edition === "landscape"
      ? "Keep your Minecraft Java client and explore Bedrock server content. Real Java gameplay on CubeCraft Bedrock and Galaxite, with server menus, custom characters and items, emotes with the default B keybind, Character Creator, Friends and Realms menus, including Economy SMP Community stories and Timeline activity. Realms footage shows menus only."
      : "Your Java client, Bedrock server content. A short look at CubeCraft Bedrock, Galaxite, emotes with the default B keybind, and Realm Community and Timeline menus, with the Fabric mod download linked below.";
  const chapterText = chapters(production, edition)
    .map(
      ({ scene, seconds }) =>
        `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")} ${scene.title.replace(/\n/g, " ")}`,
    )
    .join("\n");
  await Bun.write(
    resolve(
      root,
      edition === "vertical"
        ? "out/social-description.txt"
        : "out/youtube-description.txt",
    ),
    `Play Bedrock servers from Minecraft Java | StackAnvil\n\n${coverageText}\n\nPlayer guide: https://stackanvil.pistonmaster.net/getting-started/\nWebsite: https://stackanvil.pistonmaster.net/\nFabric add-on on CurseForge: https://www.curseforge.com/minecraft/mc-mods/stackanvil-bedrock-addon-for-viafabricplus\nMatching ViaFabricPlus and add-on release: https://github.com/StackAnvil/patches/releases/latest\n\nNeed help or found a bug? Please tell us.\nDiscord: https://discord.gg/F4ZyEtXXge\nGitHub issues: https://github.com/StackAnvil/patches/issues\nInclude your build and Minecraft versions, server, steps, expected result and what happened. Remove private account details from screenshots and logs.\n\n${edition === "landscape" ? chapterText : "#Minecraft #StackAnvil #Bedrock #JavaEdition"}\n\nExperimental builds. Compatibility varies by server and game version; some resource packs have rendering limitations. Independent project, not an official Minecraft or ViaVersion release. Built on ViaFabricPlus and ViaBedrock.\nAI narration: ElevenLabs Liam, Eleven v4. Script rewritten with Claude Opus 5.5 at high effort. Music: ${production.music?.license ?? "No music supplied"}.\nMinecraft gameplay: https://www.minecraft.net/en-us/usage-guidelines\n`,
  );
}

async function render(
  mode: "preview" | "render" | "inspect",
  edition: Edition,
) {
  if (mode === "render") await verify(edition);
  const production = await load();
  const inputProps: VideoProps = {
    production,
    captions: true,
    draft: mode !== "render",
    edition,
  };
  await directory("out/review");
  const serveUrl = await bundle({
    entryPoint: resolve(root, "src/index.ts"),
    publicDir: resolve(root, "public"),
  });
  const composition = await selectComposition({
    serveUrl,
    id: edition === "vertical" ? "StackAnvilShort" : "StackAnvilShowcase",
    inputProps,
  });
  if (mode === "inspect") {
    for (const { scene, start, frames } of timeline(production, edition)) {
      for (const [label, frame] of [
        ["start", start + 1],
        ["middle", start + Math.floor(frames / 2)],
        ["end", start + frames - 1],
      ] as const)
        await renderStill({
          serveUrl,
          composition,
          inputProps,
          frame,
          output: resolve(root, `out/review/${scene.id}-${label}.png`),
          scale: 0.5,
        });
    }
    await renderStill({
      serveUrl,
      composition,
      inputProps: { ...inputProps, draft: false, captions: false },
      frame:
        (timeline(production, edition).find(
          ({ scene }) => scene.kind === "footage",
        )?.start ?? 0) + 90,
      output: resolve(
        root,
        edition === "vertical"
          ? "out/thumbnail-vertical.png"
          : "out/thumbnail.png",
      ),
    });
    console.log("Scene and transition frames: out/review");
  } else {
    let last = -1;
    const outputLocation = resolve(
      root,
      `out/showcase${edition === "vertical" ? "-vertical" : ""}${mode === "preview" ? "-preview" : ""}.mp4`,
    );
    await renderMedia({
      serveUrl,
      composition,
      inputProps,
      codec: "h264",
      crf: 18,
      pixelFormat: "yuv420p",
      audioCodec: "aac",
      audioBitrate: "320k",
      concurrency: 4,
      scale: mode === "preview" ? 2 / 3 : 1,
      outputLocation,
      onProgress: ({ progress }) => {
        const bucket = Math.floor(progress * 10);
        if (bucket > last) {
          last = bucket;
          console.log(`Render ${bucket * 10}%`);
        }
      },
    });
    await masterAudio(outputLocation);
    await exportSubtitles(production, edition);
  }
}

async function main() {
  const [command, ...args] = Bun.argv.slice(2);
  const edition: Edition = args[0] === "vertical" ? "vertical" : "landscape";
  if (command === "music") return music(args[0]);
  if (command === "voiceover") return voiceover(args[0], args[1]);
  if (command === "footage") return footage(args);
  if (command === "verify") return verify(edition);
  if (command === "review") {
    const production = await load();
    const clip = production.clips[args[0]];
    if (!clip) throw new Error("Unknown clip");
    if ((await hash(resolve(root, "public", clip.file))) !== clip.sha256)
      throw new Error("Footage changed since import");
    clip.reviewed = true;
    await save(production);
    console.log(`Marked ${args[0]} as reviewed`);
    return;
  }
  if (command === "preview" || command === "render" || command === "inspect")
    return render(command, edition);
  if (command === "studio") {
    await directory(".cache");
    const path = resolve(root, ".cache/studio-props.json");
    await Bun.write(
      path,
      JSON.stringify({
        production: await load(),
        captions: true,
        draft: true,
        edition,
      }),
    );
    const child = Bun.spawn(
      [
        "bunx",
        "remotion",
        "studio",
        "src/index.ts",
        "--no-open",
        `--props=${path}`,
      ],
      { cwd: root, stdout: "inherit", stderr: "inherit" },
    );
    process.exitCode = await child.exited;
    return;
  }
  throw new Error(
    "Commands: studio, footage, review, voiceover, music, verify, inspect, preview, render",
  );
}
await main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Production failed");
  process.exitCode = 1;
});

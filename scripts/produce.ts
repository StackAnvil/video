import { resolve, isAbsolute, relative } from "node:path";

import { bundle } from "@remotion/bundler";
import type { Caption } from "@remotion/captions";
import {
  renderMedia,
  renderStill,
  selectComposition,
} from "@remotion/renderer";
import { Effect } from "effect";

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
import { publishing } from "../src/publishing";
import { subtitles } from "./caption-timing";
import {
  directory,
  exists,
  fail,
  hash,
  io,
  load,
  main,
  mediaDuration,
  move,
  root,
  run,
  save,
  spawn,
  write,
} from "./io";
import { masterAudio } from "./master-audio";
import { music } from "./music";
import { voiceover } from "./voiceover";

const verify = Effect.fnUntraced(function* (edition: Edition = "landscape") {
  const production = yield* load();
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
    if (!(yield* exists(path))) failures.push(`Missing file: ${asset.file}`);
    else if ((yield* hash(path)) !== asset.sha256)
      failures.push(`Media changed after review: ${asset.file}`);
  }
  if (failures.length) return yield* fail(failures.join("\n"));
  process.stdout.write(
    "All required footage, narration, captions, and music are ready\n",
  );
  return undefined;
});

const footage = Effect.fnUntraced(function* (args: string[]) {
  const [id, source, startText, secondsText, ...provenance] = args;
  if (
    ![...scenes, ...shortScenes].some(
      (scene) => "clip" in scene && scene.clip === id,
    ) ||
    !source ||
    !provenance.length
  )
    return yield* fail(
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
    return yield* fail("Invalid clip range");
  const input = resolve(source);
  if (start + seconds > (yield* mediaDuration(input)) + 0.03)
    return yield* fail("Clip range exceeds source duration");
  const production = yield* load();
  yield* directory("public/media/footage");
  const file = `media/footage/${id}.mp4`;
  const output = resolve(root, "public", file);
  const temporary = output.replace(/\.mp4$/, ".tmp.mp4");
  yield* run([
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
  yield* move(temporary, output);
  production.clips[id] = {
    file,
    sha256: yield* hash(output),
    duration: yield* mediaDuration(output),
    reviewed: false,
    provenance: provenance.join(" "),
    recordedAt: new Date().toISOString(),
  };
  yield* save(production);
  process.stdout.write(
    `Imported ${id}. Review the entire trimmed clip, then run bun run review ${id}.\n`,
  );
  return undefined;
});

const exportCaptionsAndMetadata = Effect.fnUntraced(function* (
  production: VideoProps["production"],
  edition: Edition,
) {
  yield* directory("out");
  const prefix = edition === "vertical" ? "showcase-vertical" : "showcase";
  const captions: Caption[] = timeline(production, edition).flatMap(
    ({ scene, start }) =>
      // oxlint-disable-next-line oxc/no-map-spread -- copy so the production data stays unchanged
      (production.voices[scene.id]?.captions ?? []).map((caption) => ({
        ...caption,
        startMs: caption.startMs + ((start + VOICE_DELAY) / FPS) * 1000,
        endMs: caption.endMs + ((start + VOICE_DELAY) / FPS) * 1000,
      })),
  );
  yield* write(resolve(root, `out/${prefix}.srt`), subtitles(captions));
  yield* write(resolve(root, `out/${prefix}.vtt`), subtitles(captions, true));
  yield* write(
    resolve(root, `out/${prefix}.captions.json`),
    JSON.stringify(captions, null, 2),
  );
  const metadata = publishing[edition];
  const chapterText = chapters(production, edition)
    .map(
      ({ title, seconds }) =>
        `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")} ${title}`,
    )
    .join("\n");
  yield* write(
    resolve(
      root,
      edition === "vertical"
        ? "out/social-description.txt"
        : "out/youtube-description.txt",
    ),
    `${metadata.title}\n\n${metadata.intro}\n\nGet StackAnvil\nPlayer guide: https://stackanvil.pistonmaster.net/getting-started/\nWebsite: https://stackanvil.pistonmaster.net/\nFabric add-on on CurseForge: https://www.curseforge.com/minecraft/mc-mods/stackanvil-bedrock-addon-for-viafabricplus\nMatching ViaFabricPlus and add-on release: https://github.com/StackAnvil/patches/releases/latest\n\nHelp and bug reports\nDiscord: https://pistonmaster.net/discord\nGitHub issues: https://github.com/StackAnvil/patches/issues\nInclude your Minecraft and mod versions, server, steps to reproduce, expected result and what happened. Remove private account details from screenshots and logs.\n\n${edition === "landscape" ? `Chapters\n${chapterText}` : "#Minecraft #StackAnvil #Bedrock #JavaEdition"}\n\nStackAnvil is experimental. Compatibility varies by server and game version, and some resource packs have rendering limitations. B is the default emote key and can be rebound in Controls. Independent project, not an official Minecraft or ViaVersion release. Built on ViaFabricPlus and ViaBedrock.\nAI narration: ElevenLabs Liam, Eleven v4. Script rewritten with Claude Opus 5.5 at high effort. Music: ${production.music?.license ?? "No music supplied"}.\nMinecraft gameplay: https://www.minecraft.net/en-us/usage-guidelines\n`,
  );
});

const bundleVideo = io("Bundle the Remotion project", () =>
  bundle({
    entryPoint: resolve(root, "src/index.ts"),
    publicDir: resolve(root, "public"),
  }),
);

const thumbnail = Effect.fnUntraced(function* (
  production: VideoProps["production"],
  edition: Edition,
  serveUrl?: string,
) {
  const clip = production.clips["galaxite-actors"];
  if (!clip?.reviewed || clip.duration < 3.1)
    return yield* fail("Thumbnail needs reviewed Galaxite model footage");
  yield* directory("out/review");
  const url = serveUrl ?? (yield* bundleVideo);
  const inputProps = { production };
  const composition = yield* io("Select the thumbnail composition", () =>
    selectComposition({
      serveUrl: url,
      id:
        edition === "landscape"
          ? "StackAnvilThumbnail"
          : "StackAnvilShortThumbnail",
      inputProps,
    }),
  );
  const name = edition === "vertical" ? "thumbnail-vertical" : "thumbnail";
  for (const [scale, output] of [
    [1, `out/${name}.jpg`],
    [1 / 12, `out/review/${name}-mobile.jpg`],
  ] as const)
    yield* io(`Render ${output}`, () =>
      renderStill({
        serveUrl: url,
        composition,
        inputProps,
        frame: 0,
        imageFormat: "jpeg",
        jpegQuality: 90,
        scale,
        output: resolve(root, output),
      }),
    );
  return undefined;
});

const render = Effect.fnUntraced(function* (
  mode: "preview" | "render" | "inspect",
  edition: Edition,
) {
  if (mode === "render") yield* verify(edition);
  const production = yield* load();
  const inputProps: VideoProps = {
    production,
    captions: true,
    draft: mode !== "render",
    edition,
  };
  yield* directory("out/review");
  const serveUrl = yield* bundleVideo;
  const composition = yield* io("Select the video composition", () =>
    selectComposition({
      serveUrl,
      id: edition === "vertical" ? "StackAnvilShort" : "StackAnvilShowcase",
      inputProps,
    }),
  );
  if (mode === "inspect") {
    for (const { scene, start, frames } of timeline(production, edition)) {
      for (const [label, frame] of [
        ["start", start + 1],
        ["middle", start + Math.floor(frames / 2)],
        ["end", start + frames - 1],
      ] as const)
        yield* io(`Render ${scene.id} ${label} frame`, () =>
          renderStill({
            serveUrl,
            composition,
            inputProps,
            frame,
            output: resolve(root, `out/review/${scene.id}-${label}.png`),
            scale: 0.5,
          }),
        );
    }
    if (production.clips["galaxite-actors"]?.reviewed)
      yield* thumbnail(production, edition, serveUrl);
    process.stdout.write("Scene and transition frames: out/review\n");
  } else {
    let last = -1;
    const outputLocation = resolve(
      root,
      `out/showcase${edition === "vertical" ? "-vertical" : ""}${mode === "preview" ? "-preview" : ""}.mp4`,
    );
    yield* io("Render the video", () =>
      renderMedia({
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
            process.stdout.write(`Render ${bucket * 10}%\n`);
          }
        },
      }),
    );
    yield* masterAudio(outputLocation);
    yield* exportCaptionsAndMetadata(production, edition);
    if (mode === "render") yield* thumbnail(production, edition, serveUrl);
  }
});

const program = Effect.gen(function* () {
  const [command, ...args] = Bun.argv.slice(2);
  const edition: Edition = args[0] === "vertical" ? "vertical" : "landscape";
  if (command === "music") return yield* music(args[0]);
  if (command === "voiceover") return yield* voiceover(args[0], args[1]);
  if (command === "footage") return yield* footage(args);
  if (command === "verify") return yield* verify(edition);
  if (command === "posting") {
    yield* verify(edition);
    const production = yield* load();
    yield* exportCaptionsAndMetadata(production, edition);
    yield* thumbnail(production, edition);
    process.stdout.write(
      "Upload package: designed thumbnail, metadata, and subtitles in out/\n",
    );
    return undefined;
  }
  if (command === "review") {
    const production = yield* load();
    const clip = production.clips[args[0]];
    if (!clip) return yield* fail("Unknown clip");
    if ((yield* hash(resolve(root, "public", clip.file))) !== clip.sha256)
      return yield* fail("Footage changed since import");
    clip.reviewed = true;
    yield* save(production);
    process.stdout.write(`Marked ${args[0]} as reviewed\n`);
    return undefined;
  }
  if (command === "preview" || command === "render" || command === "inspect")
    return yield* render(command, edition);
  if (command === "studio") {
    yield* directory(".cache");
    const path = resolve(root, ".cache/studio-props.json");
    yield* write(
      path,
      JSON.stringify({
        production: yield* load(),
        captions: true,
        draft: true,
        edition,
      }),
    );
    const child = yield* spawn(
      [
        "bunx",
        "remotion",
        "studio",
        "src/index.ts",
        "--no-open",
        `--props=${path}`,
      ],
      { stdout: "inherit", stderr: "inherit" },
    );
    process.exitCode = yield* io("Remotion Studio", () => child.exited);
    return undefined;
  }
  return yield* fail(
    "Commands: studio, footage, review, voiceover, music, verify, posting, inspect, preview, render",
  );
}).pipe(Effect.scoped);

await main(program);

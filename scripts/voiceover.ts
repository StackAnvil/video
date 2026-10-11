import { resolve } from "node:path";
import { scenes, shortScenes } from "../src/config";
import { alignedCaptions, type Alignment } from "./caption-timing";
import { directory, hash, load, mediaDuration, root, run, save } from "./io";

export async function voiceover(
  style = process.env.STACKANVIL_NARRATION ?? "calm",
  onlyScene?: string,
) {
  if (style !== "calm" && style !== "energetic")
    throw new Error("Choose calm or energetic");
  const key = process.env.ELEVENLABS_API_KEY;
  const narratorVoice =
    process.env.ELEVENLABS_VOICE_ID ?? "TX3LPaxmHKxFdv7VOQHJ";
  const production = await load();
  await directory("public/media/voiceover");
  await directory(".cache/voiceover");
  const selected = [...scenes, ...shortScenes].filter(
    (scene) => !onlyScene || scene.id === onlyScene,
  );
  if (!selected.length) throw new Error("Unknown narration scene");
  for (const scene of selected) {
    const voiceId =
      scene.voice === "brian"
        ? (process.env.ELEVENLABS_CAMEO_VOICE_ID ?? "nPczCjzI2devNBz1zQrb")
        : narratorVoice;
    const signature = JSON.stringify({
      text: scene.narration,
      style,
      voiceId,
      model: "eleven_v4",
      ending: "long-pause-with-decoded-tail",
      format: "mp3_44100_128",
    });
    const cache = Bun.file(resolve(root, `.cache/voiceover/${scene.id}.json`));
    let result: {
      audio_base64: string;
      normalized_alignment?: Alignment;
      alignment?: Alignment;
    };
    if ((await cache.exists()) && (await cache.json()).signature === signature)
      result = (await cache.json()).result;
    else {
      if (!key) throw new Error("Set ELEVENLABS_API_KEY to generate narration");
      const response = await fetch(
        "https://api.elevenlabs.io/v1/text-to-dialogue/with-timestamps?output_format=mp3_44100_128",
        {
          method: "POST",
          headers: { "xi-api-key": key, "Content-Type": "application/json" },
          body: JSON.stringify({
            inputs: [
              {
                voice_id: voiceId,
                text: `${style === "calm" ? "[warmly]" : "[excited]"} ${scene.narration} [long pause]`,
              },
            ],
            model_id: "eleven_v4",
            language_code: "en",
          }),
          signal: AbortSignal.timeout(120000),
        },
      );
      if (!response.ok)
        throw new Error(
          `ElevenLabs returned ${response.status} for ${scene.id}`,
        );
      result = await response.json();
      await Bun.write(cache, JSON.stringify({ signature, result }));
    }
    const alignment = result.normalized_alignment ?? result.alignment;
    if (!alignment) throw new Error(`Missing alignment for ${scene.id}`);
    const spoken = alignment.characters.join("");
    const characters = [...alignment.characters];
    for (const tag of spoken.matchAll(/\[[^\]]+\]/g))
      for (let i = tag.index!; i < tag.index! + tag[0].length; i++)
        characters[i] = " ";
    const captions = alignedCaptions({ ...alignment, characters }).map(
      (caption) => ({
        ...caption,
        text: caption.text.replace(/Stack Anvil/g, "StackAnvil"),
      }),
    );
    const file = `media/voiceover/${scene.id}.wav`;
    const path = resolve(root, "public", file);
    const source = resolve(root, `.cache/voiceover/${scene.id}.mp3`);
    await Bun.write(source, Buffer.from(result.audio_base64, "base64"));
    await run([
      "ffmpeg",
      "-nostdin",
      "-y",
      "-v",
      "error",
      "-i",
      source,
      "-af",
      "apad=pad_dur=0.5",
      "-c:a",
      "pcm_s16le",
      path,
    ]);
    production.voices[scene.id] = {
      file,
      sha256: await hash(path),
      text: scene.narration,
      duration: await mediaDuration(path),
      captions,
    };
    await save(production);
    console.log(`Narration and aligned captions: ${scene.id}`);
  }
}

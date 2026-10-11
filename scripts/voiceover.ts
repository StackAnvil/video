import { resolve } from "node:path";
import { scenes } from "../src/config";
import { alignedCaptions, type Alignment } from "./caption-timing";
import { directory, hash, load, mediaDuration, root, save } from "./io";

export async function voiceover(
  style = process.env.STACKANVIL_NARRATION ?? "calm",
) {
  if (style !== "calm" && style !== "energetic")
    throw new Error("Choose calm or energetic");
  const key = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID ?? "TX3LPaxmHKxFdv7VOQHJ";
  const production = await load();
  await directory("public/media/voiceover");
  await directory(".cache/voiceover");
  for (const scene of scenes) {
    const signature = JSON.stringify({
      text: scene.narration,
      style,
      voiceId,
      model: "eleven_v3",
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
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`,
        {
          method: "POST",
          headers: { "xi-api-key": key, "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `${style === "calm" ? "[calm]" : "[excited]"} ${scene.narration}`,
            model_id: "eleven_v3",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: style === "calm" ? 0.05 : 0.65,
            },
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
    const captions = alignedCaptions(alignment)
      .map((caption) => ({
        ...caption,
        text: caption.text.replace(/\[(calm|excited)\]\s*/g, ""),
      }))
      .filter((caption) => caption.text.trim());
    const file = `media/voiceover/${scene.id}.mp3`;
    const path = resolve(root, "public", file);
    await Bun.write(path, Buffer.from(result.audio_base64, "base64"));
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

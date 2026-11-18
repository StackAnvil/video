import { resolve } from "node:path";

import { Effect, Option, Schema } from "effect";

import { scenes, shortScenes } from "../src/config";
import { alignedCaptions } from "./caption-timing";
import { elevenLabs, setting } from "./elevenlabs";
import {
  decode,
  directory,
  exists,
  fail,
  hash,
  load,
  mediaDuration,
  readJson,
  reason,
  root,
  run,
  save,
  ToolError,
  write,
} from "./io";

const Alignment = Schema.Struct({
  characters: Schema.mutable(Schema.Array(Schema.String)),
  character_start_times_seconds: Schema.mutable(Schema.Array(Schema.Finite)),
  character_end_times_seconds: Schema.mutable(Schema.Array(Schema.Finite)),
});
/** The parts of the text-to-dialogue response that the production uses. */
export const Dialogue = Schema.Struct({
  audio_base64: Schema.String,
  normalized_alignment: Schema.optional(Schema.NullOr(Alignment)),
  alignment: Schema.optional(Schema.NullOr(Alignment)),
});
const CachedDialogue = Schema.Struct({
  signature: Schema.String,
  result: Schema.Unknown,
});

const cachedDialogue = (path: string, signature: string) =>
  Effect.gen(function* () {
    if (!(yield* exists(path))) return Option.none<unknown>();
    const cache = yield* readJson(path).pipe(
      Effect.flatMap(decode(CachedDialogue, "Narration cache")),
      Effect.option,
    );
    return Option.isSome(cache) && cache.value.signature === signature
      ? Option.some(cache.value.result)
      : Option.none<unknown>();
  });

export const voiceover = Effect.fnUntraced(function* (
  requestedStyle?: string,
  onlyScene?: string,
) {
  const style =
    requestedStyle ?? (yield* setting("STACKANVIL_NARRATION", "calm"));
  if (style !== "calm" && style !== "energetic")
    return yield* fail("Choose calm or energetic");
  const voiceId = yield* setting("ELEVENLABS_VOICE_ID", "TX3LPaxmHKxFdv7VOQHJ");
  const production = yield* load();
  yield* directory("public/media/voiceover");
  yield* directory(".cache/voiceover");
  const selected = [...scenes, ...shortScenes].filter(
    (scene) => !onlyScene || scene.id === onlyScene,
  );
  if (!selected.length) return yield* fail("Unknown narration scene");
  for (const scene of selected) {
    const signature = JSON.stringify({
      text: scene.narration,
      style,
      voiceId,
      model: "eleven_v4",
      ending: "long-pause-with-decoded-tail",
      format: "mp3_44100_128",
    });
    const cache = resolve(root, `.cache/voiceover/${scene.id}.json`);
    const cached = yield* cachedDialogue(cache, signature);
    const result = Option.isSome(cached)
      ? yield* decode(Dialogue, `Narration cache for ${scene.id}`)(cached.value)
      : yield* elevenLabs({
          path: "text-to-dialogue/with-timestamps?output_format=mp3_44100_128",
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
          purpose: "narration",
          timeoutSeconds: 120,
          rejected: (status) => `ElevenLabs returned ${status} for ${scene.id}`,
        }).pipe(
          Effect.map(({ bytes }) => new TextDecoder().decode(bytes)),
          Effect.flatMap(
            decode(
              Schema.fromJsonString(Dialogue),
              `ElevenLabs returned malformed narration for ${scene.id}`,
            ),
          ),
          Effect.tap((fresh) =>
            write(cache, JSON.stringify({ signature, result: fresh })),
          ),
        );
    const alignment = result.normalized_alignment ?? result.alignment;
    if (!alignment) return yield* fail(`Missing alignment for ${scene.id}`);
    const spoken = alignment.characters.join("");
    const characters = [...alignment.characters];
    for (const tag of spoken.matchAll(/\[[^\]]+\]/g))
      for (let i = tag.index; i < tag.index + tag[0].length; i++)
        characters[i] = " ";
    const captions = yield* Effect.try({
      try: () => alignedCaptions({ ...alignment, characters }),
      catch: (cause) =>
        new ToolError({
          message: `Invalid alignment for ${scene.id}: ${reason(cause)}`,
          cause,
        }),
    });
    for (const caption of captions)
      caption.text = caption.text.replaceAll("Stack Anvil", "StackAnvil");
    const file = `media/voiceover/${scene.id}.wav`;
    const path = resolve(root, "public", file);
    const source = resolve(root, `.cache/voiceover/${scene.id}.mp3`);
    yield* write(source, Buffer.from(result.audio_base64, "base64"));
    yield* run([
      "ffmpeg",
      "-nostdin",
      "-y",
      "-v",
      "error",
      "-i",
      source,
      "-af",
      "apad=pad_dur=1",
      "-t",
      String((captions.at(-1)?.endMs ?? 0) / 1000 + 1),
      "-c:a",
      "pcm_s16le",
      path,
    ]);
    production.voices[scene.id] = {
      file,
      sha256: yield* hash(path),
      text: scene.narration,
      duration: yield* mediaDuration(path),
      captions,
    };
    yield* save(production);
    process.stdout.write(`Narration and aligned captions: ${scene.id}\n`);
  }
  return undefined;
});

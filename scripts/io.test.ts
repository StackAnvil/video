import { describe, expect, test } from "bun:test";

import { Effect } from "effect";

import { emptyProduction } from "../src/production";
import { decodeProduction, run } from "./io";

const failure = <A>(effect: Effect.Effect<A, { message: string }>) =>
  Effect.runPromise(Effect.flip(effect)).then((error) => error.message);

describe("process helpers", () => {
  test("run returns trimmed stdout", async () => {
    expect(await Effect.runPromise(run(["sh", "-c", "echo ' ready '"]))).toBe(
      "ready",
    );
  });
  test("run reports the exit failure with stderr", async () => {
    expect(
      await failure(run(["sh", "-c", "echo broken >&2; exit 3"])),
    ).toStartWith("sh failed: broken");
  });
  test("run reports a command that cannot start", async () => {
    expect(
      await failure(run(["stackanvil-command-that-does-not-exist"])),
    ).toStartWith("Cannot start stackanvil-command-that-does-not-exist");
  });
});

describe("production manifest", () => {
  const clip = {
    file: "media/footage/intro.mp4",
    sha256: "abc",
    duration: 4,
    reviewed: true,
    provenance: "Lab capture",
    recordedAt: "2026-01-01T00:00:00.000Z",
    portraitMenus: [
      { from: 0, to: 1, focus: { x: 0, y: 0, width: 1, height: 1 } },
    ],
  };
  test("accepts a saved manifest", async () => {
    const production = {
      clips: { intro: clip },
      voices: {
        intro: {
          file: "media/voiceover/intro.wav",
          sha256: "def",
          text: "Hello",
          duration: 2,
          captions: [
            {
              text: "Hello",
              startMs: 0,
              endMs: 400,
              timestampMs: null,
              confidence: null,
            },
          ],
        },
      },
    };
    expect(await Effect.runPromise(decodeProduction(production))).toEqual(
      production,
    );
    expect(await Effect.runPromise(decodeProduction(emptyProduction))).toEqual(
      emptyProduction,
    );
  });
  test("rejects a clip without a hash", async () => {
    const { sha256: _, ...unhashed } = clip;
    expect(
      await failure(
        decodeProduction({ clips: { intro: unhashed }, voices: {} }),
      ),
    ).toStartWith("production.local.json is malformed");
  });
});

import { describe, expect, test } from "bun:test";
import { alignedCaptions, subtitles } from "./caption-timing";
import {
  duration,
  emptyProduction,
  readiness,
  timeline,
} from "../src/production";
import { FPS, TRANSITION } from "../src/config";

describe("production timing", () => {
  test("adjacent scenes overlap only by the transition duration", () => {
    const entries = timeline(emptyProduction);
    for (let i = 1; i < entries.length; i++)
      expect(entries[i].start).toBe(
        entries[i - 1].start + entries[i - 1].frames - TRANSITION,
      );
    expect(duration(emptyProduction)).toBe(
      entries.at(-1)!.start + entries.at(-1)!.frames,
    );
  });
  test("long narration extends a scene and shifts later scenes", () => {
    const production = structuredClone(emptyProduction);
    production.voices.intro = {
      file: "intro.mp3",
      sha256: "",
      text: "",
      duration: 20,
      captions: [],
    };
    expect(timeline(production)[0].frames).toBe(Math.ceil(21.6 * FPS));
    expect(duration(production)).toBeGreaterThan(duration(emptyProduction));
  });
  test("incomplete production cannot pass publication checks", () => {
    expect(readiness(emptyProduction).length).toBeGreaterThan(0);
  });
});

describe("speech alignment", () => {
  test("caption boundaries follow measured character timestamps", () => {
    const characters = Array.from(
      "one two three four five six seven eight nine ten",
    );
    const captions = alignedCaptions({
      characters,
      character_start_times_seconds: characters.map((_, i) => i * 0.1),
      character_end_times_seconds: characters.map((_, i) => (i + 1) * 0.1),
    });
    expect(captions).toHaveLength(2);
    expect(captions[0].startMs).toBe(0);
    expect(captions[0].endMs).toBe(4400);
    expect(captions[1].startMs).toBe(4500);
    expect(captions[1].endMs).toBeCloseTo(4800);
  });
  test("invalid alignment cannot create subtitles", () => {
    expect(() =>
      alignedCaptions({
        characters: ["a"],
        character_start_times_seconds: [],
        character_end_times_seconds: [],
      }),
    ).toThrow();
  });
  test("subtitle timestamps carry milliseconds into the next minute", () => {
    const result = subtitles([
      {
        text: "",
        startMs: 59999.7,
        endMs: 61000,
        timestampMs: null,
        confidence: null,
      },
    ]);
    const times = result.split("\n")[1].split(" --> ");
    expect(times).toEqual(["00:01:00,000", "00:01:01,000"]);
  });
});

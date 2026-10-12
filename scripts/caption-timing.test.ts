import { describe, expect, test } from "bun:test";
import { alignedCaptions, subtitles } from "./caption-timing";
import {
  duration,
  chapters,
  emptyProduction,
  readiness,
  timeline,
} from "../src/production";
import { FPS, TRANSITION, VOICE_DELAY, VOICE_TAIL } from "../src/config";

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
    production.voices[timeline(production)[0].scene.id] = {
      file: "voice.wav",
      sha256: "",
      text: "",
      duration: 20,
      captions: [],
    };
    expect(timeline(production)[0].frames).toBe(
      20 * FPS + VOICE_DELAY + VOICE_TAIL + TRANSITION,
    );
    expect(duration(production)).toBeGreaterThan(duration(emptyProduction));
  });
  test("every speech sequence retains its complete final frame and tail", () => {
    const production = structuredClone(emptyProduction);
    for (const { scene } of timeline(production)) {
      production.voices[scene.id] = {
        file: "",
        sha256: "",
        text: "",
        duration: 25.013,
        captions: [],
      };
    }
    for (const entry of timeline(production)) {
      const voiceEnd =
        entry.start +
        VOICE_DELAY +
        Math.ceil(production.voices[entry.scene.id].duration * FPS) +
        VOICE_TAIL;
      expect(entry.start + entry.frames - TRANSITION).toBeGreaterThanOrEqual(
        voiceEnd,
      );
    }
  });
  test("each edition uses only its own voices and extends independently", () => {
    const production = structuredClone(emptyProduction);
    const landscapeBefore = duration(production);
    const shortBefore = duration(production, "vertical");
    production.voices[timeline(production, "vertical")[0].scene.id] = {
      file: "",
      sha256: "",
      text: "",
      duration: 30.01,
      captions: [],
    };
    expect(duration(production)).toBe(landscapeBefore);
    expect(duration(production, "vertical")).toBeGreaterThan(shortBefore);
    const selected = timeline(production, "vertical");
    for (let i = 1; i < selected.length; i++) {
      expect(selected[i].start).toBe(
        selected[i - 1].start + selected[i - 1].frames - TRANSITION,
      );
    }
  });
  test("incomplete production cannot pass publication checks", () => {
    expect(readiness(emptyProduction).length).toBeGreaterThan(0);
  });
  test("rounded chapter timestamps leave at least ten seconds per chapter", () => {
    const entries = chapters(emptyProduction);
    expect(entries.length).toBeGreaterThanOrEqual(3);
    expect(entries[0].seconds).toBe(0);
    for (const entry of entries) {
      const start = timeline(emptyProduction).find(
        ({ scene }) => scene.id === entry.scene.id,
      )!.start;
      expect(entry.seconds * FPS).toBeGreaterThanOrEqual(start);
      expect(entry.seconds * FPS).toBeLessThan(start + FPS);
    }
    for (let i = 1; i < entries.length; i++)
      expect(
        entries[i].seconds - entries[i - 1].seconds,
      ).toBeGreaterThanOrEqual(10);
    expect(
      Math.floor(duration(emptyProduction) / FPS) - entries.at(-1)!.seconds,
    ).toBeGreaterThanOrEqual(10);
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

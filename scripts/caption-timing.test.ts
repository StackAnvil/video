import { describe, expect, test } from "bun:test";

import { FPS, TRANSITION, VOICE_DELAY, VOICE_TAIL } from "../src/config";
import {
  duration,
  chapters,
  emptyProduction,
  readiness,
  timeline,
} from "../src/production";
import { required } from "../src/required";
import { alignedCaptions, subtitles } from "./caption-timing";

describe("production timing", () => {
  test("adjacent scenes overlap only by the transition duration", () => {
    const entries = timeline(emptyProduction);
    for (let i = 1; i < entries.length; i++) {
      const previous = required(entries[i - 1], "previous entry");
      const entry = required(entries[i], "entry");
      expect(entry.start).toBe(previous.start + previous.frames - TRANSITION);
    }
    const last = required(entries.at(-1), "last entry");
    expect(duration(emptyProduction)).toBe(last.start + last.frames);
  });
  test("long narration extends a scene and shifts later scenes", () => {
    const production = structuredClone(emptyProduction);
    const [first] = timeline(production);
    production.voices[required(first, "first entry").scene.id] = {
      file: "voice.wav",
      sha256: "",
      text: "",
      duration: 20,
      captions: [],
    };
    expect(required(timeline(production)[0], "first entry").frames).toBe(
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
        Math.ceil(
          required(production.voices[entry.scene.id], "voice").duration * FPS,
        ) +
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
    production.voices[
      required(timeline(production, "vertical")[0], "first entry").scene.id
    ] = {
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
      const previous = required(selected[i - 1], "previous entry");
      const entry = required(selected[i], "entry");
      expect(entry.start).toBe(previous.start + previous.frames - TRANSITION);
    }
  });
  test("incomplete production cannot pass publication checks", () => {
    expect(readiness(emptyProduction).length).toBeGreaterThan(0);
  });
  test("rounded chapter timestamps leave at least ten seconds per chapter", () => {
    const entries = chapters(emptyProduction);
    expect(entries.length).toBeGreaterThanOrEqual(3);
    expect(required(entries[0], "first chapter").seconds).toBe(0);
    for (const entry of entries) {
      const { start } = required(
        timeline(emptyProduction).find(
          ({ scene }) => scene.id === entry.scene.id,
        ),
        "timeline entry",
      );
      expect(entry.seconds * FPS).toBeGreaterThanOrEqual(start);
      expect(entry.seconds * FPS).toBeLessThan(start + FPS);
    }
    for (let i = 1; i < entries.length; i++) {
      const previous = required(entries[i - 1], "previous chapter");
      const entry = required(entries[i], "chapter");
      expect(entry.seconds - previous.seconds).toBeGreaterThanOrEqual(10);
    }
    expect(
      Math.floor(duration(emptyProduction) / FPS) -
        required(entries.at(-1), "last chapter").seconds,
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
    const [first, second] = captions;
    expect(first?.startMs).toBe(0);
    expect(first?.endMs).toBe(4400);
    expect(second?.startMs).toBe(4500);
    expect(second?.endMs).toBeCloseTo(4800);
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
    const times = required(result.split("\n")[1], "timing line").split(" --> ");
    expect(times).toEqual(["00:01:00,000", "00:01:01,000"]);
  });
});

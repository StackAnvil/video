import { describe, expect, test } from "bun:test";
import {
  chapterTiming,
  progress,
  pushOffset,
  samplerShots,
  SAMPLER_FRAMES,
  PUSH_FRAMES,
} from "../src/components/shotcraft/timing";

describe("Shotcraft timeline", () => {
  test("adjacent scenes overlap by the transition budget", () => {
    for (let position = 1; position < samplerShots.length; position++) {
      const previous = samplerShots[position - 1];
      expect(
        previous.from + previous.duration - samplerShots[position].from,
      ).toBe(PUSH_FRAMES);
    }
    const last = samplerShots.at(-1)!;
    expect(last.from + last.duration).toBe(SAMPLER_FRAMES);
  });
  test("incoming and outgoing panels remain in rigid contact", () => {
    for (let frame = 0; frame <= PUSH_FRAMES; frame++) {
      const p = progress(frame, 0, PUSH_FRAMES);
      expect(pushOffset(p, true) - pushOffset(p, false)).toBeCloseTo(100);
    }
    expect(pushOffset(0, true)).toBe(100);
    expect(pushOffset(1, true)).toBe(0);
    expect(pushOffset(1, false)).toBe(-100);
  });
  test("longer titles keep their reading hold before demotion", () => {
    for (const characters of [1, 8, 16, 24]) {
      const timing = chapterTiming(characters);
      expect(timing.demote - timing.revealEnd).toBeCloseTo(20);
      expect(timing.content - timing.demote).toBeCloseTo(12);
      expect(timing.settled - timing.demote).toBeCloseTo(26);
    }
  });
});

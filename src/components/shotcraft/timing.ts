import { Easing, interpolate } from "remotion";

// Adapted from video-shotcraft. See third-party/video-shotcraft/NOTICE.md.
export const SHOTCRAFT_FPS = 30;
export const PUSH_FRAMES = 26;
export const TITLE_FRAMES = 120;
export const FOCUS_FRAMES = 210;
export const OUTRO_FRAMES = 174;
export const SAMPLER_FRAMES =
  TITLE_FRAMES + FOCUS_FRAMES + OUTRO_FRAMES - 2 * PUSH_FRAMES;

export const samplerShots = [
  { id: "title", from: 0, duration: TITLE_FRAMES },
  { id: "focus", from: TITLE_FRAMES - PUSH_FRAMES, duration: FOCUS_FRAMES },
  {
    id: "outro",
    from: TITLE_FRAMES + FOCUS_FRAMES - 2 * PUSH_FRAMES,
    duration: OUTRO_FRAMES,
  },
] as const;

export function progress(
  frame: number,
  from: number,
  duration: number,
  easing = Easing.bezier(0.22, 1, 0.36, 1),
) {
  return interpolate(frame, [from, from + duration], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function chapterTiming(characters: number) {
  const revealEnd = Math.max(0, characters - 1) * 1.6 + 16;
  const demote = revealEnd + 20;
  return { revealEnd, demote, content: demote + 12, settled: demote + 26 };
}

export function pushOffset(progressValue: number, entering: boolean) {
  return (entering ? 1 - progressValue : -progressValue) * 100;
}

export function characters(text: string) {
  const occurrences = new Map<string, number>();
  return Array.from(
    new Intl.Segmenter("en", { granularity: "grapheme" }).segment(text),
    ({ segment }) => {
      const occurrence = (occurrences.get(segment) ?? 0) + 1;
      occurrences.set(segment, occurrence);
      return { id: `${segment}:${occurrence}`, text: segment };
    },
  );
}

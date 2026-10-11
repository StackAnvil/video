import type { Caption } from "@remotion/captions";
import {
  FPS,
  scenesFor,
  TRANSITION,
  VOICE_DELAY,
  VOICE_TAIL,
  type Edition,
} from "./config";

export interface Focus {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface Clip {
  file: string;
  sha256: string;
  duration: number;
  reviewed: boolean;
  provenance: string;
  recordedAt: string;
  focus?: Focus;
  portraitMenus?: { from: number; to: number; focus: Focus }[];
}
export interface Voice {
  file: string;
  sha256: string;
  text: string;
  duration: number;
  captions: Caption[];
}
export interface Production {
  clips: Record<string, Clip>;
  voices: Record<string, Voice>;
  music?: { file: string; sha256: string; duration: number; license: string };
}
export type VideoProps = {
  production: Production;
  captions: boolean;
  draft: boolean;
  edition: Edition;
};
export const emptyProduction: Production = { clips: {}, voices: {} };

export function timeline(
  production: Production,
  edition: Edition = "landscape",
) {
  let start = 0;
  return scenesFor(edition).map((scene) => {
    const voice = production.voices[scene.id];
    const frames = Math.max(
      Math.ceil(scene.seconds * FPS),
      VOICE_DELAY +
        Math.ceil((voice?.duration ?? 0) * FPS) +
        VOICE_TAIL +
        TRANSITION,
    );
    const entry = { scene, start, frames };
    start += frames - TRANSITION;
    return entry;
  });
}
export function duration(
  production: Production,
  edition: Edition = "landscape",
) {
  const last = timeline(production, edition).at(-1)!;
  return last.start + last.frames;
}
export function chapters(
  production: Production,
  edition: Edition = "landscape",
) {
  const end = Math.floor(duration(production, edition) / FPS);
  let previous = -10;
  const entries = timeline(production, edition).flatMap(({ scene, start }) => {
    const seconds = Math.floor(start / FPS);
    if (seconds - previous < 10 || end - seconds < 10) return [];
    previous = seconds;
    return [{ scene, seconds }];
  });
  return entries.length >= 3 ? entries : [];
}
export function readiness(
  production: Production,
  edition: Edition = "landscape",
) {
  const failures: string[] = [];
  for (const scene of scenesFor(edition)) {
    if ("clip" in scene) {
      const clip = production.clips[scene.clip];
      if (!clip) failures.push(`Missing footage: ${scene.clip}`);
      else if (!clip.reviewed)
        failures.push(`Unreviewed footage: ${scene.clip}`);
      else if (
        clip.duration <
        timeline(production, edition).find(
          (entry) => entry.scene.id === scene.id,
        )!.frames /
          FPS
      )
        failures.push(`Footage too short: ${scene.clip}`);
    }
    const voice = production.voices[scene.id];
    if (!voice || voice.text !== scene.narration || voice.captions.length === 0)
      failures.push(`Missing or stale narration/captions: ${scene.id}`);
  }
  if (!production.music) failures.push("Missing music");
  else if (production.music.duration < duration(production, edition) / FPS)
    failures.push("Music too short");
  return failures;
}

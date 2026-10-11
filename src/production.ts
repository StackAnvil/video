import type { Caption } from "@remotion/captions";
import { FPS, scenes, TRANSITION } from "./config";

export interface Clip {
  file: string;
  sha256: string;
  duration: number;
  reviewed: boolean;
  provenance: string;
  recordedAt: string;
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
};
export const emptyProduction: Production = { clips: {}, voices: {} };

export function timeline(production: Production) {
  let start = 0;
  return scenes.map((scene) => {
    const voice = production.voices[scene.id];
    const frames = Math.ceil(
      Math.max(scene.seconds, (voice?.duration ?? 0) + 1.6) * FPS,
    );
    const entry = { scene, start, frames };
    start += frames - TRANSITION;
    return entry;
  });
}
export function duration(production: Production) {
  const last = timeline(production).at(-1)!;
  return last.start + last.frames;
}
export function readiness(production: Production) {
  const failures: string[] = [];
  for (const scene of scenes) {
    if ("clip" in scene) {
      const clip = production.clips[scene.clip];
      if (!clip) failures.push(`Missing footage: ${scene.clip}`);
      else if (!clip.reviewed)
        failures.push(`Unreviewed footage: ${scene.clip}`);
      else if (
        clip.duration <
        timeline(production).find((entry) => entry.scene.id === scene.id)!
          .frames /
          FPS
      )
        failures.push(`Footage too short: ${scene.clip}`);
    }
    const voice = production.voices[scene.id];
    if (!voice || voice.text !== scene.narration || voice.captions.length === 0)
      failures.push(`Missing or stale narration/captions: ${scene.id}`);
  }
  if (!production.music) failures.push("Missing music");
  else if (production.music.duration < duration(production) / FPS)
    failures.push("Music too short");
  return failures;
}

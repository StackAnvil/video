import type { Caption } from "@remotion/captions";

import { required } from "../src/required";

export interface Alignment {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}
export function alignedCaptions(alignment: Alignment): Caption[] {
  const source = alignment.characters.join("");
  if (
    alignment.characters.length !==
      alignment.character_start_times_seconds.length ||
    alignment.characters.length !== alignment.character_end_times_seconds.length
  )
    throw new Error("Alignment lengths differ");
  const words = Array.from(source.matchAll(/\S+/gu));
  const captions: Caption[] = [];
  let line: RegExpMatchArray[] = [];
  const flush = () => {
    const first = line[0];
    const last = line.at(-1);
    if (!first || !last) return;
    const start = required(first.index, "caption word position");
    const end =
      required(last.index, "caption word position") + last[0].length - 1;
    const startSeconds = alignment.character_start_times_seconds[start];
    const endSeconds = alignment.character_end_times_seconds[end];
    if (startSeconds === undefined || endSeconds === undefined)
      throw new Error("Invalid caption timing");
    const startMs = startSeconds * 1000;
    const endMs = endSeconds * 1000;
    if (
      !Number.isFinite(startMs) ||
      !Number.isFinite(endMs) ||
      startMs < 0 ||
      endMs <= startMs
    )
      throw new Error("Invalid caption timing");
    captions.push({
      text: line.map((word) => word[0]).join(" "),
      startMs,
      endMs,
      timestampMs: null,
      confidence: null,
    });
    line = [];
  };
  for (const word of words) {
    if ([...line.map((part) => part[0]), word[0]].join(" ").length > 58)
      flush();
    line.push(word);
    if (/[.!?]$/u.test(word[0]) || line.length >= 9) flush();
  }
  flush();
  return captions;
}
export function timestamp(ms: number, separator = ",") {
  const rounded = Math.round(ms);
  return `${String(Math.floor(rounded / 3_600_000)).padStart(2, "0")}:${String(Math.floor(rounded / 60_000) % 60).padStart(2, "0")}:${String(Math.floor(rounded / 1000) % 60).padStart(2, "0")}${separator}${String(rounded % 1000).padStart(3, "0")}`;
}
export function subtitles(captions: Caption[], vtt = false) {
  return `${vtt ? "WEBVTT\n\n" : ""}${captions.map((caption, index) => `${index + 1}\n${timestamp(caption.startMs, vtt ? "." : ",")} --> ${timestamp(caption.endMs, vtt ? "." : ",")}\n${caption.text.trim()}\n`).join("\n")}`;
}

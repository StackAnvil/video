import type { Caption } from "@remotion/captions";

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
  const words = Array.from(source.matchAll(/\S+/g));
  const captions: Caption[] = [];
  let line: RegExpMatchArray[] = [];
  const flush = () => {
    if (!line.length) return;
    const start = line[0].index!;
    const last = line.at(-1)!;
    const end = last.index! + last[0].length - 1;
    const startMs = alignment.character_start_times_seconds[start] * 1000;
    const endMs = alignment.character_end_times_seconds[end] * 1000;
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
    if (/[.!?]$/.test(word[0]) || line.length >= 9) flush();
  }
  flush();
  return captions;
}
export function timestamp(ms: number, separator = ",") {
  const rounded = Math.round(ms);
  return `${String(Math.floor(rounded / 3600000)).padStart(2, "0")}:${String(Math.floor(rounded / 60000) % 60).padStart(2, "0")}:${String(Math.floor(rounded / 1000) % 60).padStart(2, "0")}${separator}${String(rounded % 1000).padStart(3, "0")}`;
}
export function subtitles(captions: Caption[], vtt = false) {
  return `${vtt ? "WEBVTT\n\n" : ""}${captions.map((caption, index) => `${index + 1}\n${timestamp(caption.startMs, vtt ? "." : ",")} --> ${timestamp(caption.endMs, vtt ? "." : ",")}\n${caption.text.trim()}\n`).join("\n")}`;
}

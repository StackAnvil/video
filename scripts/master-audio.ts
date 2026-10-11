import { rename } from "node:fs/promises";
import { run } from "./io";

export async function masterAudio(path: string) {
  // Leave headroom for true-peak overshoot during AAC encoding.
  const target = "loudnorm=I=-16:TP=-1.8:LRA=11";
  const analysis = Bun.spawn(
    [
      "ffmpeg",
      "-nostdin",
      "-i",
      path,
      "-vn",
      "-af",
      `${target}:print_format=json`,
      "-f",
      "null",
      "-",
    ],
    { stdout: "ignore", stderr: "pipe" },
  );
  const [stderr, code] = await Promise.all([
    new Response(analysis.stderr).text(),
    analysis.exited,
  ]);
  const report = stderr.match(/\{[^{}]+\}/)?.[0];
  if (code !== 0 || !report) throw new Error("Audio loudness analysis failed");
  const measured = JSON.parse(report) as Record<string, string>;
  const parameters = {
    measured_I: measured.input_i,
    measured_TP: measured.input_tp,
    measured_LRA: measured.input_lra,
    measured_thresh: measured.input_thresh,
    offset: measured.target_offset,
  };
  if (
    Object.values(parameters).some((value) => !Number.isFinite(Number(value)))
  )
    throw new Error("Audio loudness measurements are invalid");
  const filter = [
    target,
    ...Object.entries(parameters).map(([key, value]) => `${key}=${value}`),
    "linear=true",
  ].join(":");
  const temporary = path.replace(/\.mp4$/, ".master.tmp.mp4");
  await run([
    "ffmpeg",
    "-nostdin",
    "-y",
    "-v",
    "error",
    "-i",
    path,
    "-map",
    "0:v:0",
    "-map",
    "0:a:0",
    "-c:v",
    "copy",
    "-af",
    filter,
    "-c:a",
    "aac",
    "-b:a",
    "320k",
    "-ar",
    "48000",
    "-movflags",
    "+faststart",
    temporary,
  ]);
  await rename(temporary, path);
  console.log("Audio mastered: -16 LUFS target, AAC peak headroom");
}

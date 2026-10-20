import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import {
  getCompositions,
  openBrowser,
  renderMedia,
  renderStill,
} from "@remotion/renderer";
import {
  samplerShots,
  SAMPLER_FRAMES,
} from "../src/components/shotcraft/timing";

const [command, edition] = process.argv.slice(2);
if (
  (command !== "inspect" && command !== "render") ||
  (edition && edition !== "landscape" && edition !== "vertical")
) {
  throw new Error(
    "Usage: bun scripts/shotcraft.ts <inspect|render> [landscape|vertical]",
  );
}
const output = resolve("out/shotcraft");
const bundle = resolve(output, "bundle");
await mkdir(output, { recursive: true });
const child = Bun.spawn(
  ["bunx", "remotion", "bundle", "src/index.ts", `--out-dir=${bundle}`],
  {
    stdout: "inherit",
    stderr: "inherit",
  },
);
if ((await child.exited) !== 0) throw new Error("Shotcraft bundle failed");
const ids =
  edition === "landscape"
    ? ["ShotcraftSampler"]
    : edition === "vertical"
      ? ["ShotcraftSamplerVertical"]
      : ["ShotcraftSampler", "ShotcraftSamplerVertical"];
const frames = [
  ...new Set([
    ...samplerShots.flatMap(({ from, duration }) => [
      from,
      from + 12,
      from + 26,
      from + 80,
      from + duration - 1,
    ]),
    SAMPLER_FRAMES - 31,
    SAMPLER_FRAMES - 1,
  ]),
].sort((a, b) => a - b);
const browser = await openBrowser("chrome");
try {
  const compositions = await getCompositions(bundle, {
    puppeteerInstance: browser,
  });
  for (const id of ids) {
    const composition = compositions.find((item) => item.id === id);
    if (!composition) throw new Error(`Missing composition: ${id}`);
    if (command === "inspect") {
      const directory = resolve(output, "qa");
      await mkdir(directory, { recursive: true });
      for (const frame of frames) {
        await renderStill({
          serveUrl: bundle,
          composition,
          puppeteerInstance: browser,
          frame,
          output: resolve(
            directory,
            `${id}-${String(frame).padStart(3, "0")}.png`,
          ),
          imageFormat: "png",
          scale: 0.5,
        });
        console.log(`${id}: frame ${frame}`);
      }
    } else {
      const file = resolve(output, `${id}.mp4`);
      await renderMedia({
        serveUrl: bundle,
        composition,
        puppeteerInstance: browser,
        outputLocation: file,
        codec: "h264",
        muted: true,
        crf: 18,
        pixelFormat: "yuv420p",
        concurrency: 2,
      });
      console.log(`Rendered ${file}`);
    }
  }
} finally {
  await browser.close({ silent: true });
}

import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

import {
  getCompositions,
  openBrowser,
  renderMedia,
  renderStill,
} from "@remotion/renderer";
import { Effect } from "effect";

import {
  samplerShots,
  SAMPLER_FRAMES,
} from "../src/components/shotcraft/timing";
import { fail, io, main, spawn } from "./io";

const program = Effect.gen(function* () {
  const [command, edition] = process.argv.slice(2);
  if (
    (command !== "inspect" && command !== "render") ||
    (edition && edition !== "landscape" && edition !== "vertical")
  )
    return yield* fail(
      "Usage: bun scripts/shotcraft.ts <inspect|render> [landscape|vertical]",
    );
  const output = resolve("out/shotcraft");
  const bundle = resolve(output, "bundle");
  yield* io(`Create ${output}`, () => mkdir(output, { recursive: true }));
  const child = yield* spawn(
    ["bunx", "remotion", "bundle", "src/index.ts", `--out-dir=${bundle}`],
    { cwd: process.cwd(), stdout: "inherit", stderr: "inherit" },
  );
  if ((yield* io("Shotcraft bundle", () => child.exited)) !== 0)
    return yield* fail("Shotcraft bundle failed");
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
  ].toSorted((a, b) => a - b);
  const browser = yield* Effect.acquireRelease(
    io("Open the render browser", () => openBrowser("chrome")),
    (opened) =>
      io("Close the render browser", () => opened.close({ silent: true })).pipe(
        Effect.ignore,
      ),
  );
  const compositions = yield* io("Read Shotcraft compositions", () =>
    getCompositions(bundle, { puppeteerInstance: browser }),
  );
  for (const id of ids) {
    const composition = compositions.find((item) => item.id === id);
    if (!composition) return yield* fail(`Missing composition: ${id}`);
    if (command === "inspect") {
      const directory = resolve(output, "qa");
      yield* io(`Create ${directory}`, () =>
        mkdir(directory, { recursive: true }),
      );
      for (const frame of frames) {
        yield* io(`Render ${id} frame ${frame}`, () =>
          renderStill({
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
          }),
        );
        process.stdout.write(`${id}: frame ${frame}\n`);
      }
    } else {
      const file = resolve(output, `${id}.mp4`);
      yield* io(`Render ${id}`, () =>
        renderMedia({
          serveUrl: bundle,
          composition,
          puppeteerInstance: browser,
          outputLocation: file,
          codec: "h264",
          muted: true,
          crf: 18,
          pixelFormat: "yuv420p",
          concurrency: 2,
        }),
      );
      process.stdout.write(`Rendered ${file}\n`);
    }
  }
  return undefined;
}).pipe(Effect.scoped);

await main(program);

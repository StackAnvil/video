import { mkdir, rename } from "node:fs/promises";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { emptyProduction, type Production } from "../src/production";

export const root = resolve(import.meta.dirname, "..");
export const manifest = resolve(root, "production.local.json");
export async function load(): Promise<Production> {
  if (!(await Bun.file(manifest).exists()))
    return structuredClone(emptyProduction);
  return Bun.file(manifest).json();
}
export async function save(production: Production) {
  const temporary = `${manifest}.tmp`;
  await Bun.write(temporary, `${JSON.stringify(production, null, 2)}\n`);
  await rename(temporary, manifest);
}
export async function hash(path: string) {
  return createHash("sha256")
    .update(new Uint8Array(await Bun.file(path).arrayBuffer()))
    .digest("hex");
}
export async function run(command: string[]) {
  const child = Bun.spawn(command, {
    cwd: root,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0)
    throw new Error(`${command[0]} failed: ${stderr.slice(-1500)}`);
  return stdout.trim();
}
export async function mediaDuration(path: string) {
  const result = Number(
    await run([
      "ffprobe",
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      path,
    ]),
  );
  if (!Number.isFinite(result) || result <= 0)
    throw new Error("Invalid media duration");
  return result;
}
export async function directory(path: string) {
  await mkdir(resolve(root, path), { recursive: true });
}

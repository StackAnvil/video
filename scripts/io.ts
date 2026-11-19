// oxlint-disable-next-line effecttsgo/node-builtin-import -- Native filesystem operations are wrapped at the I/O boundary.
import { mkdir, rename } from "node:fs/promises";
// oxlint-disable-next-line effecttsgo/node-builtin-import -- Resolve local paths with the host platform semantics.
import { resolve } from "node:path";

import { Effect, Schema } from "effect";

import { emptyProduction, type Production } from "../src/production";

// oxlint-disable-next-line unicorn/throw-new-error -- Schema.TaggedError is a class factory.
export class ToolError extends Schema.TaggedError<
  ToolError,
  { readonly brand: unique symbol }
>()("ToolError", {
  message: Schema.String,
  cause: Schema.optionalKey(Schema.Unknown),
}) {}

export const encodeJson = Schema.encodeSync(
  Schema.fromJsonString(Schema.Unknown),
);
export const encodeIndentedJson = Schema.encodeSync(
  Schema.fromJsonString(Schema.Unknown, { space: 2 }),
);

export const reason = (cause: unknown) =>
  cause instanceof Error ? cause.message : String(cause);

/** Wraps a promise-based call and names it in the failure message. */
export const io = <A>(
  label: string,
  task: (signal: AbortSignal) => Promise<A>,
) =>
  Effect.tryPromise({
    try: task,
    catch: (cause) =>
      ToolError.make({ message: `${label}: ${reason(cause)}`, cause }),
  });

export const fail = (message: string) =>
  Effect.fail(ToolError.make({ message }));

/** Runs a script at the edge and reports typed failures without a stack. */
export const main = (program: Effect.Effect<unknown, ToolError>) =>
  Effect.runPromise(
    program.pipe(
      Effect.catchTag("ToolError", (error) =>
        Effect.sync(() => {
          process.stderr.write(`${error.message}\n`);
          process.exitCode = 1;
        }),
      ),
    ),
  );

/** Decodes unknown input and turns schema issues into a ToolError. */
export const decode =
  <S extends Schema.Decoder<unknown>>(schema: S, label: string) =>
  (input: unknown): Effect.Effect<S["Type"], ToolError> =>
    Schema.decodeUnknownEffect(schema)(input).pipe(
      Effect.mapError((cause) =>
        ToolError.make({ message: `${label}: ${cause.message}`, cause }),
      ),
    );

const Finite = Schema.Finite;
const Focus = Schema.Struct({
  x: Finite,
  y: Finite,
  width: Finite,
  height: Finite,
});
const Caption = Schema.Struct({
  text: Schema.String,
  startMs: Finite,
  endMs: Finite,
  timestampMs: Schema.NullOr(Finite),
  confidence: Schema.NullOr(Finite),
  pageBreakAfter: Schema.optionalKey(Schema.Boolean),
});
const Asset = {
  file: Schema.String,
  sha256: Schema.String,
  duration: Finite,
};
const ProductionManifest = Schema.Struct({
  clips: Schema.Record(
    Schema.String,
    Schema.Struct({
      ...Asset,
      reviewed: Schema.Boolean,
      provenance: Schema.String,
      recordedAt: Schema.String,
      focus: Schema.optionalKey(Focus),
      portraitMenus: Schema.optionalKey(
        Schema.mutable(
          Schema.Array(
            Schema.Struct({ from: Finite, to: Finite, focus: Focus }),
          ),
        ),
      ),
    }),
  ),
  voices: Schema.Record(
    Schema.String,
    Schema.Struct({
      ...Asset,
      text: Schema.String,
      captions: Schema.mutable(Schema.Array(Caption)),
    }),
  ),
  music: Schema.optionalKey(
    Schema.Struct({ ...Asset, license: Schema.String }),
  ),
});
export const decodeProduction = (
  input: unknown,
): Effect.Effect<Production, ToolError> =>
  decode(ProductionManifest, "production.local.json is malformed")(input);

export const root = resolve(import.meta.dirname, "..");
const manifest = resolve(root, "production.local.json");

export const exists = (path: string) =>
  io(`Check ${path}`, () => Bun.file(path).exists());
export const readJson = (path: string) =>
  io(`Read ${path}`, (): Promise<unknown> => Bun.file(path).json());
export const write = (
  path: string,
  data: string | Uint8Array | ArrayBuffer | Buffer,
) => io(`Write ${path}`, () => Bun.write(path, data));
export const move = (from: string, to: string) =>
  io(`Move ${from}`, () => rename(from, to));

export const load = Effect.fnUntraced(function* () {
  if (!(yield* exists(manifest))) return structuredClone(emptyProduction);
  const input = yield* readJson(manifest);
  return yield* decodeProduction(input);
});
export const save = Effect.fnUntraced(function* (production: Production) {
  const temporary = `${manifest}.tmp`;
  yield* write(temporary, `${encodeIndentedJson(production)}\n`);
  yield* move(temporary, manifest);
});
export const hash = (path: string) =>
  io(`Hash ${path}`, async () =>
    new Bun.CryptoHasher("sha256")
      .update(new Uint8Array(await Bun.file(path).arrayBuffer()))
      .digest("hex"),
  );

/** Starts a process that is killed if the scope closes before it exits. */
export const spawn = <
  const Out extends Bun.Spawn.Readable = "pipe",
  const Err extends Bun.Spawn.Readable = "inherit",
>(
  command: [string, ...string[]],
  options: Bun.Spawn.SpawnOptions<"ignore", Out, Err> = {},
) =>
  Effect.acquireRelease(
    Effect.try({
      try: () => Bun.spawn(command, { cwd: root, ...options }),
      catch: (cause) =>
        ToolError.make({
          message: `Cannot start ${command[0]}: ${reason(cause)}`,
          cause,
        }),
    }),
    (child) =>
      Effect.sync(() => {
        if (child.exitCode === null) child.kill();
      }),
  );

/** Runs a command and returns its trimmed stdout. */
export const run = Effect.fnUntraced(function* (
  command: [string, ...string[]],
) {
  const child = yield* spawn(command, { stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, code] = yield* io(command[0], () =>
    Promise.all([
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
      child.exited,
    ]),
  );
  if (code !== 0)
    return yield* fail(`${command[0]} failed: ${stderr.slice(-1500)}`);
  return stdout.trim();
}, Effect.scoped);

export const mediaDuration = Effect.fnUntraced(function* (path: string) {
  const output = yield* run([
    "ffprobe",
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    path,
  ]);
  const result = Number(output);
  if (!Number.isFinite(result) || result <= 0)
    return yield* fail("Invalid media duration");
  return result;
});
export const directory = (path: string) =>
  io(`Create ${path}`, () => mkdir(resolve(root, path), { recursive: true }));

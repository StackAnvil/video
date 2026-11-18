import { Config, Duration, Effect, Option, Redacted } from "effect";

import { fail, io, ToolError } from "./io";

const configuration = <A>(config: Config.Config<A>) =>
  config.pipe(
    Effect.mapError(
      (cause) =>
        new ToolError({
          message: `Invalid configuration: ${cause.message}`,
          cause,
        }),
    ),
  );

/** Reads an optional string setting from the environment. */
export const setting = (name: string, fallback: string) =>
  configuration(Config.String(name).pipe(Config.withDefault(fallback)));

const apiKey = (purpose: string) =>
  Effect.gen(function* () {
    const key = yield* configuration(
      Config.option(Config.Redacted("ELEVENLABS_API_KEY")),
    );
    if (Option.isNone(key) || Redacted.value(key.value) === "")
      return yield* fail(`Set ELEVENLABS_API_KEY to generate ${purpose}`);
    return key.value;
  });

export interface ElevenLabsRequest {
  path: string;
  body: string;
  /** Names the generated media in the missing-key message. */
  purpose: string;
  timeoutSeconds: number;
  rejected: (status: number) => string;
}

/**
 * Sends one POST request to the ElevenLabs API and reads the whole body
 * within the timeout.
 */
export const elevenLabs = Effect.fnUntraced(function* (
  request: ElevenLabsRequest,
) {
  const key = yield* apiKey(request.purpose);
  const response = yield* io(
    `ElevenLabs ${request.purpose} request`,
    async (signal) => {
      const reply = await fetch(
        `https://api.elevenlabs.io/v1/${request.path}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": Redacted.value(key),
            "Content-Type": "application/json",
          },
          body: request.body,
          signal,
        },
      );
      return {
        status: reply.status,
        headers: reply.headers,
        bytes: reply.ok ? await reply.arrayBuffer() : undefined,
      };
    },
  ).pipe(
    Effect.timeoutOrElse({
      duration: Duration.seconds(request.timeoutSeconds),
      orElse: () =>
        fail(
          `ElevenLabs ${request.purpose} request timed out after ${request.timeoutSeconds}s`,
        ),
    }),
  );
  if (!response.bytes) return yield* fail(request.rejected(response.status));
  return { headers: response.headers, bytes: response.bytes };
});

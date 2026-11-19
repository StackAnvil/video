import { Config, Duration, Effect, Option, Redacted } from "effect";
import { HttpClient, HttpClientRequest } from "effect/http";

import { fail, reason, ToolError } from "./io";

const configuration = <A>(config: Config.Config<A>) =>
  config.pipe(
    Effect.mapError((cause) =>
      ToolError.make({
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
  const post = HttpClientRequest.post(
    `https://api.elevenlabs.io/v1/${request.path}`,
    { headers: { "xi-api-key": Redacted.value(key) } },
  ).pipe(HttpClientRequest.bodyText(request.body, "application/json"));
  const response = yield* Effect.gen(function* () {
    const reply = yield* HttpClient.execute(post);
    if (reply.status < 200 || reply.status >= 300)
      return yield* fail(request.rejected(reply.status));
    return {
      headers: new Headers(reply.headers),
      bytes: yield* reply.arrayBuffer,
    };
  }).pipe(
    Effect.mapError((cause) =>
      cause instanceof ToolError
        ? cause
        : ToolError.make({
            message: `ElevenLabs ${request.purpose} request: ${reason(cause.cause ?? cause)}`,
            cause,
          }),
    ),
    Effect.timeoutOrElse({
      duration: Duration.seconds(request.timeoutSeconds),
      orElse: () =>
        fail(
          `ElevenLabs ${request.purpose} request timed out after ${request.timeoutSeconds}s`,
        ),
    }),
  );
  return response;
});

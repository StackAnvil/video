import { afterEach, describe, expect, spyOn, test } from "bun:test";

import { ConfigProvider, Effect } from "effect";
import { FetchHttpClient, type HttpClient } from "effect/http";

import { required } from "../src/required";
import { elevenLabs, setting, type ElevenLabsRequest } from "./elevenlabs";

const withEnv =
  (env: Record<string, string>) =>
  <A, E>(effect: Effect.Effect<A, E, HttpClient.HttpClient>) =>
    effect.pipe(
      // oxlint-disable-next-line effecttsgo/strict-effect-provide -- This test harness provides the layer for each test run.
      Effect.provide(FetchHttpClient.layer),
      Effect.provideService(FetchHttpClient.Fetch, globalThis.fetch),
      Effect.provideService(
        ConfigProvider.ConfigProvider,
        ConfigProvider.fromEnvRecord(env),
      ),
    );
const request: ElevenLabsRequest = {
  path: "music?output_format=auto",
  body: "{}",
  purpose: "music",
  timeoutSeconds: 5,
  rejected: (status) => `Eleven Music returned ${status}`,
};
const failure = (env: Record<string, string>, input = request) =>
  Effect.runPromise(Effect.flip(elevenLabs(input).pipe(withEnv(env)))).then(
    (error) => error.message,
  );

afterEach(() => {
  spyOn(globalThis, "fetch").mockRestore();
});

describe("settings", () => {
  test("fall back when the variable is missing", async () => {
    expect(
      await Effect.runPromise(
        setting("STACKANVIL_MUSIC", "original").pipe(withEnv({})),
      ),
    ).toBe("original");
    expect(
      await Effect.runPromise(
        setting("STACKANVIL_MUSIC", "original").pipe(
          withEnv({ STACKANVIL_MUSIC: "elevenlabs" }),
        ),
      ),
    ).toBe("elevenlabs");
  });
});

describe("ElevenLabs requests", () => {
  test("require a non-empty API key before any request", async () => {
    const fetch = spyOn(globalThis, "fetch");
    expect(await failure({})).toBe("Set ELEVENLABS_API_KEY to generate music");
    expect(await failure({ ELEVENLABS_API_KEY: "" })).toBe(
      "Set ELEVENLABS_API_KEY to generate music",
    );
    expect(fetch).not.toHaveBeenCalled();
  });
  test("send the key and return the response body", async () => {
    const fetch = spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("audio", { headers: { "song-id": "song-1" } }),
    );
    const response = await Effect.runPromise(
      elevenLabs(request).pipe(withEnv({ ELEVENLABS_API_KEY: "secret" })),
    );
    expect(new TextDecoder().decode(response.bytes)).toBe("audio");
    expect(response.headers.get("song-id")).toBe("song-1");
    const [url, init] = required(fetch.mock.calls[0], "fetch call");
    expect(url).toEqual(
      new URL("https://api.elevenlabs.io/v1/music?output_format=auto"),
    );
    expect(new Headers(init?.headers).get("xi-api-key")).toBe("secret");
  });
  test("report a rejected request with its status", async () => {
    spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("quota", { status: 429 }),
    );
    expect(await failure({ ELEVENLABS_API_KEY: "secret" })).toBe(
      "Eleven Music returned 429",
    );
  });
  test("abort a request that exceeds the timeout", async () => {
    let aborted = false;
    const hanging = (_input: RequestInfo | URL, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          aborted = true;
          reject(new Error("aborted"));
        });
      });
    spyOn(globalThis, "fetch").mockImplementation(
      Object.assign(hanging, { preconnect: globalThis.fetch.preconnect }),
    );
    expect(
      await failure(
        { ELEVENLABS_API_KEY: "secret" },
        { ...request, timeoutSeconds: 0.01 },
      ),
    ).toBe("ElevenLabs music request timed out after 0.01s");
    expect(aborted).toBe(true);
  });
});

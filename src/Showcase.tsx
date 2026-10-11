import { Fragment } from "react";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "./brand";
import { Captions } from "./components/Captions";
import { FPS, TRANSITION, VOICE_DELAY, VOICE_TAIL } from "./config";
import { timeline, type VideoProps } from "./production";
import { Gameplay } from "./scenes/Gameplay";
import { Information } from "./scenes/Information";
import { Outro } from "./scenes/Outro";

export function Showcase({ production, captions, draft, edition }: VideoProps) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const entries = timeline(production, edition);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.dark,
        color: brand.paper,
        fontFamily: brand.body,
      }}
    >
      <TransitionSeries>
        {entries.map(({ scene, frames }, index) => (
          <Fragment key={scene.id}>
            {index > 0 && (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION })}
              />
            )}
            <TransitionSeries.Sequence durationInFrames={frames}>
              {scene.kind === "footage" ? (
                <Gameplay clip={production.clips[scene.clip]} scene={scene} />
              ) : scene.kind === "outro" ? (
                <Outro />
              ) : (
                <Information scene={scene} />
              )}
            </TransitionSeries.Sequence>
          </Fragment>
        ))}
      </TransitionSeries>
      {entries.map(({ scene, start }) => {
        const voice = production.voices[scene.id];
        return (
          voice && (
            <Sequence
              key={scene.id}
              from={start + VOICE_DELAY}
              durationInFrames={Math.ceil(voice.duration * FPS) + VOICE_TAIL}
              layout="none"
            >
              <Audio src={staticFile(voice.file)} />
              {captions && <Captions captions={voice.captions} />}
            </Sequence>
          )
        );
      })}
      {production.music && (
        <Audio
          src={staticFile(production.music.file)}
          volume={(f) => {
            const duck = entries.reduce((gain, { scene, start }) => {
              const voice = production.voices[scene.id];
              if (!voice) return gain;
              const from = start + VOICE_DELAY;
              const end = from + voice.duration * FPS;
              return Math.min(
                gain,
                interpolate(
                  f,
                  [from - 15, from, end, end + 24],
                  [0.27, 0.14, 0.14, 0.27],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                ),
              );
            }, 0.27);
            return (
              interpolate(
                f,
                [0, 45, durationInFrames - 60, durationInFrames - 1],
                [0, 1, 1, 0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              ) * duck
            );
          }}
        />
      )}
      {draft && (
        <div
          style={{
            position: "absolute",
            right: 36,
            bottom: 22,
            fontSize: 24,
            color: brand.muted,
          }}
        >
          Production preview · {Math.floor(frame / FPS)}s
        </div>
      )}
    </AbsoluteFill>
  );
}

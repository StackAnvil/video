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
import { FPS, TRANSITION, VOICE_DELAY } from "./config";
import { timeline, type VideoProps } from "./production";
import { Gameplay } from "./scenes/Gameplay";
import { Intro } from "./scenes/Intro";
import { Outro } from "./scenes/Outro";
import { Routes } from "./scenes/Routes";

export function Showcase({ production, captions, draft }: VideoProps) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const entries = timeline(production);
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
              {scene.kind === "intro" ? (
                <Intro clip={production.clips[scene.clip]} />
              ) : scene.kind === "routes" ? (
                <Routes />
              ) : scene.kind === "outro" ? (
                <Outro />
              ) : (
                <Gameplay
                  clip={production.clips[scene.clip]}
                  name={scene.clip}
                  title={scene.title}
                  label={scene.label}
                />
              )}
            </TransitionSeries.Sequence>
          </Fragment>
        ))}
      </TransitionSeries>
      {entries.map(({ scene, start, frames }) => {
        const voice = production.voices[scene.id];
        return (
          voice && (
            <Sequence
              key={scene.id}
              from={start + VOICE_DELAY}
              durationInFrames={frames - VOICE_DELAY - TRANSITION}
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
            const speaking = entries.some(({ scene, start }) => {
              const voice = production.voices[scene.id];
              return (
                voice &&
                f >= start + VOICE_DELAY &&
                f < start + VOICE_DELAY + voice.duration * FPS
              );
            });
            return (
              interpolate(
                f,
                [0, 30, durationInFrames - 45, durationInFrames - 1],
                [0, 1, 1, 0],
                { extrapolateRight: "clamp" },
              ) * (speaking ? 0.14 : 0.3)
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

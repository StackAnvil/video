import type { ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { characters, progress, PUSH_FRAMES } from "./timing";
import { shotcraftTheme as theme } from "./theme";

// Adapted from logo-shrink-wordmark-lockup. The mark never rotates with the ring.
export function BrandOutro({
  name,
  address,
  mark,
}: {
  name: string;
  address: string;
  mark: ReactNode;
}) {
  const { width, height, fps } = useVideoConfig();
  const frame = (useCurrentFrame() * 30) / fps - PUSH_FRAMES;
  const portrait = height > width;
  const t = frame / 131;
  const cubic = Easing.inOut((value: number) => value ** 3);
  const quad = (value: number) => value ** 2;
  const outCubic = Easing.out((value: number) => value ** 3);
  const letters = characters(name);
  const scale =
    (5.4 - 4.4 * progress(t, 0.02, 0.26, cubic)) *
    (1 +
      Math.sin(progress(t, 0.26, 0.11, (value: number) => value) * Math.PI) *
        0.06);
  const heal = progress(t, 0.1, 0.18, Easing.inOut(quad));
  const markIn = progress(t, 0.24, 0.08, Easing.inOut(quad));
  const shift = progress(t, 0.34, 0.13, cubic);
  const fontSize = portrait ? 72 : 100;
  // The flex row sizes the lockup from the rendered brand name.
  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        fontFamily: theme.body,
        alignItems: "center",
        justifyContent: "center",
        gap: 56,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 24 * shift,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 112,
            height: 112,
            flexShrink: 0,
            scale,
          }}
        >
          {markIn < 1 ? (
            <svg
              viewBox="0 0 112 112"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                rotate: `${-150 * progress(t, 0, 0.3, outCubic)}deg`,
                opacity: 1 - markIn,
              }}
            >
              <circle
                cx="56"
                cy="56"
                r="39"
                fill="none"
                stroke={theme.accent}
                strokeWidth="8"
                pathLength="1"
                strokeDasharray={`${0.42 + 0.08 * heal} ${0.08 * (1 - heal)}`}
              />
            </svg>
          ) : null}
          <div style={{ position: "absolute", inset: 0, opacity: markIn }}>
            {mark}
          </div>
        </div>
        <div
          style={{
            width: shift === 1 ? "auto" : undefined,
            maxWidth: shift === 1 ? undefined : width * shift,
            overflow: "hidden",
            fontFamily: theme.display,
            fontWeight: 750,
            fontSize,
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}
        >
          {letters.map(({ id, text }, position) => {
            const p = progress(
              t,
              0.46 + (position * 0.24) / letters.length,
              0.1,
              outCubic,
            );
            return (
              <span
                key={id}
                style={{
                  display: "inline-block",
                  opacity: p,
                  translate: `${(1 - p) * 32}px 0`,
                  filter: p === 1 ? undefined : `blur(${(1 - p) * 10}px)`,
                }}
              >
                {text}
              </span>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: height / 2 + 110,
          left: 80,
          right: 100,
          textAlign: "center",
          fontSize: portrait ? 58 : 44,
          color: theme.accent,
          opacity: progress(t, 0.72, 0.12, Easing.out(quad)),
          translate: `0 ${(1 - progress(t, 0.72, 0.14)) * 12}px`,
        }}
      >
        {address}
      </div>
    </AbsoluteFill>
  );
}

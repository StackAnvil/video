import type { ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { characters, chapterTiming, progress, PUSH_FRAMES } from "./timing";
import { shotcraftTheme as theme } from "./theme";

// Adapted from title-demote-to-label, variant A. Content stays on its own clock.
export function ChapterFocus({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { width, height, fps } = useVideoConfig();
  const frame = (useCurrentFrame() * 30) / fps - PUSH_FRAMES;
  const portrait = height > width;
  const fontSize = portrait ? 112 : 200;
  const labelSize = portrait ? 58 : 44;
  const letters = characters(title);
  const timing = chapterTiming(letters.length);
  const demoteAt = (f: number) =>
    progress(f, timing.demote, 26, Easing.bezier(0.6, 0, 0.18, 1));
  const demote = demoteAt(frame);
  const velocity = demoteAt(frame + 0.5) - demoteAt(frame - 0.5);
  const reveal = progress(frame, 0, timing.revealEnd);
  const grow = progress(frame, timing.content, 22);
  const margin = portrait ? 96 : 120;
  const targetY = portrait ? 240 : 160;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.surface,
        color: theme.text,
        fontFamily: theme.body,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: margin,
          right: margin,
          top: portrait ? 350 : 260,
          bottom: portrait ? 330 : 100,
          opacity: grow,
          translate: `0 ${(1 - grow) * 30}px`,
          clipPath: grow === 1 ? undefined : `inset(0 ${(1 - grow) * 70}% 0 0)`,
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          left: width / 2 + (margin - width / 2) * demote,
          top: height / 2 + (targetY - height / 2) * demote,
          translate: `${-50 * (1 - demote)}% -50%`,
          scale: 1 + (labelSize / fontSize - 1) * demote,
          transformOrigin: "left center",
          whiteSpace: "nowrap",
          fontFamily: theme.display,
          fontSize,
          fontWeight: 750,
          lineHeight: 1.1,
          filter:
            velocity === 0
              ? undefined
              : `blur(${Math.min(12, Math.abs(velocity * (margin - width / 2)) * 0.2)}px)`,
          opacity: reveal,
        }}
      >
        {letters.map(({ id, text }, position) => (
          <span
            key={id}
            style={{
              display: "inline-block",
              overflow: "hidden",
              whiteSpace: "pre",
            }}
          >
            <span
              style={{
                display: "inline-block",
                translate: `0 ${(1 - progress(frame, position * 1.6, 16)) * 100}%`,
              }}
            >
              {text}
            </span>
          </span>
        ))}
        <span style={{ color: theme.accent }}>.</span>
      </div>
    </AbsoluteFill>
  );
}

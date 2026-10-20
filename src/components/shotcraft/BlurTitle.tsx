import type { CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { progress } from "./timing";

// Adapted from demos/typography/blur-slide/BlurSlide.tsx (Apache-2.0).
function Words({
  text,
  start,
  subtitle = false,
  style,
}: {
  text: string;
  start: number;
  subtitle?: boolean;
  style?: CSSProperties;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const occurrences = new Map<string, number>();
  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const occurrence = (occurrences.get(word) ?? 0) + 1;
      occurrences.set(word, occurrence);
      return { id: `${word}:${occurrence}`, word };
    });
  const stagger = subtitle || words.length > 8 ? 2.4 : 4;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.12em 0.26em",
        ...style,
      }}
    >
      {words.map(({ id, word }, order) => {
        const p = progress(
          (frame * 30) / fps,
          start + order * stagger,
          subtitle ? 20 : 22,
        );
        return (
          <span
            key={id}
            style={{
              display: "inline-block",
              opacity: p,
              translate: `0 ${(1 - p) * (subtitle ? 26 : 64)}px`,
              filter:
                p === 1
                  ? undefined
                  : `blur(${(1 - p) * (subtitle ? 9 : 18)}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}

export function BlurTitle({
  title,
  subtitle,
  delay = 0,
  style,
  subtitleStyle,
}: {
  title: string;
  subtitle: string;
  delay?: number;
  style?: CSSProperties;
  subtitleStyle?: CSSProperties;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
      <Words text={title} start={delay + 10} style={style} />
      <Words
        text={subtitle}
        start={delay + 34}
        subtitle
        style={subtitleStyle}
      />
    </div>
  );
}

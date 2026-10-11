import { useCurrentFrame, useVideoConfig } from "remotion";
import type { Caption } from "@remotion/captions";
import { brand } from "../brand";

export function Captions({ captions }: { captions: Caption[] }) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const vertical = height > width;
  const current = captions.find(
    (caption) =>
      caption.startMs <= (frame / fps) * 1000 &&
      caption.endMs > (frame / fps) * 1000,
  );
  if (!current) return null;
  return (
    <div
      style={{
        position: "absolute",
        bottom: vertical ? 330 : 66,
        left: vertical ? 64 : 150,
        right: vertical ? 155 : 150,
        textAlign: "center",
        fontFamily: brand.body,
        fontSize: vertical ? 54 : 42,
        fontWeight: 600,
        lineHeight: 1.3,
      }}
    >
      <span
        style={{
          backgroundColor: "rgba(24,35,30,0.94)",
          color: brand.paper,
          padding: "12px 22px",
          boxDecorationBreak: "clone",
        }}
      >
        {current.text.trim()}
      </span>
    </div>
  );
}

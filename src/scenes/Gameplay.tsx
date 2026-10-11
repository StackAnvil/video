import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { brand } from "../brand";
import { Footage } from "../components/Footage";
import type { Clip } from "../production";

export function Gameplay({
  clip,
  title,
  label,
  name,
}: {
  clip?: Clip;
  title: string;
  label: string;
  name: string;
}) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: "195px 96px 190px",
          backgroundColor: brand.dark,
        }}
      >
        <Footage clip={clip} name={name} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          right: 96,
          top: 65,
          opacity: interpolate(frame, [6, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{ fontFamily: brand.display, fontSize: 76, lineHeight: 1.1 }}
        >
          {title}
        </div>
        <div style={{ fontSize: 30, color: brand.muted, marginTop: 14 }}>
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
}

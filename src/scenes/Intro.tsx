import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { brand } from "../brand";
import { BrandMark } from "../components/BrandMark";
import { Footage } from "../components/Footage";
import type { Clip } from "../production";

export function Intro({ clip }: { clip?: Clip }) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Footage clip={clip} name="gameplay" />
      <AbsoluteFill
        style={{
          background: "rgba(24,35,30,0.66)",
          padding: 96,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 36,
          }}
        >
          <BrandMark />
          <div style={{ fontSize: 36 }}>StackAnvil</div>
        </div>
        <div
          style={{
            fontFamily: brand.display,
            fontSize: 140,
            lineHeight: 1.08,
            whiteSpace: "pre-line",
            opacity: interpolate(frame, [0, 18], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          Java client.{"\n"}
          <span style={{ color: brand.mint }}>Bedrock server.</span>
        </div>
        <div style={{ fontSize: 34, marginTop: 32 }}>
          Real gameplay, captured in Java Edition
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

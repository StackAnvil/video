import type { CSSProperties } from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../brand";

const unit = 18;
type Uv = readonly [number, number];
function SkinFace({
  uv,
  width,
  height,
  transform,
}: {
  uv: Uv;
  width: number;
  height: number;
  transform: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: width * unit,
        height: height * unit,
        overflow: "hidden",
        backfaceVisibility: "hidden",
        transform,
      }}
    >
      <Img
        src={staticFile("media/cameo/community-skin.png")}
        style={{
          position: "absolute",
          width: 64 * unit,
          height: 64 * unit,
          left: -uv[0] * unit,
          top: -uv[1] * unit,
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
function Part({
  width,
  height,
  depth,
  front,
  side,
  top,
  outer,
  style,
}: {
  outer: { front: Uv; side: Uv; top: Uv };
  width: number;
  height: number;
  depth: number;
  front: Uv;
  side: Uv;
  top: Uv;
  style: CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: width * unit,
        height: height * unit,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      <SkinFace
        uv={front}
        width={width}
        height={height}
        transform={`translateZ(${(depth * unit) / 2}px)`}
      />
      <SkinFace
        uv={side}
        width={depth}
        height={height}
        transform={`translateX(${(-depth * unit) / 2}px) rotateY(-90deg)`}
      />
      <SkinFace
        uv={top}
        width={width}
        height={depth}
        transform={`translateY(${(-depth * unit) / 2}px) rotateX(90deg)`}
      />
      <SkinFace
        uv={outer.front}
        width={width}
        height={height}
        transform={`translateZ(${(depth / 2 + 0.4) * unit}px) scale(1.08)`}
      />
      <SkinFace
        uv={outer.side}
        width={depth}
        height={height}
        transform={`translateX(${-(depth / 2 + 0.4) * unit}px) rotateY(-90deg) scale(1.08)`}
      />
      <SkinFace
        uv={outer.top}
        width={width}
        height={depth}
        transform={`translateY(${-(depth / 2 + 0.4) * unit}px) rotateX(90deg) scale(1.08)`}
      />
    </div>
  );
}

export function Cameo() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  return (
    <AbsoluteFill
      style={{
        padding: vertical ? "190px 80px 380px" : "100px 150px 190px",
        justifyContent: "center",
        gap: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: vertical ? "column" : "row",
          alignItems: "center",
          gap: vertical ? 50 : 110,
        }}
      >
        <div
          style={{ width: 380, height: 620, perspective: 1800, flexShrink: 0 }}
        >
          <div
            style={{
              position: "relative",
              width: 288,
              height: 576,
              margin: "20px auto",
              transformStyle: "preserve-3d",
              transform: `rotateY(-18deg) rotateX(4deg)`,
              opacity: interpolate(frame, [0, 12], [0, 1], {
                extrapolateRight: "clamp",
              }),
            }}
          >
            <Part
              width={8}
              height={8}
              depth={8}
              outer={{ front: [40, 8], side: [32, 8], top: [40, 0] }}
              front={[8, 8]}
              side={[0, 8]}
              top={[8, 0]}
              style={{
                left: 4 * unit,
                top: 0,
                transformOrigin: "50% 100%",
                rotate: "9deg",
              }}
            />
            <Part
              width={8}
              height={12}
              depth={4}
              outer={{ front: [20, 36], side: [16, 36], top: [20, 32] }}
              front={[20, 20]}
              side={[16, 20]}
              top={[20, 16]}
              style={{ left: 4 * unit, top: 8 * unit }}
            />
            <Part
              width={4}
              height={12}
              depth={4}
              outer={{ front: [44, 36], side: [40, 36], top: [44, 32] }}
              front={[44, 20]}
              side={[40, 20]}
              top={[44, 16]}
              style={{
                left: 0,
                top: 8 * unit,
                transformOrigin: "50% 0",
                rotate: "12deg",
              }}
            />
            <Part
              width={4}
              height={12}
              depth={4}
              outer={{ front: [52, 52], side: [48, 52], top: [52, 48] }}
              front={[36, 52]}
              side={[32, 52]}
              top={[36, 48]}
              style={{
                left: 12 * unit,
                top: 8 * unit,
                transformOrigin: "50% 0",
                rotate: "-12deg",
              }}
            />
            <Part
              width={4}
              height={12}
              depth={4}
              outer={{ front: [4, 36], side: [0, 36], top: [4, 32] }}
              front={[4, 20]}
              side={[0, 20]}
              top={[4, 16]}
              style={{ left: 4 * unit, top: 20 * unit }}
            />
            <Part
              width={4}
              height={12}
              depth={4}
              outer={{ front: [4, 52], side: [0, 52], top: [4, 48] }}
              front={[20, 52]}
              side={[16, 52]}
              top={[20, 48]}
              style={{ left: 8 * unit, top: 20 * unit }}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 42,
            maxWidth: 1040,
            order: vertical ? -1 : 0,
          }}
        >
          <div
            style={{
              fontFamily: brand.display,
              fontSize: vertical ? 82 : 106,
              lineHeight: 1.12,
            }}
          >
            Your friends picked
            <br />a Bedrock server.
          </div>
          <div
            style={{
              fontSize: vertical ? 42 : 54,
              lineHeight: 1.35,
              color: brand.mint,
            }}
          >
            You want to keep playing Java.
          </div>
        </div>
      </div>
      <div style={{ fontSize: vertical ? 28 : 26, color: brand.muted }}>
        Community skin cameo · fictional dialogue
      </div>
    </AbsoluteFill>
  );
}

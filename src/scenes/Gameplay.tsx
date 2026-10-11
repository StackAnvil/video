import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../brand";
import { Footage } from "../components/Footage";
import type { Clip } from "../production";
import { FPS, type Scene } from "../config";
export function Gameplay({
  clip,
  scene,
}: {
  clip?: Clip;
  scene: Extract<Scene, { kind: "footage" }>;
}) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  const menu = vertical
    ? clip?.portraitMenus?.find(
        (range) => frame / FPS >= range.from && frame / FPS < range.to,
      )
    : undefined;
  const framing = menu ? "menu" : scene.framing;
  const opacity = interpolate(frame, [8, 20, 100, 118], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: vertical && framing !== "world" ? "330px 0 430px" : "0",
          backgroundColor: brand.dark,
        }}
      >
        <Footage
          clip={clip}
          name={scene.clip}
          framing={framing}
          focus={menu?.focus}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: vertical ? 64 : 58,
          right: vertical ? 90 : 320,
          top: vertical ? 160 : 48,
          opacity,
          textShadow: "0 2px 8px #000",
          backgroundColor: "rgba(24,35,30,0.8)",
          padding: "18px 24px",
        }}
      >
        <div
          style={{
            fontFamily: brand.display,
            fontSize: vertical ? 68 : 54,
            lineHeight: 1.12,
          }}
        >
          {scene.title}
        </div>
        <div
          style={{
            fontSize: vertical ? 30 : 26,
            color: brand.paper,
            marginTop: 10,
          }}
        >
          {scene.label}
        </div>
      </div>
      {scene.annotation && frame >= scene.annotation.from * FPS && (
        <div
          style={{
            position: "absolute",
            top: 64,
            right: 64,
            maxWidth: 650,
            backgroundColor: "rgba(24,35,30,0.88)",
            borderLeft: `4px solid ${brand.mint}`,
            padding: "20px 26px",
            opacity: interpolate(
              frame,
              [scene.annotation.from * FPS, scene.annotation.from * FPS + 15],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
          }}
        >
          <div style={{ color: brand.mint, fontSize: 28 }}>
            {scene.annotation.title}
          </div>
          <div style={{ fontSize: 30, marginTop: 8 }}>
            {scene.annotation.detail}
          </div>
        </div>
      )}
      {vertical && framing !== "world" && (
        <div
          style={{
            position: "absolute",
            left: 64,
            right: 100,
            top: 1270,
            fontSize: 37,
            lineHeight: 1.3,
            color: brand.mint,
          }}
        >
          {scene.label}
        </div>
      )}
    </AbsoluteFill>
  );
}

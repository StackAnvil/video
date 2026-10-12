import { Video } from "@remotion/media";
import { AbsoluteFill, staticFile, useVideoConfig } from "remotion";
import { brand } from "./brand";
import { BrandMark } from "./components/BrandMark";
import type { Production } from "./production";

export type ThumbnailProps = { production: Production };

export function Thumbnail({ production }: ThumbnailProps) {
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  const clip = production.clips["galaxite-actors"];
  const canvasWidth = vertical ? 1080 : 1280;
  const canvasHeight = vertical ? 1920 : 720;

  return (
    <AbsoluteFill style={{ backgroundColor: brand.forest, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: canvasWidth,
          height: canvasHeight,
          scale: width / canvasWidth,
          transformOrigin: "top left",
          color: brand.paper,
        }}
      >
        {clip && (
          <Video
            src={staticFile(clip.file)}
            trimBefore={90}
            muted
            objectFit="cover"
            style={{
              position: "absolute",
              left: vertical ? 0 : 570,
              top: vertical ? 740 : 0,
              width: vertical ? 1080 : 710,
              height: vertical ? 880 : 720,
              objectPosition: "35% center",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            left: vertical ? 76 : 52,
            top: vertical ? 74 : 48,
            display: "flex",
            alignItems: "center",
            gap: vertical ? 24 : 18,
            fontFamily: brand.body,
            fontSize: vertical ? 52 : 36,
            fontWeight: 700,
          }}
        >
          <BrandMark size={vertical ? 76 : 56} />
          StackAnvil
        </div>
        <div
          style={{
            position: "absolute",
            left: vertical ? 76 : 52,
            top: vertical ? 215 : 200,
            fontFamily: brand.display,
            fontSize: vertical ? 158 : 112,
            lineHeight: 1.08,
            letterSpacing: -2,
          }}
        >
          <div>BEDROCK</div>
          <div>SERVERS</div>
          <div style={{ color: brand.mint }}>FROM JAVA</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: vertical ? 76 : 52,
            top: vertical ? 1715 : 623,
            fontFamily: brand.body,
            fontSize: vertical ? 62 : 32,
            fontWeight: 600,
          }}
        >
          Fabric client mod
        </div>
      </div>
    </AbsoluteFill>
  );
}

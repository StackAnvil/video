import { Video } from "@remotion/media";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { staticFile } from "remotion";
import { brand } from "../brand";
import type { Clip, Focus } from "../production";

export function Footage({
  clip,
  name,
  framing = "world",
  focus: focusOverride,
}: {
  clip?: Clip;
  name: string;
  framing?: "world" | "menu" | "web";
  focus?: Focus;
}) {
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  if (!clip)
    return (
      <AbsoluteFill
        style={{
          backgroundColor: brand.dark,
          justifyContent: "center",
          alignItems: "center",
          color: brand.muted,
          fontSize: 38,
        }}
      >
        Production preview: record {name}
      </AbsoluteFill>
    );
  const focus =
    vertical && framing === "menu" ? (focusOverride ?? clip.focus) : undefined;
  const availableHeight =
    vertical && framing !== "world" ? height - 760 : height;
  const scale = focus
    ? Math.min(
        width / (1280 * focus.width),
        availableHeight / (720 * focus.height),
      )
    : 1;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Video
        src={staticFile(clip.file)}
        muted
        objectFit={vertical && framing === "world" ? "cover" : "contain"}
        style={
          focus
            ? {
                position: "absolute",
                width: 1280 * scale,
                height: 720 * scale,
                left:
                  (width - focus.width * 1280 * scale) / 2 -
                  focus.x * 1280 * scale,
                top:
                  (availableHeight - focus.height * 720 * scale) / 2 -
                  focus.y * 720 * scale,
              }
            : { width: "100%", height: "100%" }
        }
      />
    </div>
  );
}

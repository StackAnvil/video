import { Video } from "@remotion/media";
import { AbsoluteFill } from "remotion";
import { staticFile } from "remotion";
import { brand } from "../brand";
import type { Clip } from "../production";

export function Footage({ clip, name }: { clip?: Clip; name: string }) {
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
  return (
    <Video
      src={staticFile(clip.file)}
      muted
      objectFit="contain"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

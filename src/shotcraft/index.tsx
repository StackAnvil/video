import { Composition, Folder } from "remotion";
import { SAMPLER_FRAMES, SHOTCRAFT_FPS } from "../components/shotcraft/timing";
import { ShotcraftSampler } from "./Sampler";

export function ShotcraftLibrary() {
  return (
    <Folder name="Shotcraft">
      <Composition
        id="ShotcraftSampler"
        component={ShotcraftSampler}
        durationInFrames={SAMPLER_FRAMES}
        fps={SHOTCRAFT_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="ShotcraftSamplerVertical"
        component={ShotcraftSampler}
        durationInFrames={SAMPLER_FRAMES}
        fps={SHOTCRAFT_FPS}
        width={1080}
        height={1920}
      />
    </Folder>
  );
}

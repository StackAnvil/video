import { Composition } from "remotion";
import { Showcase } from "./Showcase";
import { FPS } from "./config";
import { duration, emptyProduction } from "./production";
import "@fontsource/anton";
import "@fontsource-variable/space-grotesk";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StackAnvilShowcase"
        component={Showcase}
        fps={FPS}
        width={1920}
        height={1080}
        durationInFrames={duration(emptyProduction)}
        defaultProps={{
          production: emptyProduction,
          captions: true,
          draft: true,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: duration(props.production),
        })}
      />
    </>
  );
};

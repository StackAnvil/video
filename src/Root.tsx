import { Composition } from "remotion";
import { Showcase } from "./Showcase";
import { FPS, type Edition } from "./config";
import { duration, emptyProduction } from "./production";
import "@fontsource/anton";
import "@fontsource-variable/space-grotesk";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {(["landscape", "vertical"] as const).map((edition: Edition) => (
        <Composition
          key={edition}
          id={
            edition === "landscape" ? "StackAnvilShowcase" : "StackAnvilShort"
          }
          component={Showcase}
          fps={FPS}
          width={edition === "landscape" ? 1920 : 1080}
          height={edition === "landscape" ? 1080 : 1920}
          durationInFrames={duration(emptyProduction, edition)}
          defaultProps={{
            production: emptyProduction,
            captions: true,
            draft: true,
            edition,
          }}
          calculateMetadata={({ props }) => ({
            durationInFrames: duration(props.production, edition),
            props: { ...props, edition },
          })}
        />
      ))}
    </>
  );
};

import { Composition, Still } from "remotion";
import { Showcase } from "./Showcase";
import { FPS, type Edition } from "./config";
import { duration, emptyProduction } from "./production";
import { Thumbnail } from "./Thumbnail";
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
      <Still
        id="StackAnvilThumbnail"
        component={Thumbnail}
        width={3840}
        height={2160}
        defaultProps={{ production: emptyProduction, edition: "landscape" }}
      />
      <Still
        id="StackAnvilShortThumbnail"
        component={Thumbnail}
        width={2160}
        height={3840}
        defaultProps={{ production: emptyProduction, edition: "vertical" }}
      />
    </>
  );
};

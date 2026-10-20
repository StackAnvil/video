import type { TransitionPresentationComponentProps } from "@remotion/transitions";
import { AbsoluteFill } from "remotion";
import { pushOffset } from "./timing";

// Adapted from bottom-push-stack-wipe. Both panels share one eased progress.
function BottomPushLayer({
  children,
  presentationDirection,
  presentationProgress,
}: TransitionPresentationComponentProps<Record<string, never>>) {
  const entering = presentationDirection === "entering";
  const moving = presentationProgress > 0 && presentationProgress < 1;
  return (
    <AbsoluteFill
      style={{ translate: `0 ${pushOffset(presentationProgress, entering)}%` }}
    >
      {children}
      {entering && moving ? (
        <>
          <div
            style={{
              position: "absolute",
              top: -56,
              left: 0,
              right: 0,
              height: 56,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.42), rgba(0,0,0,0.12) 40%, transparent)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              backgroundColor: "rgba(255,255,255,0.45)",
            }}
          />
        </>
      ) : null}
    </AbsoluteFill>
  );
}

export const bottomPush = { component: BottomPushLayer, props: {} };

import { Easing } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { ChapterFocus } from "../components/shotcraft/ChapterFocus";
import { BrandOutro } from "../components/shotcraft/BrandOutro";
import { bottomPush } from "../components/shotcraft/BottomPush";
import {
  FOCUS_FRAMES,
  OUTRO_FRAMES,
  PUSH_FRAMES,
  TITLE_FRAMES,
} from "../components/shotcraft/timing";
import { IntroScene } from "./IntroScene";
import { FocusContent } from "./FocusContent";
import { SamplerMark } from "./BrandMark";

export function ShotcraftSampler() {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={TITLE_FRAMES}>
        <IntroScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={bottomPush}
        timing={linearTiming({
          durationInFrames: PUSH_FRAMES,
          easing: Easing.bezier(0.12, 0.9, 0.2, 1),
        })}
      />
      <TransitionSeries.Sequence durationInFrames={FOCUS_FRAMES}>
        <ChapterFocus title="Player guide">
          <FocusContent />
        </ChapterFocus>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={bottomPush}
        timing={linearTiming({
          durationInFrames: PUSH_FRAMES,
          easing: Easing.bezier(0.12, 0.9, 0.2, 1),
        })}
      />
      <TransitionSeries.Sequence durationInFrames={OUTRO_FRAMES}>
        <BrandOutro
          name="StackAnvil"
          address="stackanvil.pistonmaster.net"
          mark={<SamplerMark />}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
}

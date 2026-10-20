import { AbsoluteFill, useVideoConfig } from "remotion";
import { BlurTitle } from "../components/shotcraft/BlurTitle";
import { shotcraftTheme as theme } from "../components/shotcraft/theme";
import { SamplerMark } from "./BrandMark";
export function IntroScene() {
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        fontFamily: theme.body,
        justifyContent: "center",
        padding: portrait ? "200px 96px 330px" : "120px",
        gap: 70,
      }}
    >
      <div style={{ width: 112, height: 112 }}>
        <SamplerMark />
      </div>
      <BlurTitle
        title="Java meets Bedrock"
        subtitle="StackAnvil · Fabric client mod"
        style={{
          fontFamily: theme.display,
          fontSize: portrait ? 112 : 150,
          fontWeight: 750,
          letterSpacing: "-0.035em",
          lineHeight: 1.06,
        }}
        subtitleStyle={{
          fontSize: portrait ? 58 : 48,
          color: theme.muted,
          lineHeight: 1.3,
        }}
      />
    </AbsoluteFill>
  );
}

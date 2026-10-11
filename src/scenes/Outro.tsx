import { AbsoluteFill, useVideoConfig } from "remotion";
import { brand } from "../brand";
import { BrandMark } from "../components/BrandMark";

export function Outro() {
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  return (
    <AbsoluteFill
      style={{
        padding: vertical ? "180px 70px 350px" : 96,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: 32,
      }}
    >
      <BrandMark size={128} />
      <div style={{ fontFamily: brand.display, fontSize: vertical ? 96 : 140 }}>
        Try StackAnvil
      </div>
      <div style={{ fontSize: vertical ? 42 : 50, color: brand.mint }}>
        stackanvil.pistonmaster.net
      </div>
      <div
        style={{
          fontSize: vertical ? 34 : 30,
          color: brand.muted,
          marginTop: 16,
        }}
      >
        Experimental builds. Compatibility varies by server.
      </div>
      <div style={{ fontSize: vertical ? 30 : 26, color: brand.muted }}>
        Independent project. Not an official Minecraft or ViaVersion release.
      </div>
    </AbsoluteFill>
  );
}

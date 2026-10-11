import { AbsoluteFill } from "remotion";
import { brand } from "../brand";
import { BrandMark } from "../components/BrandMark";

export function Outro() {
  return (
    <AbsoluteFill
      style={{
        padding: 96,
        justifyContent: "center",
        alignItems: "center",
        gap: 32,
      }}
    >
      <BrandMark size={128} />
      <div style={{ fontFamily: brand.display, fontSize: 140 }}>
        Try StackAnvil
      </div>
      <div style={{ fontSize: 50, color: brand.mint }}>
        github.com/StackAnvil/patches
      </div>
      <div style={{ fontSize: 30, color: brand.muted, marginTop: 16 }}>
        Experimental builds. Compatibility varies by server.
      </div>
      <div style={{ fontSize: 26, color: brand.muted }}>
        Independent project. Not an official Minecraft or ViaVersion release.
      </div>
    </AbsoluteFill>
  );
}

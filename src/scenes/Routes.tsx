import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { brand } from "../brand";

export function Routes() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ padding: 96, justifyContent: "center", gap: 62 }}>
      <div style={{ fontFamily: brand.display, fontSize: 100 }}>
        Choose your connection
      </div>
      {[
        {
          id: "proxy",
          label: "Regular Java client",
          path: "ViaProxy",
          detail: "No client mods",
          from: 15,
        },
        {
          id: "fabric",
          label: "Fabric Java client",
          path: "ViaFabricPlus\n+ Bedrock add-on",
          detail: "Bedrock menus in your game",
          from: 120,
        },
      ].map((route) => (
        <div
          key={route.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 36,
            opacity: interpolate(frame, [route.from, route.from + 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div style={{ width: 360, flexShrink: 0, fontSize: 44 }}>
            {route.label}
            <div style={{ fontSize: 27, marginTop: 12, color: brand.muted }}>
              {route.detail}
            </div>
          </div>
          <svg width="110" height="28" viewBox="0 0 110 28">
            <path
              d="M0 14h105m-14-12 14 12-14 12"
              fill="none"
              stroke={brand.mint}
              strokeWidth="4"
            />
          </svg>
          <div
            style={{
              width: 530,
              flexShrink: 0,
              fontSize: 40,
              whiteSpace: "pre-line",
            }}
          >
            {route.path}
          </div>
          <svg width="110" height="28" viewBox="0 0 110 28">
            <path
              d="M0 14h105m-14-12 14 12-14 12"
              fill="none"
              stroke={brand.mint}
              strokeWidth="4"
            />
          </svg>
          <div
            style={{ fontSize: 44, color: brand.mint, whiteSpace: "nowrap" }}
          >
            Bedrock server
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
}

import { useVideoConfig } from "remotion";
import { shotcraftTheme as theme } from "../components/shotcraft/theme";
export function FocusContent() {
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 42,
      }}
    >
      <div style={{ fontSize: portrait ? 64 : 56, fontFamily: theme.display }}>
        Install. Sign in. Join.
      </div>
      <div
        style={{
          maxWidth: 1100,
          fontSize: portrait ? 58 : 44,
          lineHeight: 1.4,
          color: theme.muted,
        }}
      >
        Reserve the server tour for reviewed Java gameplay.
      </div>
      <div style={{ fontSize: portrait ? 58 : 34, color: theme.accent }}>
        Motion study · no gameplay footage
      </div>
    </div>
  );
}

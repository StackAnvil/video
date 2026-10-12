import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../brand";
import type { Scene } from "../config";

interface GuideRow {
  title: string;
  detail: string;
  link?: string;
}
const install: GuideRow[] = [
  {
    title: "Use Fabric",
    detail: "Choose the supported Minecraft version in the player guide.",
  },
  {
    title: "Download both mods",
    detail:
      "CurseForge: StackAnvil Bedrock add-on\nMatching release: ViaFabricPlus",
  },
  {
    title: "Put them in mods",
    detail: "Keep one ViaFabricPlus JAR. Then launch your Fabric client.",
  },
];
const help: GuideRow[] = [
  {
    title: "Discord",
    detail: "Ask for help and share what went wrong.",
    link: "pistonmaster.net/discord",
  },
  {
    title: "GitHub issues",
    detail: "Report your versions, server, steps and expected result.",
    link: "github.com/StackAnvil/patches/issues",
  },
];

export function PlayerGuide({ scene }: { scene: Scene }) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  const isHelp = scene.kind === "help";
  const rows = isHelp ? help : install;
  return (
    <AbsoluteFill
      style={{
        padding: vertical ? "180px 80px 360px" : "100px 115px 190px",
        justifyContent: "center",
        gap: vertical ? 48 : 60,
      }}
    >
      <div
        style={{
          fontFamily: brand.display,
          fontSize: vertical ? 84 : 100,
          lineHeight: 1.1,
        }}
      >
        {scene.title}
      </div>
      {!isHelp && (
        <div style={{ color: brand.mint, fontSize: vertical ? 38 : 42 }}>
          stackanvil.pistonmaster.net
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: vertical
            ? "1fr"
            : `repeat(${rows.length}, minmax(0, 1fr))`,
          gap: vertical ? 38 : 48,
          alignItems: "start",
        }}
      >
        {rows.map((row, index) => (
          <div
            key={row.title}
            style={{
              borderTop: `2px solid ${brand.mint}`,
              paddingTop: 24,
              opacity: interpolate(
                frame,
                [index * 45 + 8, index * 45 + 20],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              ),
            }}
          >
            <div
              style={{
                fontSize: vertical ? 50 : 48,
                color: brand.paper,
                marginBottom: 18,
              }}
            >
              {!isHelp && `${index + 1}. `}
              {row.title}
            </div>
            <div
              style={{
                fontSize: vertical ? 38 : 34,
                lineHeight: 1.4,
                color: brand.muted,
                whiteSpace: "pre-line",
              }}
            >
              {row.detail}
            </div>
            {row.link && (
              <div
                style={{
                  marginTop: 24,
                  fontSize: vertical ? 32 : 32,
                  color: brand.mint,
                  overflowWrap: "anywhere",
                  lineHeight: 1.4,
                }}
              >
                {row.link}
              </div>
            )}
          </div>
        ))}
      </div>
      {isHelp && (
        <div
          style={{
            fontSize: vertical ? 32 : 30,
            lineHeight: 1.35,
            color: brand.muted,
          }}
        >
          Compatibility varies by server and version. Remove private account
          details from screenshots and logs.
        </div>
      )}
    </AbsoluteFill>
  );
}

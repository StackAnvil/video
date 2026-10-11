import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand } from "../brand";
import type { Scene } from "../config";
const panels = {
  routes: [
    [
      "Fabric Java client",
      "ViaFabricPlus + Bedrock add-on → Bedrock server",
      "In-game Bedrock menus and native resource paths",
    ],
    [
      "Regular Java client",
      "StackAnvil ViaProxy → Bedrock server",
      "Connect through a local proxy",
    ],
  ],
  testing: [
    [
      "Bedrock reference",
      "Java client → ViaBedrock → BDS",
      "Behavior packs prepare fixtures and check server state",
    ],
    [
      "Java server route",
      "Java client → ViaBedrock → Geyser → Paper",
      "Java plugin + custom-content fixtures · Boar movement diagnostics",
    ],
  ],
  automation: [
    [
      "Prepare → perform → verify",
      "Real Java input, server assertions",
      "Movement · entities · blocks · inventory · projectiles",
    ],
    [
      "Make failures reproducible",
      "Negative controls + recorded scene replay",
      "Unit checks, integration cases, native comparisons, live playtesting",
    ],
  ],
  traffic: [
    [
      "Service traffic",
      "Client → MITMProxy → account and game services",
      "HTTPS requests and response shapes",
    ],
    [
      "Gameplay traffic",
      "Bedrock packets → private journal → offline replay",
      "Packet inspection and regression investigation",
    ],
  ],
  research: [
    [
      "Observe a version",
      "Native client + server behavior + protocol documentation",
      "Match the target build before porting behavior",
    ],
    [
      "Build and check",
      "AI-assisted research and implementation → reproducible tests",
      "Human review · native comparisons · upstream patches",
    ],
  ],
  downloads: [
    [
      "CurseForge",
      "StackAnvil Bedrock Addon for ViaFabricPlus",
      "Install with the matching ViaFabricPlus build",
    ],
    [
      "GitHub releases",
      "github.com/StackAnvil/patches/releases",
      "JARs + ready-to-import client bundle",
    ],
  ],
} as const;
export function Information({ scene }: { scene: Scene }) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  const key =
    scene.id === "automation"
      ? "automation"
      : scene.kind === "routes"
        ? "routes"
        : scene.kind === "testing"
          ? "testing"
          : scene.kind === "traffic"
            ? "traffic"
            : scene.kind === "research"
              ? "research"
              : "downloads";
  const rows =
    vertical && key === "testing"
      ? [
          [
            "Native reference",
            "BDS behavior packs",
            "Controlled worlds and server assertions",
          ],
          [
            "Java server route",
            "Geyser + Paper + Boar",
            "Automated cases, packet inspection, live playtesting",
          ],
        ]
      : panels[key];
  return (
    <AbsoluteFill
      style={{
        padding: vertical ? "185px 68px 390px" : "80px 95px 170px",
        justifyContent: "center",
        gap: vertical ? 70 : 55,
      }}
    >
      <div
        style={{
          fontFamily: brand.display,
          fontSize: vertical ? 80 : 82,
          lineHeight: 1.08,
        }}
      >
        {scene.title}
      </div>
      {rows.map(([title, path, detail], i) => (
        <div
          key={title}
          style={{
            opacity: interpolate(frame, [i * 100 + 15, i * 100 + 32], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            borderTop: `2px solid ${brand.mint}`,
            paddingTop: 30,
          }}
        >
          <div
            style={{
              fontSize: vertical ? 44 : 40,
              color: brand.mint,
              marginBottom: 22,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: vertical ? "column" : "row",
              alignItems: vertical ? "flex-start" : "center",
              gap: vertical ? 12 : 20,
            }}
          >
            {path.split(" → ").map((step, stepIndex, steps) => (
              <div
                key={step}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    fontSize: vertical ? 42 : steps.length > 3 ? 38 : 44,
                    lineHeight: 1.25,
                    border:
                      steps.length > 1 ? `1px solid ${brand.muted}` : undefined,
                    padding: steps.length > 1 ? "20px 24px" : 0,
                    opacity: interpolate(
                      frame,
                      [
                        i * 100 + stepIndex * 18 + 25,
                        i * 100 + stepIndex * 18 + 40,
                      ],
                      [0.35, 1],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                    ),
                  }}
                >
                  {step}
                </div>
                {!vertical && stepIndex < steps.length - 1 && (
                  <div style={{ fontSize: 42, color: brand.mint }}>→</div>
                )}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: vertical ? 34 : 31,
              lineHeight: 1.45,
              color: brand.muted,
              marginTop: 22,
            }}
          >
            {detail}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
}

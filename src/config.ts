export const FPS = 30;
export const TRANSITION = 12;
export const VOICE_DELAY = 18;
export const scenes = [
  {
    id: "intro",
    kind: "intro",
    seconds: 9,
    title: "Java client.\nBedrock server.",
    label: "Real gameplay, captured in Java Edition",
    narration:
      "This is Minecraft Java Edition, playing on a Bedrock server. This is StackAnvil.",
    clip: "gameplay",
    evidence: "site/index.md",
  },
  {
    id: "join",
    kind: "footage",
    seconds: 12,
    title: "Join from Java Edition",
    label: "ViaFabricPlus + StackAnvil Bedrock add-on",
    narration:
      "With ViaFabricPlus and the StackAnvil Bedrock add-on, your Fabric client connects directly to Bedrock servers.",
    clip: "join",
    evidence: "site/getting-started.md",
  },
  {
    id: "creative",
    kind: "footage",
    seconds: 11,
    title: "The server's creative catalog",
    label: "Bedrock creative items inside Java",
    narration:
      "The server's creative catalog appears in its own Bedrock tab, inside your Java inventory.",
    clip: "creative",
    evidence:
      "patches/viafabricplus-bedrock/upstreamable/0010-show-server-creative-items-in-a-bedrock-tab.pr.md",
  },
  {
    id: "servers",
    kind: "footage",
    seconds: 11,
    title: "Browse Bedrock servers",
    label: "Featured servers and creator experiences",
    narration:
      "Browse featured Bedrock servers and creator experiences from the Java client, with artwork and server details.",
    clip: "servers",
    evidence:
      "patches/viafabricplus-bedrock/upstreamable/0015-add-featured-server-browser.patch",
  },
  {
    id: "skins",
    kind: "footage",
    seconds: 11,
    title: "Bring your Bedrock character",
    label: "Dressing Room and custom player geometry",
    narration:
      "The Dressing Room brings Bedrock characters and classic skins into Java, including custom player geometry.",
    clip: "skins",
    evidence:
      "patches/viafabricplus-bedrock/upstreamable/0003-classic-dressing-room.pr.md",
  },
  {
    id: "routes",
    kind: "routes",
    seconds: 12,
    title: "Choose your connection",
    label: "Both paths start with a Java client",
    narration:
      "Prefer a regular Java client? Use ViaProxy. Want the in-game Bedrock menus? Use ViaFabricPlus and the add-on.",
    evidence: "site/getting-started.md",
  },
  {
    id: "outro",
    kind: "outro",
    seconds: 9,
    title: "Try StackAnvil",
    label: "github.com/StackAnvil/patches",
    narration:
      "Get the builds and player guide on GitHub. StackAnvil is experimental. Server compatibility and Bedrock behavior can vary.",
    evidence: "site/index.md",
  },
] as const;
export type Scene = (typeof scenes)[number];
export type ClipId = Extract<Scene, { clip: string }>["clip"];

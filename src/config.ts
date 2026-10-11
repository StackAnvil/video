export const FPS = 30;
export const TRANSITION = 12;
export const VOICE_DELAY = 18;
export const VOICE_TAIL = 30;
export type Edition = "landscape" | "vertical";
interface SceneBase {
  id: string;
  seconds: number;
  title: string;
  label: string;
  narration: string;
  evidence: string;
}
export type Scene = SceneBase &
  (
    | {
        kind: "footage";
        clip: string;
        framing: "world" | "menu" | "web";
        annotation?: { from: number; title: string; detail: string };
      }
    | {
        kind:
          | "routes"
          | "testing"
          | "traffic"
          | "research"
          | "downloads"
          | "outro";
      }
  );
export const scenes: Scene[] = [
  {
    id: "intro",
    kind: "footage",
    clip: "lobby",
    framing: "world",
    seconds: 11,
    title: "Java inside a Bedrock lobby",
    label: "Live Galaxite session · Java Edition 26.3",
    narration:
      "This is a real Java client, live in Galaxite's Bedrock lobby. Let's look around.",
    evidence: "Live Galaxite capture",
  },
  {
    id: "lobby",
    kind: "footage",
    clip: "lobby-tour",
    framing: "world",
    seconds: 20,
    title: "Walk into the server's world",
    label: "ViaFabricPlus + StackAnvil Bedrock add-on",
    narration:
      "Stack Anvil builds on ViaFabricPlus and ViaBedrock, and much of this starts with their work. As we walk, Java is using the server's own resource packs. Some of that content still has rendering errors.",
    evidence: "site/getting-started.md",
  },
  {
    id: "actors",
    kind: "footage",
    clip: "actors",
    framing: "world",
    seconds: 20,
    title: "Characters built for this server",
    label: "Server geometry, textures, and animation",
    narration:
      "Watch these characters move. They're Galaxite's native characters, built from the server's own models, textures, and animation data. Stack Anvil brings supported Bedrock actors and player skins into the Java renderer.",
    evidence:
      "patches/viafabricplus-bedrock/upstreamable/0002-native-entities-and-skins.pr.md",
  },
  {
    id: "forms",
    kind: "footage",
    clip: "forms",
    framing: "menu",
    seconds: 22,
    title: "Galaxite's own menus",
    label: "Server-authored UI · original button responses",
    narration:
      "Here's Galaxite's game selector. The layout, artwork, labels, and buttons all come from the server's Bedrock UI definitions. Pick a game, and Java sends your choice straight back to the server as a form response.",
    evidence:
      "patches/viafabricplus-bedrock/upstreamable/0029-render-authored-bedrock-server-forms.pr.md",
  },
  {
    id: "items",
    kind: "footage",
    clip: "items",
    framing: "menu",
    seconds: 17,
    title: "The server's items and artwork",
    label: "Hotbar items, inventory icons, and held items",
    narration:
      "Items use the same resource pack path. That custom art in the hotbar comes from Galaxite, and it carries through to the inventory and your hand.",
    evidence: "docs/bedrock-test-packs.md",
  },
  {
    id: "blocks",
    kind: "footage",
    clip: "blocks",
    framing: "world",
    seconds: 18,
    title: "Custom blocks in a controlled world",
    label: "StackAnvil resource-probe behavior and resource packs",
    annotation: {
      from: 5,
      title: "Intentional probe texture",
      detail: "Source and converted pixels match",
    },
    narration:
      "Over on a local Bedrock Dedicated Server, a small resource probe gives us a repeatable custom block. We can inspect it in the world and compare the converted texture with the source.",
    evidence: "src/integration/resource-probe.ts",
  },
  {
    id: "inventory",
    kind: "footage",
    clip: "inventory",
    framing: "menu",
    seconds: 20,
    title: "Inventory actions reach Bedrock",
    label: "Chest transfer · server inventory state",
    annotation: {
      from: 14,
      title: "BDS check after this take",
      detail: "Chest: 0 emeralds · player: 4 · passed",
    },
    narration:
      "A chest screen can look right and still be wrong underneath. So we move items out of the chest, then a behavior pack checks what the server thinks is in the chest and the player's inventory.",
    evidence: "test-packs/entity-probe/README.md",
  },
  {
    id: "character",
    kind: "footage",
    clip: "character",
    framing: "menu",
    seconds: 26,
    title: "Build a Bedrock character",
    label: "Character Creator · saved slots · piece previews",
    narration:
      "Next, the Dressing Room, which opens your Bedrock characters inside Java. You can flip through saved slots, look over the assembled model, and preview individual pieces. Classic skins and Character Creator looks load through separate resource and account paths.",
    evidence:
      "patches/viafabricplus-bedrock/upstreamable/0009-show-saved-character-creator-slots.pr.md",
  },
  {
    id: "emotes",
    kind: "footage",
    clip: "emotes",
    framing: "world",
    seconds: 21,
    title: "Use an emote in the world",
    label: "Bedrock emote wheel and player animation",
    narration:
      "Open the wheel, choose an emote, and watch it play on your character. These animations are running in the live Galaxite lobby. The emotes you can choose depend on your Bedrock account.",
    evidence:
      "patches/viafabricplus-bedrock/upstreamable/0009-show-saved-character-creator-slots.pr.md",
  },
  {
    id: "friends",
    kind: "footage",
    clip: "friends",
    framing: "menu",
    seconds: 18,
    title: "Bedrock Friends inside Java",
    label: "Friends, requests, joinable worlds, and parties",
    narration:
      "Bedrock Friends brings the social side into Java. Browse your friends list, pending requests, joinable worlds, and parties, all tied to your Bedrock account.",
    evidence:
      "patches/viafabricplus-bedrock/upstreamable/0001-social-party-realms.pr.md",
  },
  {
    id: "realms",
    kind: "footage",
    clip: "realms",
    framing: "menu",
    seconds: 18,
    title: "Realms and Realm Hub",
    label: "Account menus · no unavailable join is shown",
    narration:
      "Realms and Realm Hub get their own screens too. Here we're browsing the management menus. Access depends on your account and the Realm itself.",
    evidence:
      "patches/viafabricplus-bedrock/upstreamable/0001-social-party-realms.pr.md",
  },
  {
    id: "routes",
    kind: "routes",
    seconds: 18,
    title: "Two ways to connect",
    label: "Choose the setup that fits your client",
    narration:
      "Two ways in. Fabric with ViaFabricPlus and the Bedrock add-on gives you these menus and native rendering. A regular Java client can use Stack Anvil ViaProxy, with different capabilities.",
    evidence: "site/getting-started.md",
  },
  {
    id: "testing",
    kind: "testing",
    seconds: 24,
    title: "How we test the bridge",
    label: "Bedrock reference server + Java server through Geyser",
    narration:
      "Then there's the test lab. On Bedrock Dedicated Server, behavior packs set up fixtures. A second route runs Java through ViaBedrock and Geyser into Paper, where a plugin implements the same test contract with custom content. Boar's movement diagnostics add one more check.",
    evidence: "docs/development.md; docs/bedrock-test-packs.md",
  },
  {
    id: "debug",
    kind: "footage",
    clip: "debug",
    framing: "world",
    seconds: 24,
    title: "Debug worlds turn bugs into cases",
    label: "Prepared fixtures · actual Java input · server assertions",
    narration:
      "The debug worlds isolate the hard stuff: entities, blocks, inventories, projectiles, and movement. For each case, the driver sets things up, sends real Java input, and asks the server what changed. A disconnect or a failed assertion counts as a failure.",
    evidence: "docs/bedrock-test-packs.md",
  },
  {
    id: "automation",
    kind: "testing",
    seconds: 22,
    title: "Checks at several layers",
    label:
      "Unit tests · integration cases · negative controls · live playtesting",
    narration:
      "Unit and integration tests check code and server state. Negative controls are deliberately broken fixtures that should fail. Recorded scenes can be replayed to chase regressions. Live playtesting still matters, since passing tests can't show full parity.",
    evidence: "docs/server-replay.md; docs/bedrock-test-packs.md",
  },
  {
    id: "traffic",
    kind: "traffic",
    seconds: 24,
    title: "Observe the traffic that matters",
    label: "HTTPS capture and gameplay packet inspection are separate",
    narration:
      "For account and service requests, we run HTTPS through MITMProxy. Gameplay is a separate job, handled by packet recording, sniffing, and journals. Then we compare the native client's traffic with the Java path's. Raw captures and credentials stay private.",
    evidence: "docs/capture-lab.md",
  },
  {
    id: "research",
    kind: "research",
    seconds: 24,
    title: "Research, implement, reproduce",
    label: "Versioned protocol research · native comparisons · AI assistance",
    narration:
      "Bedrock reverse engineering starts with one specific game build. Versioned docs, native client comparisons, and implementation research all feed into the patches. AI helps with coding, research, and investigation. Then native evidence, tests, and human review decide whether the work holds up.",
    evidence:
      "docs/bedrock-development-sources.md; maintainer production brief",
  },
  {
    id: "website",
    kind: "footage",
    clip: "website",
    framing: "web",
    seconds: 18,
    title: "Start with the player guide",
    label: "stackanvil.pistonmaster.net",
    narration:
      "Start at Stack Anvil dot pistonmaster dot net. The player guide walks you through both connection routes, then points you to the matching builds for the setup you pick.",
    evidence: "https://stackanvil.pistonmaster.net/",
  },
  {
    id: "downloads",
    kind: "downloads",
    seconds: 16,
    title: "Get the Bedrock add-on",
    label: "CurseForge · GitHub releases · ready-to-import client bundle",
    narration:
      "The Bedrock add-on has a CurseForge listing. GitHub releases carry the matching Stack Anvil artifacts and an importable client bundle. Keep the versions matched.",
    evidence: "README.md",
  },
  {
    id: "developers",
    kind: "footage",
    clip: "javadocs",
    framing: "web",
    seconds: 20,
    title: "For developers",
    label: "Published Maven artifacts and Javadocs",
    narration:
      "Building on this yourself? There are published Maven artifacts and Javadocs for the add-on, ViaBedrock, CubeConverter, and ViaProxy. The repo keeps every patch separate, so each one can be reviewed and sent upstream.",
    evidence: "site/libraries.md",
  },
  {
    id: "contribute",
    kind: "footage",
    clip: "contributing",
    framing: "web",
    seconds: 18,
    title: "Help us reproduce the next bug",
    label: "Report a case · compare native behavior · contribute a patch",
    narration:
      "Want to help? Report focused, reproducible bugs, with the build you used and what you expected. Native comparisons, tests, and upstream patches are welcome too.",
    evidence: "site/contributing.md",
  },
  {
    id: "outro",
    kind: "outro",
    seconds: 12,
    title: "Try StackAnvil",
    label: "stackanvil.pistonmaster.net",
    narration:
      "Stack Anvil is an independent, experimental project. Try it, report what breaks, or help fix it.",
    evidence: "site/index.md",
  },
];
export const shortScenes: Scene[] = [
  {
    id: "short-intro",
    kind: "footage",
    clip: "lobby",
    framing: "world",
    seconds: 8,
    title: "Java client. Bedrock lobby.",
    label: "StackAnvil",
    narration:
      "A real Java client, live in Galaxite's Bedrock lobby. This is Stack Anvil.",
    evidence: "Live Galaxite capture",
  },
  {
    id: "short-actors",
    kind: "footage",
    clip: "actors",
    framing: "world",
    seconds: 8,
    title: "Server-made characters",
    label: "Models and animation in Java",
    narration:
      "Galaxite's native characters, animating in Java with the server's own models and textures.",
    evidence: "Live Galaxite capture",
  },
  {
    id: "short-forms",
    kind: "footage",
    clip: "forms-short",
    framing: "menu",
    seconds: 9,
    title: "The server's own menus",
    label: "Galaxite UI",
    narration:
      "The game selector is Galaxite's own menu, and your pick goes straight back to the server.",
    evidence: "Live Galaxite capture",
  },
  {
    id: "short-emotes",
    kind: "footage",
    clip: "emotes-short",
    framing: "world",
    seconds: 9,
    title: "Bring your character",
    label: "Dressing Room and emotes",
    narration:
      "Bring your saved Bedrock character along. Open the wheel, pick an emote, and let it play.",
    evidence: "Live Java capture",
  },
  {
    id: "short-testing",
    kind: "testing",
    seconds: 10,
    title: "Built with a test lab",
    label: "BDS · Geyser + Boar · live playtesting",
    narration:
      "Behind it sits a test lab, with debug worlds, automated tests, packet inspection, and live playtesting.",
    evidence: "docs/development.md",
  },
  {
    id: "short-outro",
    kind: "outro",
    seconds: 10,
    title: "Try StackAnvil",
    label: "stackanvil.pistonmaster.net",
    narration:
      "It's an independent, experimental project. Grab the guide at Stack Anvil dot pistonmaster dot net, and report what breaks.",
    evidence: "site/index.md",
  },
];
export function scenesFor(edition: Edition = "landscape") {
  return edition === "vertical" ? shortScenes : scenes;
}

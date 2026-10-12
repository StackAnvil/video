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
    | { kind: "footage"; clip: string; framing: "world" | "menu" | "web" }
    | { kind: "install" | "help" | "outro" }
  );
export const scenes: Scene[] = [
  {
    id: "hook",
    seconds: 10,
    title: "StackAnvil: a Fabric client mod",
    narration:
      "Stack Anvil is a Fabric client mod that lets Minecraft Java Edition connect to Bedrock servers.",
    label: "Java client · StackAnvil · CubeCraft Bedrock",
    evidence:
      "Fresh CubeCraft Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "cube-hook",
    framing: "world",
  },
  {
    id: "cube-lobby",
    seconds: 10,
    title: "Install in Java. Sign in with Bedrock.",
    narration:
      "You install it alongside ViaFabricPlus in your Java client, then sign in with your Bedrock account.",
    label: "Java client · StackAnvil · CubeCraft Bedrock",
    evidence:
      "Fresh CubeCraft Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "cube-lobby",
    framing: "world",
  },
  {
    id: "cube-menu",
    seconds: 13,
    title: "Join a Bedrock server from Java",
    narration:
      "This is CubeCraft's Bedrock network, joined from Java with that setup. Their own game selector opens, so let's pick Parkour.",
    label: "Java client · StackAnvil · CubeCraft Bedrock",
    evidence:
      "Fresh CubeCraft Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "cube-menu",
    framing: "menu",
  },
  {
    id: "cube-play",
    seconds: 10,
    title: "CubeCraft Bedrock parkour, from Java",
    narration:
      "This is CubeCraft's Antarctica Parkour course, running on their Bedrock server while you play from Java.",
    label: "Java client · StackAnvil · CubeCraft Bedrock",
    evidence:
      "Fresh CubeCraft Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "cube-play",
    framing: "world",
  },
  {
    id: "galaxite-lobby",
    seconds: 10,
    title: "Galaxite through StackAnvil",
    narration:
      "Now here's Stack Anvil on Galaxite, with its custom Bedrock lobby running in the same Java client.",
    label: "Java client · StackAnvil · Galaxite",
    evidence:
      "Fresh Galaxite Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "galaxite-lobby",
    framing: "world",
  },
  {
    id: "galaxite-actors",
    seconds: 9,
    title: "Bedrock models rendered in Java",
    narration:
      "These custom models and animations come from Galaxite's Bedrock resource pack, which Stack Anvil loads in Java.",
    label: "Java client · StackAnvil · Galaxite",
    evidence:
      "Fresh Galaxite Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "galaxite-actors",
    framing: "world",
  },
  {
    id: "galaxite-menu",
    seconds: 12,
    title: "Bedrock server menus, from Java",
    narration:
      "Galaxite's own game selector works too, with the artwork and game pages the server designed.",
    label: "Java client · StackAnvil · Galaxite",
    evidence:
      "Fresh Galaxite Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "galaxite-menu",
    framing: "menu",
  },
  {
    id: "galaxite-items",
    seconds: 5,
    title: "Custom held items",
    narration: "Custom item models, too.",
    label: "Java client · StackAnvil · Galaxite",
    evidence:
      "Fresh Galaxite Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "galaxite-items",
    framing: "world",
  },
  {
    id: "player-emote",
    seconds: 15,
    title: "Emotes · B by default",
    narration:
      "Press B to open the emote wheel by default. Rebind it in Controls. Choose an emote from your Bedrock account.",
    label: "Java client · StackAnvil · Bedrock emotes",
    evidence:
      "Fresh Galaxite Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "player-emote",
    framing: "world",
  },
  {
    id: "player-character",
    seconds: 16,
    title: "Character Creator",
    narration:
      "Since you signed in with a Bedrock account, the Character Creator opens with your saved slots and a full model preview, so you can browse pieces from Java.",
    label: "Minecraft Java · StackAnvil",
    evidence:
      "Recorded Dressing Room, saved character slots, and hair/face piece previews",
    kind: "footage",
    clip: "character",
    framing: "menu",
  },
  {
    id: "player-friends",
    seconds: 13,
    title: "Bedrock friends and parties",
    narration:
      "The Bedrock social menus open in Java as well: your friends list, incoming requests, parties, and the worlds your friends have open.",
    label: "Minecraft Java · StackAnvil",
    evidence: "Recorded Bedrock Friends, requests, worlds, and party menus",
    kind: "footage",
    clip: "friends",
    framing: "menu",
  },
  {
    id: "player-realms",
    seconds: 12,
    title: "Realm menus in your Java client",
    narration:
      "Your Realm list and the Realm Hub menus open too, including world and settings pages. What you see depends on your account.",
    label: "Java client · StackAnvil · Realm Hub",
    evidence:
      "Recorded Realm list and Realm Hub world/settings menus; menus only",
    kind: "footage",
    clip: "realms",
    framing: "menu",
  },
  {
    id: "realm-community",
    seconds: 22,
    title: "Realm Community and Timeline",
    label: "Java client · StackAnvil · Economy SMP",
    narration:
      "Community shows the Realm's recent events and posts, and Timeline charts weekly player activity, so you can catch up without leaving Java.",
    evidence:
      "Live Economy SMP Realm Hub: existing Community stories, Timeline weekly activity and week navigation; menus only",
    kind: "footage",
    clip: "realm-community",
    framing: "menu",
  },
  {
    id: "player-guide",
    seconds: 12,
    title: "Start at the website",
    narration:
      "All of this takes two mods and a sign-in. Start at Stack Anvil dot pistonmaster dot net. The guide links every download.",
    label: "stackanvil.pistonmaster.net/getting-started/",
    evidence: "site/getting-started.md and current player guide",
    kind: "footage",
    clip: "website",
    framing: "web",
  },
  {
    id: "player-install",
    seconds: 25,
    title: "Install the mods",
    narration:
      "Install Fabric Loader for the supported Minecraft version shown on the website. Next, download the Stack Anvil Bedrock Addon for ViaFabricPlus from CurseForge. Then get the matching ViaFabricPlus JAR from the same GitHub release the guide links to. Put both in your mods folder, and keep only one copy of ViaFabricPlus.",
    label: "Minecraft Java · StackAnvil",
    evidence: "site/getting-started.md and current player guide",
    kind: "install",
  },
  {
    id: "player-connect",
    seconds: 22,
    title: "Sign in and join",
    narration:
      "Launch Minecraft with Fabric, open Multiplayer, then ViaFabricPlus. Under Bedrock settings, choose Account for Bedrock Edition and finish signing in through your browser. Add the Bedrock server address, select the matching Bedrock version in ViaFabricPlus, and accept resource packs when the server asks.",
    label: "Minecraft Java · StackAnvil",
    evidence: "site/getting-started.md and current player guide",
    kind: "footage",
    clip: "connect",
    framing: "menu",
  },
  {
    id: "player-help",
    seconds: 20,
    title: "Get help and report bugs",
    narration:
      "Stack Anvil is still experimental. Compatibility varies by server, and some resource packs render imperfectly. Join the Discord for help and to talk about bugs. To report one, open a GitHub issue with your versions, the server, and the steps to reproduce it.",
    label: "Minecraft Java · StackAnvil",
    evidence: "site/getting-started.md and current player guide",
    kind: "help",
  },
  {
    id: "player-outro",
    seconds: 7,
    title: "Pick a Bedrock server",
    narration:
      "Keep your Java client, and go see what Bedrock servers have built.",
    label: "Minecraft Java · StackAnvil",
    evidence: "site/getting-started.md and current player guide",
    kind: "outro",
  },
];
export const shortScenes: Scene[] = [
  {
    id: "hook-short",
    seconds: 9.1,
    title: "StackAnvil: a Fabric client mod",
    narration:
      "Stack Anvil is a Fabric mod that lets Minecraft Java join Bedrock servers, like CubeCraft.",
    label: "Java client · StackAnvil · CubeCraft Bedrock",
    evidence:
      "Fresh CubeCraft Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "cube-short",
    framing: "world",
  },
  {
    id: "galaxite-short",
    seconds: 10,
    title: "Galaxite through StackAnvil",
    narration:
      "Stack Anvil also loads Galaxite's custom models, animations, and server menus in Java.",
    label: "Java client · StackAnvil · Galaxite",
    evidence:
      "Fresh Galaxite Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "galaxite-short",
    framing: "world",
  },
  {
    id: "emote-short",
    seconds: 8,
    title: "Emotes · B by default",
    narration:
      "Press B to open the emote wheel by default. Use the emotes your Bedrock account owns.",
    label: "Minecraft Java · StackAnvil",
    evidence:
      "Fresh Galaxite Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "emote-short",
    framing: "world",
  },
  {
    id: "realm-short",
    seconds: 9,
    title: "Realm Community and Timeline",
    label: "Java client · StackAnvil · Economy SMP",
    narration:
      "Community shows the Realm's recent events and posts, and Timeline charts weekly player activity.",
    evidence:
      "Economy SMP Community stories and weekly player Timeline; menus only",
    kind: "footage",
    clip: "realm-short",
    framing: "menu",
  },
  {
    id: "install-short",
    seconds: 13,
    title: "Two mods",
    narration:
      "Install Fabric Loader. Then add the Stack Anvil Bedrock Addon from CurseForge and the matching ViaFabricPlus from the linked GitHub release. Both go in your mods folder.",
    label: "Minecraft Java · StackAnvil",
    evidence: "site/getting-started.md and current player guide",
    kind: "install",
  },
  {
    id: "help-short",
    seconds: 10.6,
    title: "Try it and report bugs",
    narration:
      "The guide is at Stack Anvil dot pistonmaster dot net. It's experimental, so ask in Discord or report bugs on GitHub.",
    label: "Minecraft Java · StackAnvil",
    evidence: "site/getting-started.md and current player guide",
    kind: "help",
  },
];
export function scenesFor(edition: Edition = "landscape") {
  return edition === "vertical" ? shortScenes : scenes;
}

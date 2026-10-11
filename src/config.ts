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
  voice?: "liam" | "brian";
}
export type Scene = SceneBase &
  (
    | { kind: "footage"; clip: string; framing: "world" | "menu" | "web" }
    | { kind: "install" | "help" | "outro" | "cameo" }
  );
export const scenes: Scene[] = [
  {
    id: "cameo",
    seconds: 7,
    title: "Friends picked Bedrock",
    narration: "Wait, you're all on Bedrock now?",
    label: "Community cameo \u00b7 acted dialogue",
    evidence: "Supplied 64x64 community skin PNG; fictional dialogue",
    kind: "cameo",
    voice: "brian",
  },
  {
    id: "hook",
    seconds: 11,
    title: "Keep your Java client",
    narration:
      "You can join them from Java. This is Stack Anvil, live on CubeCraft's Bedrock server.",
    label: "Minecraft Java Edition \u00b7 StackAnvil Bedrock add-on",
    evidence:
      "Fresh CubeCraft Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "cube-hook",
    framing: "world",
  },
  {
    id: "cube-lobby",
    seconds: 12,
    title: "First stop: CubeCraft",
    narration:
      "CubeCraft has a Bedrock network with its own games and lobby. Take a look at those characters standing around. Each one is a different game.",
    label: "Minecraft Java Edition \u00b7 StackAnvil Bedrock add-on",
    evidence:
      "Fresh CubeCraft Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "cube-lobby",
    framing: "world",
  },
  {
    id: "cube-menu",
    seconds: 13,
    title: "Pick something to play",
    narration:
      "Picking a game works the way you'd hope. Open the menu, hover, click. It's the server's own selector, and it shows up in Java like any other screen. Let's try this one.",
    label: "Minecraft Java Edition \u00b7 StackAnvil Bedrock add-on",
    evidence:
      "Fresh CubeCraft Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "cube-menu",
    framing: "menu",
  },
  {
    id: "cube-play",
    seconds: 17,
    title: "Try CubeCraft parkour",
    narration:
      "And we're in. Keyboard, mouse, your own keybinds, the hotbar habits you've had for years. Your hands already know what to do. I'm not chasing a win today. Just seeing what my friends keep talking about.",
    label: "Minecraft Java Edition \u00b7 StackAnvil Bedrock add-on",
    evidence:
      "Fresh CubeCraft Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "cube-play",
    framing: "world",
  },
  {
    id: "galaxite-lobby",
    seconds: 14,
    title: "Next stop: Galaxite",
    narration:
      "Then there's Galaxite. Totally different server, totally different look. No rush here. I like to just walk for a bit, look up, and get a feel for the place.",
    label: "Minecraft Java Edition \u00b7 StackAnvil Bedrock add-on",
    evidence:
      "Fresh Galaxite Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "galaxite-lobby",
    framing: "world",
  },
  {
    id: "galaxite-actors",
    seconds: 14,
    title: "A world with its own characters",
    narration:
      "And it has its own residents. These characters were made for Galaxite, with their own shapes and animations, and they show up right there in my Java client.",
    label: "Minecraft Java Edition \u00b7 StackAnvil Bedrock add-on",
    evidence:
      "Fresh Galaxite Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "galaxite-actors",
    framing: "world",
  },
  {
    id: "galaxite-menu",
    seconds: 14,
    title: "Menus made for this server",
    narration:
      "Menus feel like Galaxite, too. The game selector has the server's own artwork and its own lineup. I take my time, hover over a few, and pick one that looks fun.",
    label: "Minecraft Java Edition \u00b7 StackAnvil Bedrock add-on",
    evidence:
      "Fresh Galaxite Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "galaxite-menu",
    framing: "menu",
  },
  {
    id: "galaxite-items",
    seconds: 11,
    title: "Your inventory comes too",
    narration:
      "Check the hotbar. Galaxite gives you its own items, and I can scroll through them, hold one up, and open the inventory to look closer.",
    label: "Minecraft Java Edition \u00b7 StackAnvil Bedrock add-on",
    evidence:
      "Fresh Galaxite Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "galaxite-items",
    framing: "menu",
  },
  {
    id: "player-emote",
    seconds: 15,
    title: "Say it with an emote",
    narration:
      "Okay, enough sightseeing. Time to be a bit more me. Open the emote wheel, pick one, and... yeah. Which emotes you have depends on your account.",
    label: "Minecraft Java Edition \u00b7 StackAnvil Bedrock add-on",
    evidence:
      "Fresh Galaxite Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "player-emote",
    framing: "world",
  },
  {
    id: "player-character",
    seconds: 16,
    title: "Bring your character",
    narration:
      "And it's not just emotes. The Character Creator opens right inside Java, with your saved slots and a full model preview. I can flip through pieces and see how each one looks on me. Find a look you like before you head back into the world.",
    label: "Minecraft Java Edition \u00b7 StackAnvil Bedrock add-on",
    evidence:
      "Recorded Dressing Room, saved character slots, and hair/face piece previews",
    kind: "footage",
    clip: "character",
    framing: "menu",
  },
  {
    id: "player-friends",
    seconds: 13,
    title: "Find your Bedrock friends",
    narration:
      "Now, back to those friends on Bedrock. Your friends list is here, with requests, parties, and the worlds they have open, all in a Java client.",
    label: "Minecraft Java Edition \u00b7 StackAnvil Bedrock add-on",
    evidence: "Recorded Bedrock Friends, requests, worlds, and party menus",
    kind: "footage",
    clip: "friends",
    framing: "menu",
  },
  {
    id: "player-realms",
    seconds: 12,
    title: "Your Realm menus are here",
    narration:
      "Realms show up too, at least the menus. Your Realm list is there, and the Realm Hub opens up. What you see depends on your account.",
    label: "Realm list and Realm Hub menus",
    evidence:
      "Recorded Realm list and Realm Hub world/settings menus; menus only",
    kind: "footage",
    clip: "realms",
    framing: "menu",
  },
  {
    id: "player-guide",
    seconds: 12,
    title: "Ready to try it?",
    narration:
      "Want to try it? Everything starts at Stack Anvil dot pistonmaster dot net. The player guide has every step. Here's the short version.",
    label: "stackanvil.pistonmaster.net/getting-started/",
    evidence: "site/getting-started.md and current player guide",
    kind: "footage",
    clip: "website",
    framing: "web",
  },
  {
    id: "player-install",
    seconds: 25,
    title: "Install the Fabric mod",
    narration:
      "First, set up Fabric Loader for the Minecraft version the website lists. Then two downloads. The Stack Anvil Bedrock Addon for ViaFabricPlus, from CurseForge. And the matching ViaFabricPlus JAR, from the same GitHub release linked there. Drop both into your mods folder. Just one copy of ViaFabricPlus. The add-on covers the rest.",
    label: "Minecraft Java Edition \u00b7 StackAnvil Bedrock add-on",
    evidence: "site/getting-started.md and current player guide",
    kind: "install",
  },
  {
    id: "player-connect",
    seconds: 22,
    title: "Sign in, choose Bedrock, join",
    narration:
      "Start Minecraft with Fabric, open Multiplayer, and click ViaFabricPlus. Under Bedrock settings, choose Account for Bedrock Edition and sign in through your browser. Then add the server address, pick the matching Bedrock version in ViaFabricPlus, and accept resource packs when asked.",
    label: "Minecraft Java Edition \u00b7 StackAnvil Bedrock add-on",
    evidence: "site/getting-started.md and current player guide",
    kind: "footage",
    clip: "connect",
    framing: "menu",
  },
  {
    id: "player-help",
    seconds: 20,
    title: "Found a bug? Tell us",
    narration:
      "Stack Anvil is still experimental. Compatibility varies by server, and some resource packs render imperfectly. Something broken? Tell us. Get help in Discord. Report bugs on GitHub: your versions, server, steps, and what happened. Leave out account details.",
    label: "Minecraft Java Edition \u00b7 StackAnvil Bedrock add-on",
    evidence: "site/getting-started.md and current player guide",
    kind: "help",
  },
  {
    id: "player-outro",
    seconds: 9,
    title: "Try your next Bedrock server",
    narration:
      "Keep your Java client. Pick a Bedrock server. And tell your friends you're on your way.",
    label: "Minecraft Java Edition \u00b7 StackAnvil Bedrock add-on",
    evidence: "site/getting-started.md and current player guide",
    kind: "outro",
  },
];

export const shortScenes: Scene[] = [
  {
    id: "cameo-short",
    seconds: 5,
    title: "Friends picked Bedrock",
    narration: "Wait, you're all on Bedrock?",
    label: "Community cameo \u00b7 acted dialogue",
    evidence: "Supplied 64x64 community skin PNG; fictional dialogue",
    kind: "cameo",
    voice: "brian",
  },
  {
    id: "hook-short",
    seconds: 10,
    title: "Java on Bedrock servers",
    narration:
      "Stack Anvil lets your Java client join Bedrock servers, like CubeCraft.",
    label: "Minecraft Java Edition \u00b7 StackAnvil Bedrock add-on",
    evidence:
      "Fresh CubeCraft Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "cube-short",
    framing: "world",
  },
  {
    id: "galaxite-short",
    seconds: 11,
    title: "Explore Galaxite",
    narration:
      "Over on Galaxite, the server's own characters and game menus show up right in Java.",
    label: "Minecraft Java Edition \u00b7 StackAnvil Bedrock add-on",
    evidence:
      "Fresh Galaxite Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "galaxite-short",
    framing: "world",
  },
  {
    id: "emote-short",
    seconds: 10,
    title: "Bring your character",
    narration:
      "And yes, I brought my emotes. Which ones you get depends on your account.",
    label: "Minecraft Java Edition \u00b7 StackAnvil Bedrock add-on",
    evidence:
      "Fresh Galaxite Bedrock recording in the Java Fabric client, October 11 2026",
    kind: "footage",
    clip: "emote-short",
    framing: "world",
  },
  {
    id: "install-short",
    seconds: 11,
    title: "Get the Fabric mod",
    narration:
      "Install Fabric. Grab the add-on from CurseForge and the matching ViaFabricPlus. Both go in your mods folder.",
    label: "Minecraft Java Edition \u00b7 StackAnvil Bedrock add-on",
    evidence: "site/getting-started.md and current player guide",
    kind: "install",
  },
  {
    id: "help-short",
    seconds: 10,
    title: "Try it and report bugs",
    narration:
      "Start at Stack Anvil dot pistonmaster dot net. Bugs? Please tell us on Discord or GitHub.",
    label: "Minecraft Java Edition \u00b7 StackAnvil Bedrock add-on",
    evidence: "site/getting-started.md and current player guide",
    kind: "help",
  },
];

export function scenesFor(edition: Edition = "landscape") {
  return edition === "vertical" ? shortScenes : scenes;
}

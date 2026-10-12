import type { Edition } from "./config";

export const publishing: Record<
  Edition,
  { title: string; intro: string; chapters: Record<string, string> }
> = {
  landscape: {
    title:
      "Minecraft Java on Bedrock Servers: CubeCraft and Galaxite | StackAnvil",
    intro:
      "Keep your Minecraft Java client and explore Bedrock server content. Watch StackAnvil on CubeCraft's Bedrock network and Galaxite, with parkour, custom models, animations, server menus and items. Then try Bedrock emotes, Character Creator, friends and party menus, and Economy SMP's Realm Community feed and Timeline. The video also covers the Fabric mod downloads and signing in. Realm footage shows menus only.",
    chapters: {
      hook: "CubeCraft Bedrock from Minecraft Java",
      "cube-menu": "CubeCraft's game selector",
      "cube-play": "Bedrock parkour",
      "galaxite-lobby": "Galaxite: custom models, menus and items",
      "player-emote": "Emotes: B by default",
      "player-character": "Character Creator",
      "player-friends": "Friends and parties",
      "player-realms": "Realm Hub menus",
      "realm-community": "Realm Community and Timeline",
      "player-guide": "Website and downloads",
      "player-install": "Install Fabric and both mods",
      "player-connect": "Sign in and join a Bedrock server",
      "player-help": "Get help and report bugs",
    },
  },
  vertical: {
    title: "Minecraft Java on Bedrock Servers, Quick Look | StackAnvil #Shorts",
    intro:
      "Bedrock server content, your Minecraft Java client. A quick look at CubeCraft Bedrock, Galaxite's custom models and menus, the emote wheel on B by default, and Realm Community and Timeline pages. Install the Fabric add-on with matching ViaFabricPlus. Ask in Discord or report bugs on GitHub.",
    chapters: {},
  },
};

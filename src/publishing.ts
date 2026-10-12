import type { Edition } from "./config";

export const publishing: Record<
  Edition,
  { title: string; intro: string; chapters: Record<string, string> }
> = {
  landscape: {
    title: "Play Bedrock Servers from Minecraft Java | StackAnvil Fabric Mod",
    intro:
      "StackAnvil is a Fabric client mod that lets Minecraft Java Edition connect to Bedrock servers. This showcase follows a Java client through CubeCraft Bedrock and Galaxite, demonstrating parkour, custom models, animations, server menus and items. It also shows Bedrock emotes, Character Creator, friends and party menus, and Economy SMP's Realm Community feed and Timeline. Follow the website guide to install the add-on with matching ViaFabricPlus and sign in. Realm footage shows menus only.",
    chapters: {
      hook: "What StackAnvil does: a Fabric client mod",
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
    title: "Bedrock Servers from Minecraft Java: StackAnvil Fabric Mod #Shorts",
    intro:
      "StackAnvil is a Fabric client mod that connects Minecraft Java Edition to Bedrock servers. See it running CubeCraft Bedrock, Galaxite's custom models and menus, the emote wheel on B by default, and Realm Community and Timeline pages. Install the add-on with matching ViaFabricPlus. Ask in Discord or report bugs on GitHub.",
    chapters: {},
  },
};

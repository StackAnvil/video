# Player showcase production brief

## Audience and goal

Show Minecraft Java players how to explore Bedrock server content while they keep their Java client. Follow a player through real servers, appearance options, account menus, installation, and help.

Use Claude CLI with Opus 5.5 at high effort to rewrite the narrative. Check every claim against the filmed action and current player guide. Liam addresses experienced Minecraft players directly. Keep the narration concise and let the footage carry familiar actions.

## Story

Open with a real Java session on CubeCraft Bedrock. Address the viewer directly, explore the lobby and game selector, then play parkour. Do not explain familiar controls, NPCs, or inventories.

Visit Galaxite next. Use fresh footage of its world, characters, game selector, items, and emotes. Show Character Creator, Friends, and Realm Hub menus as player features. Show no unavailable Realm joins.

End with the website, the CurseForge Fabric add-on, the matching ViaFabricPlus download, and the connection steps. Emphasize Discord for help and GitHub issues for bug reports.

Exclude debug worlds, test fixtures, development explanations, technical route diagrams, Javadocs, and code contribution guidance from this video.

## Filming

Record real Java gameplay on the parent's private display with zero gameplay volume. Use purposeful walks, gradual camera turns, short inspection pauses, and smooth pointer paths. Wait for the world to load before moving. Reject clips with loading failures or unintended falls through terrain.

Give each main scene its own take or a distinct chronological excerpt. Avoid overlapping footage within the main cut. Use the short composition for selected excerpts from the same shoot.

Keep credentials and account tokens private. The owner has approved showing the friends list without blurring names. Record the server, client build, connection route, action, and capture date in the ignored production manifest. Review the full trimmed clip before marking it ready.

## Layout

Keep the existing forest, mint, paper, and rust palette. Use Anton for brief titles and Space Grotesk for captions and instructions.

Gameplay carries most of the story. Show short labels, then clear the view. Installation and help graphics use aligned columns with consistent spacing. Avoid connection arrows and technology boxes.

The portrait cut has a separate script. Keep menus fully visible within their focus region. Use `portraitMenus` ranges for overlays during world shots. Keep subtitles and key actions away from platform controls.

## Audio and exports

Use Eleven v4 through the timestamped dialogue API. Use Liam and include the voice in the cache signature. Keep one second of decoded silence after the final aligned word, followed by the timeline hold. Derive captions from measured alignment.

Use a licensed instrumental and duck it under speech. Keep generated assets and their provenance private. Master at -16 LUFS and check the encoded true peak against the -1.5 dBTP ceiling.

Deliver landscape and portrait MP4s, burned captions, SRT and VTT files, thumbnails, and posting descriptions. Keep descriptions focused on players, downloads, and bug reporting. Credit upstream work and production assets briefly.

Inspect scene layouts and transitions. Review the complete exports and their soundtracks. Run the source checks and timing tests. Uploading is a separate action.

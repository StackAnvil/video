# Expanded showcase production brief

## Audience and goal

Show Minecraft Java players what a Bedrock server session looks like through StackAnvil. Give developers enough detail to understand how the bridge is tested and where to contribute.

The maintainer requested a longer tour, natural movement, richer server content, and a separate portrait cut. Liam remains the narrator, with calm delivery. The script was rewritten with Claude CLI using Opus 5.5 and high effort, then checked against the feature sources and captures.

## Gameplay direction

Open in Galaxite's live lobby. Show server actors, resource-pack artwork, the game selector, inventory items, and emotes. Use gradual mouse turns, short walks toward something useful, pauses to inspect it, and deliberate menu choices. Keep the player grounded. Do not use flight as the opening demonstration.

Use the local Bedrock resource probe for custom blocks. Use the behavior-pack chest fixture for inventory actions and server assertions. Label controlled worlds separately from live public servers.

Browse saved characters and piece previews. Show Friends and Realm Hub menus. The account's available menus establish this demonstration. Do not imply an unavailable Realm join succeeded.

Use real website and Javadoc captures. Include the CurseForge listing and matching release links. Keep screenshots of blocked pages out of the film.

## Story and evidence

`src/config.ts` contains the complete scene order, narration, duration floor, and evidence reference. Each required clip needs a provenance entry and review in the private production manifest.

The later portion explains these routes:

- Java input through ViaBedrock into BDS. Behavior packs prepare fixtures and inspect server state.
- Java input through ViaBedrock and Geyser into Paper. Java plugins supply fixtures and assertions. Boar adds movement diagnostics.
- Unit checks, integration cases, negative controls, recorded-scene replay, and live playtesting.
- MITMProxy for HTTPS account and service traffic. Gameplay packet journals and packet inspection are separate.
- Versioned protocol research, native-client comparisons, reverse engineering, AI assistance, and human review.

A passing case establishes its measured behavior. It does not establish complete Bedrock parity. Keep failures and observation limits visible in research records.

The parent guides are the primary sources: `docs/bedrock-test-packs.md`, `docs/capture-lab.md`, `docs/server-replay.md`, and `docs/bedrock-development-sources.md`. Add-on patch context documents establish the account menus, authored UI, native actors, and appearance features.

## Visual direction

Use forest `#15372d`, dark `#18231e`, paper `#f1f4f2`, mint `#c7e8d3`, and rust `#a75130`. Anton supplies short titles; Space Grotesk supplies labels and captions.

Gameplay fills the landscape frame. Labels appear briefly and leave the action visible. Testing graphics trace the connection and evidence paths. Use short crossfades between scenes.

The portrait cut uses a separate script and composition. Crop world footage around the action. Focus menu footage on its actual controls. Use the clip manifest's `portraitMenus` ranges when an overlay, such as the emote wheel, opens during a world shot. Leave room for captions and platform controls.

## Audio and deliverables

Use [Eleven v4](https://elevenlabs.io/docs/overview/models) with Liam through the [timestamped dialogue API](https://elevenlabs.io/docs/api-reference/text-to-dialogue/convert-with-timestamps). The current account supports 128 kbps MP3 output. Higher bitrates require a different subscription tier.

Decode narration to WAV with an added quiet tail. Keep the entire measured audio duration and an extra timeline hold before the next transition. Caption boundaries come from character alignment. Audio tags do not appear in subtitles.

Use Eleven Music v2.5 for an understated instrumental. Keep its generation metadata private and record the applicable ElevenLabs terms in the manifest. A short track can use one middle phrase repeat with crossfades. The local CC0 score remains available for offline production.

Duck the music smoothly under narration. Keep gameplay silent. Apply two-pass normalization at -16 LUFS with a -1.5 dBTP ceiling, then check the encoded result.

Deliver both MP4 cuts, burned captions, SRT and VTT files, thumbnails, and posting descriptions. Keep raw footage, account data, licensed pack exports, audio caches, and the local manifest private.

Inspect each scene and its transitions. Review the complete exported videos before publication. Chapters must follow [YouTube's timing requirements](https://support.google.com/youtube/answer/9884579?hl=en). Uploading is a separate action.

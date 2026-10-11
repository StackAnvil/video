# First showcase production brief

## Audience and goal

Minecraft Java players want to see whether they can join Bedrock servers. The video demonstrates that connection and identifies the two installation paths.

Lead with visible gameplay. Explain the client and server relationship after the opening. Show the add-on's menus in the real Java client.

## Visual direction

Use the StackAnvil site palette: forest `#15372d`, dark `#18231e`, paper `#f1f4f2`, mint `#c7e8d3`, and rust `#a75130`. Use Anton for short titles and Space Grotesk for captions and labels.

The signature is “Java client. Bedrock server.” Show gameplay behind that statement. Keep menus legible in a large central frame. Use short crossfades and arrows that explain the connection path.

## Storyboard

| Scene            | Minimum duration | Required footage                          | Viewer takeaway                                        |
| ---------------- | ---------------- | ----------------------------------------- | ------------------------------------------------------ |
| Opening          | 9 seconds        | Java player moving in a Bedrock world     | The cross-edition connection is real.                  |
| Direct join      | 12 seconds       | Bedrock address, pack prompt, world entry | The Fabric add-on connects directly.                   |
| Creative catalog | 11 seconds       | Bedrock creative tab and item selection   | The server supplies the catalog.                       |
| Server browser   | 11 seconds       | Featured catalog and server details       | Bedrock discovery appears inside Java.                 |
| Dressing Room    | 11 seconds       | Character or classic skin preview         | Bedrock characters appear inside Java.                 |
| Connection paths | 12 seconds       | Animated diagram                          | ViaProxy and the Fabric add-on serve different setups. |
| Closing          | 9 seconds        | Project address and compatibility note    | The player knows where to start.                       |

Narration can extend these durations. Each scene requires enough footage for its final duration. Do not loop a join or reverse gameplay to fill a gap.

## Claim sources

These local StackAnvil sources were inspected on 2026-10-11. They reside in the parent patches repository.

- Connections and compatibility: `site/index.md` and `site/getting-started.md`.
- Creative catalog: `patches/viafabricplus-bedrock/upstreamable/0010-show-server-creative-items-in-a-bedrock-tab.pr.md`.
- Featured browser: `patches/viafabricplus-bedrock/upstreamable/0015-add-featured-server-browser.patch`.
- Dressing Room: `patches/viafabricplus-bedrock/upstreamable/0003-classic-dressing-room.pr.md`.
- Character geometry: `patches/viafabricplus-bedrock/upstreamable/0006-render-character-creator-geometry-and-face-animations.pr.md`.

These sources establish implementation intent and documented verification. Matching footage establishes the visible demonstration. Recheck sources after a stack update.

## Audio and publication

Compare calm technical and energetic trailer narration before choosing the final delivery. Both use the same opening script and ElevenLabs voice.

The composition ducks the original music under speech. Gameplay audio remains muted. Character alignment determines subtitle timestamps. Do not use estimated word durations for publication.

Deliver a landscape 1080p video, thumbnail, SRT, VTT, JSON captions, and a YouTube description. Review the full render before uploading.

The local world uses a matching Bedrock server. Label local demonstrations accurately. Public server support requires a separate captured join and gameplay demonstration on that server.

## Reference

- [ElevenLabs speech timing](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps).
- [Remotion video component](https://www.remotion.dev/docs/media/video).
- [Minecraft usage guidelines](https://www.minecraft.net/en-us/usage-guidelines).

# StackAnvil video

Create YouTube showcases of Java clients on Bedrock servers. This project uses Remotion, recorded gameplay, ElevenLabs narration, aligned captions, and instrumental music.

`StackAnvilShowcase` is the longer 1080p tour. `StackAnvilShort` is a separate 1080×1920 cut for Shorts, TikTok, and Instagram. They follow a Java player through CubeCraft Bedrock, Galaxite, personal features, and installation. Read the [production brief](docs/production.md) and [episode catalog](docs/features.md) before filming.

## Prepare the editor

From the parent patches repository:

```console
git submodule update --init video
cd video
bun install --frozen-lockfile
cp .env.example .env
```

Set `ELEVENLABS_API_KEY` in `.env`. Set `STACKANVIL_NARRATION` to `calm` or `energetic`. Liam narrates the tour; Brian plays the short fictional opening cameo. Narration uses Eleven v4 through the timestamped dialogue API. Use `ELEVENLABS_CAMEO_VOICE_ID` to choose a different cameo voice.

```console
bun run voiceover calm
bun run music elevenlabs
bun run dev
```

Narration includes measured timestamps. Pass a scene ID to regenerate one line, for example `bun run voiceover calm player-realms`. The scene duration expands for longer speech and keeps a decoded audio tail before each transition. Run `music elevenlabs` after narration to cover the complete timeline with Eleven Music v2.5. The command caches the generated track. If it is slightly short, one middle phrase repeats with crossfades. Use `music original` for the local CC0 score.

## Record footage

Run these commands from the parent patches repository. Read its [capture lab guide](https://github.com/StackAnvil/patches/blob/main/docs/capture-lab.md) first.

```console
bun run lab doctor
bun run lab java start
bun run capture start showcase-take-1
bun run capture ui list
bun run capture video start gameplay --client java --fps 60
# Perform the demonstration on the private display.
bun run capture video stop --client java
bun run capture stop
```

The lab keeps gameplay silent and off the desktop. Record enough footage for the final scene duration in `src/config.ts`. Show a real join and purposeful player movement. A loading screen alone does not establish a playable connection.

The old movement recipe is useful for checking the capture tools. Film showcases with gradual mouse turns, varied walking intervals, observation pauses, and actual interactions:

```console
bun run capture ui run video/scenarios/gameplay.json --client java
```

The `scenarios/menu.json` recipe records a menu that you already opened. Each take needs a fresh capture session or recording name.

The long tour needs fresh CubeCraft and Galaxite shots, plus Character Creator, Friends, Realm menus, the player guide, and connection settings. Scene IDs and clip IDs live in `src/config.ts`. Import a selected range from the video directory:

```console
bun run footage cube-lobby /absolute/path/to/cube-characters-java.mp4 0 12 "CubeCraft Bedrock, live Fabric client on the private display"
```

The importer removes audio and records a checksum. Raw recordings stay in the parent's private `.stackanvil/` directory. Imported clips and the local production manifest also remain ignored.

Watch the entire imported clip. Verify the feature, account privacy, player names, chat, addresses, and included pack artwork. Then record your review:

```console
bun run review cube-lobby
```

Changing imported bytes invalidates the checksum. Importing a replacement clears its review status.

## Inspect and export

```console
bun run check
bun run test
bun run inspect
bun run render:preview
bun run verify
bun run render
bun run inspect vertical
bun run verify vertical
bun run render vertical
```

`inspect` renders the beginning, middle, and end of each scene, including transition frames. It also exports a thumbnail. Inspect the images in `out/review/`.

The preview supports incomplete productions and marks the video as a production preview. The final render rejects missing, stale, changed, short, or unreviewed assets.

Final files appear in `out/`:

- `showcase.mp4`: 1920×1080 H.264 at 30 fps with AAC audio and burned captions.
- `showcase-vertical.mp4`: 1080×1920 H.264 at 30 fps with phone-safe captions.
- `showcase-vertical.srt`, `showcase-vertical.vtt`, and `social-description.txt`: portrait subtitles and posting text.
- `showcase.srt`, `showcase.vtt`, and `showcase.captions.json`: measured subtitles for YouTube and further edits.
- `thumbnail.png`: a server frame without captions, exported by `inspect`.
- `youtube-description.txt`: a description with chapters, project links, and credits.

Before uploading, watch the full render. Listen for clipped speech, weak music balance, and incorrect pronunciation. Verify subtitle timing and each demonstration. Uploading is a separate action.

## Media and licenses

The source code uses GPL-3.0-or-later. The local music generator produces an original CC0 score. Tracks generated with Eleven Music follow the applicable ElevenLabs music terms, recorded in the private manifest. Fonts retain their package licenses. Narration rights depend on the ElevenLabs account plan.

Minecraft footage and included server artwork retain their owners' rights. Read the [Minecraft usage guidelines](https://www.minecraft.net/en-us/usage-guidelines) and any server restrictions before publishing. Keep account data and licensed resource exports private.

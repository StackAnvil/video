# StackAnvil video

Create YouTube showcases of Java clients on Bedrock servers. This project uses Remotion, recorded gameplay, ElevenLabs narration, aligned captions, and an original score.

The first composition is `StackAnvilShowcase`. It covers a direct join, the creative catalog, the server browser, the Dressing Room, and both connection paths. Read the [production brief](docs/production.md) and [episode catalog](docs/features.md) before filming.

## Prepare the editor

From the parent patches repository:

```console
git submodule update --init video
cd video
bun install --frozen-lockfile
cp .env.example .env
```

Set `ELEVENLABS_API_KEY` in `.env`. Set `STACKANVIL_NARRATION` to `calm` or `energetic`. The default voice matches the EnderDash video project.

```console
bun run voiceover calm
bun run music
bun run dev
```

Narration includes measured timestamps. The scene duration expands for longer speech. Run `music` after narration to cover the complete timeline.

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

The lab keeps gameplay silent and off the desktop. Record at least 15 seconds for each scene. Show a real join and player movement. A loading screen alone does not establish a playable connection.

After joining an owned world, use the reusable movement recipe from the parent repository:

```console
bun run capture ui run video/scenarios/gameplay.json --client java
```

The `scenarios/menu.json` recipe records a menu that you already opened. Each take needs a fresh capture session or recording name.

The first showcase uses these clip IDs: `gameplay`, `join`, `creative`, `servers`, and `skins`. Import selected ranges from the video directory:

```console
bun run footage gameplay /absolute/path/to/gameplay-java.mp4 2 15 "Owned local Bedrock 1.26.51.1 world, direct Fabric connection"
```

The importer removes audio and records a checksum. Raw recordings stay in the parent's private `.stackanvil/` directory. Imported clips and the local production manifest also remain ignored.

Watch the entire imported clip. Verify the feature, account privacy, player names, chat, addresses, and included pack artwork. Then record your review:

```console
bun run review gameplay
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
```

`inspect` renders the beginning, middle, and end of each scene, including transition frames. It also exports a thumbnail. Inspect the images in `out/review/`.

The preview supports incomplete productions and marks the video as a production preview. The final render rejects missing, stale, changed, short, or unreviewed assets.

Final files appear in `out/`:

- `showcase.mp4`: 1920×1080 H.264 at 30 fps with AAC audio and burned captions.
- `showcase.srt`, `showcase.vtt`, and `showcase.captions.json`: measured subtitles for YouTube and further edits.
- `thumbnail.png`: the opening frame without captions, exported by `inspect`.
- `youtube-description.txt`: a description with chapters, project links, and credits.

Before uploading, watch the full render. Listen for clipped speech, weak music balance, and incorrect pronunciation. Verify subtitle timing and each demonstration. Uploading is a separate action.

## Media and licenses

The source code uses GPL-3.0-or-later. The music generator produces an original CC0 score. Fonts retain their package licenses. Narration rights depend on the ElevenLabs account plan.

Minecraft footage and included server artwork retain their owners' rights. Read the [Minecraft usage guidelines](https://www.minecraft.net/en-us/usage-guidelines) and any server restrictions before publishing. Keep account data and licensed resource exports private.

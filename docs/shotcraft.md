# Shotcraft integration

This guide covers reusable motion for StackAnvil video authors. The existing production workflow remains the delivery workflow.
The `Shotcraft` Studio folder contains silent landscape and portrait studies. These studies are not finished product videos.

## Preview the shots

```bash
bun run shotcraft:inspect
bun run shotcraft:render
```

Append `landscape` or `vertical` to inspect or render one format. Outputs stay in `out/shotcraft/`.
The inspection command renders scene boundaries, motion checkpoints, and the last frame.
The render command exports both H.264 studies at their native dimensions, with 30 frames per second.
Open `ShotcraftSampler` or `ShotcraftSamplerVertical` in Remotion Studio to review motion.

## Reuse a shot

The components live in `src/components/shotcraft/`.

| Component      | Upstream recipe                    | Controls and use                                                                    |
| -------------- | ---------------------------------- | ----------------------------------------------------------------------------------- |
| `BlurTitle`    | `blur-slide`                       | Title, subtitle, styles, and delay in 30 fps reference frames. Keep copy short.     |
| `ChapterFocus` | `title-demote-to-label`, variant A | A short title and child content. The title becomes a persistent label.              |
| `bottomPush`   | `bottom-push-stack-wipe`           | A TransitionSeries presentation. Use the sampler's 26-frame eased timing at 30 fps. |
| `BrandOutro`   | `logo-shrink-wordmark-lockup`      | Brand name, address, and a mark. The ring contracts before the wordmark appears.    |

`theme.ts` uses this project's existing brand values and local fonts.
`timing.ts` defines the sampler timeline, including both transition overlaps.
Chapter and outro components delay their motion through the incoming 26-frame push.
Use them with that transition budget, or change the delay when adapting a standalone scene.

Keep the child content on its original frame clock. A title reveal must not retime footage or recorded events.
Preserve measured narration, caption alignment, speech tails, and reading holds.
Choose music edit points after those timings are final.
Design portrait framing separately. Inspect each format with the real copy and assets.

## Project use

The sampler contains branded motion graphics and no gameplay footage.
Use short titles around reviewed Java gameplay. Keep installation and download instructions in PlayerGuide.
Preserve the Fabric client mod definition, menu framing, compatibility limits, and readiness checks.
Do not substitute the motion study for gameplay evidence.

## Use the upstream skill

The full skill is installed locally at `~/.codex/skills/video-shotcraft` and becomes available on the next agent turn.
For another Codex installation, use the bundled skill installer:

```bash
python "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-installer/scripts/install-skill-from-github.py" \
  --repo Vincentwei1021/video-shotcraft \
  --ref 43bd349a136651865ecfa6ea1cf012f6e957d304 \
  --path . --name video-shotcraft
```

Read the [shot gallery](https://vincentwei1021.github.io/video-shotcraft/library.html) before choosing another recipe.
Read the selected recipe and its exact demo source before adapting its timing.
The local components run without an installed skill or network access.

The reviewed upstream revision is [43bd349](https://github.com/Vincentwei1021/video-shotcraft/commit/43bd349a136651865ecfa6ea1cf012f6e957d304).
[Source records and attribution](../third-party/video-shotcraft/NOTICE.md) describe the adaptations.
No upstream audio is imported. Select and record audio rights through the existing asset workflow.

## Workbench boundary

Motion Workbench integration is deferred. Its reviewed Remotion version is 4.0.484.
This project's existing Remotion version remains unchanged.
A future integration must align dependencies and derive its manifest from the production timeline.
Require rendered-frame parity, then repeat footage, caption, and audio checks after editorial changes.
Workbench exports cannot replace production readiness checks.

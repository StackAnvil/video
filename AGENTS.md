# StackAnvil video contributor instructions

Use Bun and TypeScript. Read `docs/production.md` before changing a showcase. Read `docs/features.md` for filming candidates.

Use the Remotion skills for compositions, narration, captions, transitions, and rendering. Use frontend-design and uncodixfy for visual work.

Keep major scenes in separate files. Drive motion from frames. Preserve the site's forest, mint, rust, and paper colors.

Use real Java gameplay for demonstrations. Never replace product footage with generated screens. Record on the parent's private lab display with zero gameplay volume. Desktop input requires explicit user authorization.

Keep recordings, screenshots, private manifests, credentials, caches, and licensed assets out of Git. Preserve upstream attribution. Record media provenance and review the entire trimmed clip before marking it reviewed.

Verify claims against the owning patch and matching version. Show custom content only with footage of that content. Describe compatibility limits without promising complete Bedrock parity.

Identify StackAnvil as a Fabric client mod in the opening sentence. Establish the Java client, Bedrock server connection, and account sign-in before the server tour. Connect each demonstration to what the mod enables. Review the script for product clarity before generating narration. Keep titles, thumbnails, and context labels consistent with that explanation.

Generate narration before music. Use measured speech alignment for captions. Preserve transition overlap in the shared timeline. Never bypass final render readiness checks.

Run `bun run check` and `bun run test`. Inspect scene and transition frames. Inspect the full audio and video before declaring a video ready for YouTube.

## Publishing

Treat the upload package as part of every finished video. An MP4 alone is not a complete delivery.

- Create a designed thumbnail from reviewed footage and brand assets. Do not use a bare frame grab as the final thumbnail.
- Keep thumbnail text brief and readable at mobile preview size. Export separate 16:9 and 9:16 thumbnails for the main and vertical cuts.
- Write a distinct title and description for each cut. Lead with the player benefit and show only features that appear in the video.
- Include the website, player guide, downloads, Discord, GitHub issues, compatibility limits, and asset credits in the description.
- Derive main-video chapters from the final timeline, including transition overlap and measured narration. Start at `00:00`. Use at least three ascending timestamps, with ten seconds or more per chapter. Merge short scenes into useful sections. Do not invent timestamps or force invalid chapters into Shorts.
- Export English SRT and VTT captions with the final timing. Preserve the thumbnail composition and metadata source in Git.
- Run `bun run posting` and `bun run posting vertical` to regenerate thumbnails, descriptions, chapters, and subtitle files without rendering the MP4s again. Inspect the images at full size and at mobile preview size.
- When the user authorizes YouTube work, use Pistonmaster (`@pistondev`, channel `UC86szSBHNiuIXC7hIfrMYtg`) for StackAnvil. Verify the channel name and handle before uploading. Never use the personal Alexander Kremer channel as a default. A channel named explicitly by the user takes precedence.
- Preserve the requested visibility. Verify the saved title, description, chapters, thumbnail, caption track, channel, and visibility in Studio. Record video links and upload receipts in ignored local files.

Write Conventional Commit messages. Add a body for non-trivial changes. Never bypass hooks. Never create a new branch without the user's instruction.

## Shotcraft

Read `docs/shotcraft.md` before using Video Shotcraft recipes. Use the local Shotcraft components before adapting another demo. Preserve the existing production and evidence checks. The Shotcraft samplers are motion studies, not final delivery compositions.

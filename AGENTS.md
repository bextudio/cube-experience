# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable experience decisions

- This product is an immersive Persian brand experience, not a landing page.
- Never label the sequential motion assets as videos or expose conventional video-player chrome, scrubbers, timestamps, thumbnails, or play triangles.
- Use a bright white spatial world. The cube is the navigation portal and the main interaction metaphor.
- Preserve the approved visual direction in `reference/approved-experience-direction.png`.
- Use the Bextudio design tokens: white/pale gray surfaces, ink `#0e0e14`, cyan `#0891b2`, Vazirmatn, 8–28px radii, and restrained motion.
- Keep links to `bextudio.com`, `app.bextudio.com`, and social channels visible at the experience edge.
- The primary experience language is Persian and all layout/copy must work in RTL.
- The experience follows the source sequence in `story.html`: `01 → 02 → 04 → 05 → 06 → 07`. The opening cube rotation loops until the user moves forward.
- Chapter `02` is a true held-loop state using the original luminous-city orbit (`story-02-alt.mp4`, source `video_5nqBDKtxr7F_19_56_1920x1080.mp4`). During `video_5rNlE6P5CjF_19_56_1920x1080.mp4`, forward scroll and the forward button unlock exactly at second 15; reverse navigation is available from the first frame.
- A forward scroll at or after second 15 immediately skips both the remainder of `video_5rNlE6P5CjF_19_56_1920x1080.mp4` and the luminous-city loop, then directly plays `video_6dz6DlVM8Qx_19_56_1920x1080.mp4` (`story-001-white.mp4`). Before second 15, only forward navigation is locked and receives the locked-state explanation.
- Every active forward transition can reverse immediately from the current visual moment. Use its matching pre-rendered reverse asset and map normalized progress as `reverseTime = reverseDuration × (1 − forwardProgress)`; keep the outgoing frame visible until the reverse frame is decoded.
- The next user scroll from the city loop launches source `video_6dz6DlVM8Qx_19_56_1920x1080.mp4` (`story-001-white.mp4`) as the city-to-monitor connection.
- When the user requests navigation while chapter `01` is looping, queue the request and let the current cube cycle reach its natural endpoint. In chapter `02`, directional scroll on the luminous-city loop (`story-02-alt.mp4`) acts instantly and starts the matching forward or reverse connection without waiting for the loop boundary.
- While a loop-boundary request is queued, show a concise Persian status with real cycle progress; switch it to a short “movement started” confirmation when the connecting motion begins.
- Down-scroll, upward mobile swipe, keyboard down, or the next control plays the next source transition. Up-scroll, downward swipe, keyboard up, or the previous control plays the matching reverse transition.
- Do not auto-advance ordinary chapters at the end of a transition. The one exception is the final forward transition: when it ends, automatically return to chapter `01` and restart the rotating-cube loop. Use dual buffered media layers and preload adjacent transitions to avoid black frames, loading flashes, or visual glitches.
- During every media handoff, keep the outgoing frame fully opaque below the decoded incoming frame until the incoming reveal completes; never fade both layers over the white stage at the same time.
- Forward navigation is circular: completion of the final forward motion automatically returns to chapter `01` and restarts the rotating-cube loop without another gesture.
- On first arrival at chapter `03`, the first in-scene monitor powers on automatically and plays `video_6o9kM7JuFNl_19_56_1166x654.mp4`. Scroll remains available during playback: either direction first performs the CRT power-off collapse, then starts the matching transition. If uninterrupted, natural completion also powers the display off before continuing forward.
- The second monitor is a Persian RTL Dynamic Brand Experience Book library. Every PDF placed directly in `public/assets/catalogs/` becomes a clickable catalogue automatically at dev/build time; an optional same-basename PNG in `public/assets/catalogs/covers/` supplies its card image.
- Catalogue reading is a real two-page spread. The four restored Storyline books use their original page artwork and a very quiet original page-turn sound; newly dropped PDFs without extracted page artwork retain the automatic embedded-PDF fallback.
- The two-page reader follows the Storyline left-to-right reading model. Its bordered spread must fill the monitor horizontally with only a 10–11 px physical-screen inset; do not return to a small floating book card with large gray side margins. Next/previous edge controls may overlay the page margins, and left/right arrow keys must turn the spread.
- Book turns must behave like physical paper: render the actual front and back page artwork on one 3D sheet hinged at the center spine, expose the target page underneath during the turn, move next pages right-to-left and previous pages left-to-right, and preserve subtle page-thickness and spine shadows. Never substitute a whole-spread fade or flat image swap for the page turn.
- The reader must support direct-manipulation page turns with mouse, pen, and touch. Drag the right page toward the left for the next spread and the left page toward the right for the previous spread; track the sheet continuously under the pointer, commit after a short distance or decisive flick, and spring back when released below threshold. Keep button and keyboard navigation as accessible equivalents.
- Monitor content must sit exactly inside the physical black screen without any added reflection/glare overlay. The large screen uses the measured `60.8%` stage height; reducing it creates an artificial black band. The first monitor performs a CRT-style power-off collapse before any connecting movement begins.
- Full-scene Storyline motion assets use proportional `object-fit: cover` so the spatial world always fills the viewport and never gains white letterbox bands. Only media embedded inside physical monitors uses `object-fit: contain`, keeping the complete embedded frame inside its measured black display. Do not apply monitor-fit rules globally to `.scene-slot`.
- Chapter `04` uses the in-scene large monitor as a three-choice experience hub: AI Video Experience, Transmedia Campaign, and Phygital Experience. Each choice plays its original source asset inside the same reflected screen.
- Chapter `05` uses the physical small vertical monitor. Its screen plays the original Storyline social-media source (`video_5jDFODlJtdP_19_56_1154x644.mp4`) proportionally, with only the two upper corners curved to follow the stand. The three physical LinkedIn, Instagram, and Telegram objects remain invisible but accessible link hit-zones; do not add duplicate visible icons.
- The “حرکت آغاز شد” notice is exclusive to the instant `story-02-alt.mp4 → story-001-white.mp4` city-loop exit. Do not show it for the opening-loop boundary, the second-15 entrance skip, or ordinary transitions.
- Keep active assets grouped under `public/assets/brand`, `public/assets/motions`, `public/assets/monitors`, `public/assets/catalogs`, and `public/assets/audio`; do not reintroduce flat duplicates.
- Keep the later Phygital monitor as an optional interaction attached to its held chapter state. Opening it pauses chapter navigation until it is closed.
- Header placement and controls should follow the live `bextudio.com` language: a slim white top bar, unboxed logo, cyan primary actions, outlined secondary actions, and restrained 8–14px radii.
- Do not place a separate landing/hub screen or require an “enter” action before the sequence. Narrative and controls live at the experience edge and recede while motion is active.

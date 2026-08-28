# Design QA — Circular Storyline experience with interactive monitors

## Evidence

- Source visual truth:
  - `reference/storyline-original-monitor-screen.png` — browser capture of the original `story.html` BEX monitor state.
  - `reference/bextudio-live-home.png` — browser capture of the live `bextudio.com` header, logo placement, buttons, spacing, and color language.
  - `reference/story-01-source-frame.png` — exact opening motion frame.
  - `reference/storyline-city-loop-reference.png` — supplied Storyline city-loop state and interaction reference.
- Rendered implementation:
  - `reference/loop-monitor-start-final.png` — opening state.
  - `reference/monitor-bex-playing.png` — BEX monitor state.
  - `reference/monitor-fun-desktop.png` — selected Fun monitor state.
  - `reference/monitor-books-desktop.png` — selected Dynamic Brand Experience Book state.
  - `reference/loop-monitor-mobile-final.png` and `reference/monitor-mobile.png` — responsive states.
  - `reference/city-loop-implementation.png` — corrected held-loop city state.
  - `reference/movement-queued-feedback.png` — scroll-trigger acknowledgement with live cycle progress.
  - `reference/full-5r-to-5n-loop.png` — state immediately after the complete 44.139-second entrance asset cuts to the 28.8-second city loop.
  - `reference/scroll-starts-6dz.png` — second scroll launching the requested city-to-monitor asset.
  - `reference/entrance-scroll-after-15.png` — queued forward navigation inside the full entrance after its 15-second unlock threshold.
  - `reference/first-monitor-playing.png` — automatic first-monitor BEX playback in the physical screen.
  - `reference/second-monitor-catalog.png` — generated four-catalogue selection state in the second monitor.
  - `reference/catalog-reader.png` — selected PDF rendered inside the same monitor.
- Same-input comparison: `reference/loop-monitor-qa-comparison.jpg`.
- City-loop same-input comparison: `reference/city-loop-qa-comparison.png` (source on the left, implementation on the right).
- Latest sequence same-input comparison: `reference/sequence-feedback-qa-comparison.png` (normalized Storyline city source on the left, post-cut looping implementation on the right).
- Scroll-unlock comparison: `reference/scroll-after-15-qa-comparison.png` (normalized Storyline city source on the left, active entrance with queued-scroll acknowledgement on the right).
- Catalogue-monitor comparison: `reference/catalog-monitor-qa-comparison.png` (supplied catalogue reference on the left, implemented second-monitor state on the right).
- Latest five source/implementation comparisons: `reference/qa/compare-monitor-video.jpg`, `reference/qa/compare-catalog.jpg`, `reference/qa/compare-book.jpg`, `reference/qa/compare-channels.jpg`, and `reference/qa/compare-social.jpg`. The combined review sheet is `reference/qa/comparison-contact-sheet.jpg`.
- Latest interaction references supplied by the user: `codex-clipboard-118a48b1-f91b-4318-a56f-4d3aff60f3af.png`, `codex-clipboard-588b4641-a2ae-44f1-87d1-8998e85f5af4.png`, and `codex-clipboard-0ff62c57-d343-41c7-bd3e-fa5c0725b501.png`.
- Latest book-fit reference supplied by the user: `codex-clipboard-147fb7e1-79a6-474a-b7b9-0bd3e5de752d.png`. Rendered implementation: `reference/qa/book-edge-fit.png`. Side-by-side review: `reference/qa/book-edge-fit-comparison.jpg`.
- Latest media-fit and social-monitor references: `codex-clipboard-1eeeecd4-9625-414b-81e4-a37455ce257a.png`, `codex-clipboard-8de3270a-4447-429c-8373-fb5fe3ea8c2d.png`, `codex-clipboard-67f13850-0d70-4057-afc5-490349eab2db.png`, and `codex-clipboard-0fbcb52d-898b-4918-a96e-720ba228cafa.png`. Rendered social state: `reference/qa/social-video-contain.png`; comparison: `reference/qa/social-video-contain-comparison.jpg`.
- Latest physical page-turn reference: `codex-clipboard-57ed94bc-a589-4b5a-a42b-39ce366f6b6e.png`. Browser evidence: `reference/qa/book-flip-before.png`, `reference/qa/book-flip-mid.png`, and `reference/qa/book-flip-after.png`; combined review: `reference/qa/book-physical-turn-comparison.jpg`.
- Latest direct-manipulation reference: `codex-clipboard-b3495473-329d-4200-bd5f-5263ac8d6ef6.png`, requesting mouse/touch page handling on the same full-width physical spread.
- Desktop source and implementation: 1440 × 1024 CSS px and image px, device density 1.
- Mobile implementation: 390 × 844 CSS px and image px, device density 1.
- City-loop source: 2560 × 1440 px browser capture. Its 1792 × 1008 experience region was cropped and normalized to 1280 × 720 px. City-loop implementation: 1280 × 720 CSS/image px at density 1.
- States compared: opening cube, luminous-city held loop, city-to-monitor transition, monitor-to-city reverse transition, BEX monitor playing, transmedia selection, book selection, and mobile monitor.

## Findings

- No actionable P0/P1/P2 differences remain.
- Typography: the implementation uses Vazirmatn for Persian with a clear display/body scale and stable wrapping. Weight and density follow the supplied app design system while retaining the live site's restrained hierarchy.
- Spacing and layout: the opening asset preserves its source crop and focal position. The new 64 px white header mirrors the live site's edge-to-edge navigation bar. Monitor content retains the original 16:9 composition while adapting its surrounding controls for a modern responsive dialog.
- Colors and tokens: white/pale-gray surfaces, ink `#0e0e14`, cyan `#0891b2`, subtle lines, and restrained shadows match the Bextudio sources. The dark field behind monitors is functional focus treatment, not a replacement asset.
- Image and media fidelity: the BEX and Phygital monitor content, sequential motions, and all four book covers are direct project assets. No placeholder, CSS illustration, custom SVG, or generated substitute is used.
- Catalogue fidelity: the implementation preserves the supplied white in-monitor composition and four-option rhythm while using the available real book artwork as actionable covers. Cards use the approved Bextudio typography, cyan focus treatment, restrained radius, and no gradients.
- Reader fidelity: all four original Storyline books were restored at full page counts (135, 99, 66, and 108 pages). The custom reader always displays a scaled two-page spread, uses real page images, has previous/next controls, and plays the original flip sound at volume `0.035` only when sound is enabled.
- Reader fit: the spread now uses the full available monitor width with a visible `1px` ink border and measured 11 px left/right inset. The page order and controls run left-to-right like the Storyline source; large gray side gutters and the undersized floating-book treatment are removed.
- Reader motion: a 720 ms perspective page turn now hinges a real two-sided paper sheet at the center spine. Forward turns carry the current right page over the next left page from right to left; previous turns mirror the motion from left to right. The actual adjacent page is visible beneath the moving sheet, while subtle stacked-paper and spine shadows keep the material close to the Dynamic Brand Experience Book instead of fading the whole spread.
- Reader direct manipulation: the visible paper is now draggable by mouse, pen, or touch. Pointer distance maps continuously to the sheet's 0–180° rotation; a 26% pull or a short decisive flick commits the turn, while an early release settles the sheet back onto the current spread. Pointer capture keeps the page attached to the hand outside its initial edge, and `touch-action: none` prevents the browser from stealing the horizontal gesture.
- Screen fidelity: the large-screen overlay uses the corrected `60.8%` stage height and fills the physical black display without the artificial lower black band visible in the rejected mockup. The small vertical overlay remains aligned to the physical screen at approximately `43.05% / 38.45% / 14.05% / 30.85%` within the 16:9 stage. All artificial reflection/glare layers have been removed.
- Video fidelity: full-scene Storyline motion uses proportional `cover`, preserving the original edge-to-edge spatial experience without white letterbox bands. Embedded monitor media alone uses proportional `contain`; the browser reports the social source at its true `1154 × 644` dimensions inside a `179.83 × 222.11` physical frame with no crop. Black letterbox space is intentional whenever a landscape source is shown inside the vertical stand.
- Copy and content: Persian labels describe chapters and monitors as parts of the brand experience. Asset filenames and the word “video” are not exposed in the interface.
- Icons: controls use one React Icons family with consistent stroke/weight and accessible labels.
- Responsiveness: desktop and 390 px mobile captures have no horizontal overflow. All persistent mobile actions and monitor controls are at least 44 px.
- Interaction behavior: monitor selection, previous/next, play/pause, close, Escape, chapter navigation lock, directional entrance scrolling, and automatic final-to-opening loop are functional.
- Motion continuity: the opening and luminous-city states are real loops. A navigation request disables native looping but lets the active cycle reach its exact endpoint before the connecting motion begins. The outgoing frame remains opaque below the first decoded incoming frame, eliminating the white exposure between assets.

## Intentional adaptations

- The original Storyline monitor is embedded directly in the scene with legacy controls. The implementation keeps the exact moving content and 16:9 framing but presents it in a focused Bextudio dialog so selections remain usable on mobile.
- The live Bextudio homepage and the immersive experience are different content states. The comparison is used for header placement, white surfaces, cyan primary action, outlined secondary action, logo treatment, and radius—not for identical hero composition.

## Comparison history

1. First responsive pass found a P2 accessibility issue: mobile monitor close measured 40 × 40 px and play/pause measured 38 × 38 px.
2. Fixed mobile monitor close, play/pause, and carousel controls to 44 × 44 px in `src/styles.css`.
3. Post-fix browser measurement confirms all visible mobile monitor controls are 44 × 44 px; body width equals viewport width (390/390).
4. The supplied city reference exposed a P1 sequence mismatch: chapter 02 held only the final entrance frame instead of running the original 28.8-second city orbit, and the source `04` forward/reverse connections were not reached from that held state.
5. Rebuilt playback around explicit idle loops and connecting motions. A later source-accurate review corrected the definitive path to `story-01.mp4 (loop) → story-02-forward.mp4 (44.139 seconds, complete) → story-02-alt.mp4 (28.8 seconds, loop) → story-001-white.mp4 (6.144 seconds, scroll-triggered)`.
6. The same pass fixed the P1 white flash by keeping the outgoing slot fully opaque while decoded transition assets reveal above it. The specific `story-02-forward.mp4 → story-02-alt.mp4` handoff is an intentional direct cut with transitions disabled for that frame, as required by the source sequence.
7. Post-fix comparison `reference/city-loop-qa-comparison.png` confirms the same luminous city, source crop, cyan treatment, and monitor background; the Bextudio header and chapter UI are intentional approved adaptations.
8. The latest P1 sequence correction replaces the shortened entrance with the complete 44.139-second source asset and replaces the next transition with the requested 6.144-second white city-to-monitor source. Browser observations sampled the entrance at 11.731, 21.101, 30.532, and 39.896 seconds before confirming it ended at 44.139 seconds.
9. Added a P2 interaction acknowledgement for loop-boundary latency: immediate Persian status, real-time progress tied to `currentTime / duration`, and a short movement-started confirmation. The state is readable, keyboard-neutral, announced via `role=status`, and uses existing Bextudio tokens.
10. A later interaction requirement exposed a P2 dead-input period inside the 44.139-second entrance. Directional navigation is gated at second 15: attempts before the threshold receive a clear temporary explanation and progress-to-unlock.
11. The latest behavior separates directions after the threshold. Forward scroll immediately skips the remaining entrance and the city loop, launching `story-001-white.mp4` directly. Reverse scroll at 21.149 seconds kept the entrance active and unpaused; after its natural endpoint, `story-02-reverse.mp4` began and was observed at 5.513 seconds.
12. The new first-monitor sequence was observed in-browser with the exact BEX asset reporting a 115.566667-second duration. Its natural completion started the exact 4.608-second `story-04-forward.mp4`, then revealed the catalogue state without user input.
13. The generated catalogue manifest returned four real PDF entries. Selecting “Dynamic Brand Experience” loaded `/assets/catalogs/Dynamic%20Brand%20Experience.pdf` in the in-monitor reader; its close control returned to the four-card selection.
14. Latest combined comparisons exposed two P1 alignment issues: the large-screen overlay extended below the black display and the small-screen content landed on the adjacent frame. The large display height was corrected to `53.35%`; the small display and its three social hit-zones were remeasured against the final movement frame and corrected.
15. Replaced the single-page native reader for restored Storyline books with verified two-page spreads. Browser QA confirmed `1–2 / 135`, then a successful turn to pages `3–4`; the original page-turn sound is gated by the global mute state and capped at `0.035` volume.
16. Browser QA confirmed the chapter-04 hub exposes three working choices, loads the real AI source in the physical display, fills the measured black area, and preserves the reflection. Chapter-05 exposes three correctly labeled invisible social links over the physical objects.
17. The rejected first-monitor capture exposed a P1 fitting defect: reducing the large screen to `53.35%` created a false black band below the playing content. Restoring the measured `60.8%` height and full-height cover fit aligns the moving image to the physical black screen.
18. Reverse QA initially exposed missing public reverse assets even though copies remained in the built bundle. The exact `story-02/04/05/06/07-reverse.mp4` files were restored to `public/assets/motions/`, included in the production build, and prefetched beside their forward counterparts.
19. Browser QA confirmed the entrance forward control is disabled before second 15 while “معکوس‌کردن حرکت از همین لحظه” remains enabled. After second 15 both directions are available.
20. Timestamp QA switched `story-02-forward.mp4` at 16.967/44.139 seconds to `story-02-reverse.mp4` at 10.389/16 seconds, matching normalized reverse progress instead of restarting the reverse clip.
21. First-monitor QA confirmed directional input during BEX playback triggers the CRT power-off state before launching the requested connecting movement; navigation is no longer blocked until natural media completion.
22. The supplied book screenshot exposed a P1 scale mismatch: the two-page spread occupied only the middle of the display. The stage now stretches the bordered spread from left to right, while each original page retains `object-fit: contain` so artwork is never distorted.
23. Browser measurement confirms the bordered spread is 756.23 px wide inside a 778.23 px physical screen, leaving 11 px on each side. Browser interaction successfully advanced from pages `1–2 / 135` to `3–4 / 135`, and no console errors were emitted.
24. Replaced the fabricated social invitation panel with the unused original Storyline social-media source, organized as `public/assets/monitors/social-media.mp4`. The physical screen retains the measured placement and now curves only its two upper corners.
25. Removed the large-monitor and social-monitor reflection pseudo-elements. Browser computed style confirms the social reflection content is `none` and its video fit is `contain`.
26. Notice QA confirmed the direct second-15 entrance skip does not show “حرکت آغاز شد”, while an actual scroll from the looping `story-02-alt.mp4` city state does show the notice and its “بدون انتظار” supporting copy.
27. Physical book-turn QA captured the spread before, during, and after a forward turn. The moving sheet used page 2 on its front and page 3 on its back, settled at `3–4 / 135`, and the reverse control produced the mirrored active 3D transform without console errors.
28. Corrected an over-broad media-fit rule: `.scene-slot` returned to proportional `cover` for all forward/reverse Storyline motion, while the first monitor, experience hub, social display, and other embedded media retain scoped `contain` rules.
29. Added direct paper manipulation without removing accessible equivalents. Browser QA confirmed the spread advertises the drag instruction, exposes a `grab` cursor and `touch-action: none`, and still completes the button-driven physical turn from `1–2 / 135` to `3–4 / 135` with no console errors.

## Primary interactions tested

- Original sequence still runs forward and backward without a black frame.
- Chapter 01 remains on `story-01.mp4` with `loop=true`. Forward input changes it to `loop=false` without switching source; only its natural `ended` event starts `story-02-forward.mp4`.
- Without user input, `story-02-forward.mp4` plays to 44.139 seconds and then directly cuts to `story-02-alt.mp4`, which runs continuously with `loop=true` for the luminous-city chapter.
- Both loop-boundary scrolls immediately show “درخواست حرکت ثبت شد”, live progress, and then “حرکت آغاز شد” when the connecting motion actually starts.
- Inside `story-02-forward.mp4`, forward input before second 15 shows “ادامه کمی بعد فعال می‌شود”, while reverse is active from the first frame. From second 15 onward, forward input immediately starts `story-001-white.mp4` and bypasses the city loop. Reverse input at any time switches immediately to `story-02-reverse.mp4` at the normalized matching timestamp.
- Directional input during the city loop starts its matching connection immediately; forward launches `story-001-white.mp4` (`video_6dz6DlVM8Qx_19_56_1920x1080.mp4`) and reverse launches `story-02-reverse.mp4` without waiting for the 28.8-second loop boundary.
- Reverse input from the first monitor plays `story-04-reverse.mp4` and settles back into the looping city state.
- On arrival at chapter 03, the first physical monitor performs its power-on state and automatically plays the original BEX asset in full.
- BEX completion automatically plays `story-04-forward.mp4` in full and reveals the second physical monitor catalogue state.
- The catalogue manifest exposes four PDF files as four clickable cards; selecting one replaces the selection state with the embedded document reader, and closing restores the card grid.
- Restored catalogues open as real two-page spreads with page-turn controls; all page images load from organized catalogue assets and no placeholder pages are used.
- The book spread is horizontally fitted to the physical monitor, uses a clear outer border and center seam, and supports next/previous edge buttons plus left/right keyboard navigation.
- Page turns use the real front/back page images on a center-hinged sheet, reveal the destination page underneath, and reverse direction physically when navigating backward; the original quiet page-turn sound remains gated by the global sound state.
- The right sheet can be grabbed and dragged left to advance; the left sheet can be dragged right to go back. Short releases snap back, committed drags settle to the adjacent spread, and mouse, touch, and pen share the same pointer interaction.
- The third large monitor exposes three clickable experience formats and each selection plays its original source motion inside the scene.
- The small monitor content is constrained to its black vertical screen; LinkedIn, Instagram, and Telegram remain visible only as physical scene objects but are keyboard-accessible links.
- The small vertical monitor plays the real Storyline social-media film, preserves the whole frame, has curved upper corners matching the stand, and adds no reflection layer.
- “حرکت آغاز شد” appears only for the instant city-loop-to-white transition; all other paths either use their specific locked/queued/reverse feedback or remain silent.
- During first-monitor BEX playback, chapter scroll navigation remains active and always runs the CRT power-off collapse before moving. Embedded catalogue interaction still owns and temporarily locks chapter navigation.
- Every active forward connection can reverse immediately from the current visual moment through its paired reverse asset; the decoded handoff keeps the prior frame underneath so no white flash is exposed.
- When the final forward motion ends, it automatically crossfades to `story-01.mp4`, sets chapter 01, and resumes its loop without another scroll.
- Mobile viewport has no overflow and all primary tap targets are usable.
- Browser console: no warnings or errors after the tested flow.
- Production build and all four Sites packaging tests pass after asset reorganization.

Focused evidence is included in the upper row of `reference/loop-monitor-qa-comparison.jpg`, where the original Storyline BEX screen and the implementation monitor are readable at the same viewport. The lower row compares the live Bextudio style source with the implementation opening state.

## Final result

passed

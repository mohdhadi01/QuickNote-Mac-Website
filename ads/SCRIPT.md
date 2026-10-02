# QuickNote, Don't Break the Flow — 46s vertical film (v3)

Master: `out/QuickNote-Ad-1080x1920-master.mp4` (1080x1920, 30fps, 46s).
Derivatives cut from the same footage: `-15s.mp4`, `-6s.mp4`.

Third-person cinematography: an over-the-shoulder silhouette developer at a
glowing MacBook in a dark room; the camera pushes in and zooms INTO the screen
for every capture, then pulls back out. Screen-world scenes use the real UI.

| # | Time | View | Events |
|---|---|---|---|
| 1 | 0.0-6.4 | Room, over the shoulder | Rishi: "Hmm, wait. What if we just cache this? This call is way too slow." |
| 2 | 6.4-9.0 | Zoom into the editor | "cache this?" thought glows / Tara: "And you don't want to lose it…" |
| 3 | 9.0-14.0 | Screen: THE MAGIC MOMENT | wave, keys, panel, "Cache the expensive API response" types, return, saved / BACK TO WORK. |
| 4 | 14.0-19.0 | Room, meeting on screen | Aman: "We should probably revisit the onboarding flow before launch. It feels confusing." |
| 5 | 19.0-23.0 | Zoom into the meeting | Rishi: "Right, noted." / capture: "Simplify onboarding before adding features" |
| 6 | 23.0-28.2 | Room at night, video playing | Rishi: "Oh, this is actually really nice. We should try this in our app." |
| 7 | 28.2-30.6 | Zoom into the player | capture: "Try this interaction in QuickNote website" |
| 8 | 30.75-33.85 | Rapid montage: debugger, design canvas, chat | three rhythmic captures |
| 9 | 33.85-38.0 | 3D thought universe, depth of field | THINK. CAPTURE. CONTINUE. / notes converge into the real interface |
| 10 | 38.0-41.3 | MacBook hero | YOUR NOTES STAY ON YOUR MAC. / No account. No cloud. No detour. |
| 11 | 41.3-46 | Product hero on black | panel, wordmark, tagline, keys / "QuickNote. Don't break the flow." "Just keep going." / black, logo |

Sound: room tone, keyboard beds, whoosh + glass on every shortcut, tactile
return clicks, save confirmations, structured score (drone, pulse at 8s,
pads, swell under the universe, drop, resolving A-add9 at 41.6s), and the
score ducks under dialogue automatically.

## Rebuild

```
python3 synth.py     # regenerate score.wav
node render3.mjs     # frames + audio mix + master + derivatives
```

# QuickNote, Don't Break the Flow — 45s vertical film

Master: `out/QuickNote-Ad-1080x1920-master.mp4` (1080x1920, 30fps, 45s).
Derivatives cut from the same footage: `-15s.mp4` (the hook + capture),
`-6s.mp4` (signature interaction only).

Creative concept: DON'T BREAK THE FLOW.
Emotional arc: recognition, curiosity, delight, understanding, desire.
The viewer experiences IDEA -> INTERRUPT -> QUICK CAPTURE -> CONTINUE.

## Scenes (master timeline)

| # | Time | Environment | Events |
|---|---|---|---|
| 1 | 0.0-4.4 | Code editor macro (APIClient.swift) | Dev: "Wait… what if we just cache this?" / "cache this?" thought floats / YOU KNOW THAT MOMENT. |
| 2 | 4.4-8.0 | Editor dims, thought blurs and fades | Narrator: "And you don't want to lose it…" / music drops |
| 3 | 8.0-13.2 | THE MAGIC MOMENT | Glass wave, keys press, panel emerges from layers, "Cache the expensive API response" types, return, saved, panel gone, BACK TO WORK. slides into the code |
| 4 | 13.2-19.5 | Meeting grid (3 tiles) | Aditi: "We should probably revisit the onboarding flow before launch." / "Oh…" / shortcut / note / gone. Meeting continues |
| 5 | 19.5-24.7 | Fullscreen video player | Dev: "Oh, that's actually a good idea." / shortcut / "Try this interaction in QuickNote website" / gone |
| 6 | 24.75-28.95 | Rapid montage: debugger, design canvas, chat, browser | four rhythmic captures: race condition / type scale / Srijan API flow / research tomorrow |
| 7 | 28.95-33.9 | 3D thought universe: captured notes orbit in glass space with depth of field | THINK. / CAPTURE. / CONTINUE. / cards converge into the real interface |
| 8 | 33.9-37.9 | MacBook hero | YOUR NOTES STAY ON YOUR MAC. / No account. No cloud. No detour. |
| 9 | 37.9-45 | Product hero on black | panel with blinking cursor / QuickNote / Capture a thought before it disappears. / keys / Free · Native macOS app / "QuickNote. Don't break the flow." "Just keep going." / black, logo |

## Sound

Three layers, mixed at exact offsets:
1. Real-world: room tone, keyboard beds during every typing window.
2. Interface: whoosh + glass shimmer on each shortcut, tactile return click,
   two-note save confirmation, panel-out movement.
3. Score: near-silent drone, pulse enters at 8s, alternating pads build,
   expansive swell under the universe, drop at 34s, resolving A-add9 chord
   at 40.8s under the end line.

Voices: Rishi (developer lines), Aman (meeting), Tara (narrator), all en-IN.

## Rebuild

```
python3 synth.py     # regenerate score.wav (score + sfx + ambience)
node render2.mjs     # re-render frames, remix audio, recut derivatives
```

Stage: `stage2.html` (deterministic timeline, transform/opacity motion only).
All product UI is the real interface; all notes are demo fragments.

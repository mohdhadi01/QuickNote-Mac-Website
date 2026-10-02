# QuickNote ad film, 34s, 1080p

Cinematic product film in the Apple/Raycast tradition: cold-open problem,
one-hero-moment, capability beats, values, end card. Voiceover: Tara
(en-IN female), slowed to 150 wpm for a soft, calm read.

## Scenes

| # | Time | Visual | Voiceover |
|---|---|---|---|
| 1 | 0.8s | Black canvas, indigo bloom, serif lines fade up | "Every great idea has a short life." |
| 2 | 4.1s | Glass thought-chips drift and dissolve (the busy mind) | "It shows up while you're building, designing, writing. And disappears just as fast." |
| 3 | 10.0s | THE MOMENT: cursor glides in, keycaps press, glass panel drops, note types itself, return flashes, Saved pill pops | "QuickNote catches it in one keystroke. Press. Type. Return. It's saved." |
| 4 | 15.9s | Real app window, slow push-in, cursor visits three callouts timed to VO | "A calm home for everything you capture. Search that keeps up. Pin what matters. Merge the noise." |
| 5 | 23.0s | Type-led privacy statement + three pills | "No accounts. No cloud. Your thoughts stay on your Mac." |
| 6 | 27.8s | End card: icon, wordmark, serif headline, brew command chip | "QuickNote. Capture a thought before it disappears." |

## Craft notes

- All motion is transform/opacity only (compositor-friendly, deterministic).
- Real app screenshots only; demo notes, never real user data.
- The cursor and keycap presses are the "human hand" layer; every press
  lands on a beat of the voiceover.
- Callout chips appear exactly when the voice names the feature.

## Rebuild after changing anything

```
node render.mjs      # re-renders frames + reassembles audio and video
```

VO segments live in `vo/S1..S6.wav` (regenerate with `say -v Tara -r 150`),
the scene timeline auto-adapts to their durations. Output:
`out/QuickNote-Ad-1080p.mp4`.

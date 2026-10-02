#!/usr/bin/env python3
"""Synthesizes the ad's complete sound design bed: score + sfx + ambience.
Pure stdlib. Output: sfx/score.wav (45s stereo)."""
import wave
import math
import struct
import random

SR = 44100
DUR = 45.0
N = int(SR * DUR)
random.seed(7)

buf = [0.0] * N

def add_sample(i, v):
    if 0 <= i < N:
        buf[i] += v

def tone(freq, start, dur, amp, attack=0.01, release=0.08, detune=0.0):
    n0, n1 = int(start * SR), int((start + dur) * SR)
    for i in range(n0, min(n1, N)):
        t = (i - n0) / SR
        e = 1.0
        if t < attack:
            e = t / attack
        elif t > dur - release:
            e = max(0.0, (dur - t) / release)
        f = freq * (1 + detune)
        add_sample(i, amp * e * math.sin(2 * math.pi * f * t))

def noise_burst(start, dur, amp, lp=0.25, sweep=None):
    # lp/sweep are one-pole coefficients in 0..1 (not Hz)
    n0, n1 = int(start * SR), int((start + dur) * SR)
    y = 0.0
    for i in range(n0, min(n1, N)):
        t = (i - n0) / SR
        p = t / dur
        e = math.sin(math.pi * min(p, 1.0)) ** 0.7
        cutoff = lp if sweep is None else lp + (min(sweep, 0.95) - lp) * p
        y += (random.random() * 2 - 1 - y) * cutoff
        add_sample(i, amp * e * y)

def thump(start, freq=60.0, dur=0.28, amp=0.10):
    n0, n1 = int(start * SR), int((start + dur) * SR)
    for i in range(n0, min(n1, N)):
        t = (i - n0) / SR
        e = max(0.0, 1 - t / dur) ** 2
        add_sample(i, amp * e * math.sin(2 * math.pi * freq * t * (1 - t * 0.6)))

def key_click(start, amp=0.016):
    noise_burst(start, 0.012, amp * 0.9, lp=0.5)
    tone(950 + random.random() * 250, start, 0.03, amp * 0.5, attack=0.001, release=0.025)

def typing_bed(a, b, amp=0.014):
    t = a
    while t < b - 0.05:
        key_click(t, amp)
        t += 0.09 + random.random() * 0.08

def whoosh(start, dur=0.4, amp=0.05, lo=0.25, sweep=0.9):
    noise_burst(start, dur, amp, lp=lo, sweep=sweep)

def glass(start, base=2400.0, amp=0.028):
    for k, f in enumerate([base, base * 1.335, base * 1.67]):
        tone(f, start + k * 0.015, 0.7 - k * 0.12, amp * (0.8 - k * 0.2),
             attack=0.004, release=0.55, detune=0.003)

def return_click(start):
    noise_burst(start, 0.01, 0.05, lp=0.6)
    thump(start, 70.0, 0.12, 0.07)

def save_ding(start):
    tone(659.26, start, 0.16, 0.030, attack=0.004, release=0.10)
    tone(987.77, start + 0.09, 0.22, 0.026, attack=0.004, release=0.16)

# ---------- timeline events ----------
# room tone under everything
n0, n1 = 0, N
y = 0.0
for i in range(n0, n1):
    t = i / SR
    e = min(1.0, t / 2.0) * min(1.0, max(0.0, (DUR - 1.0 - t) / 2.0))
    y += (random.random() * 2 - 1 - y) * 0.02
    add_sample(i, 0.012 * e * y)

# music structure (per the prompt's map)
# 0-8: drone only, almost silent
tone(110.0, 0.0, 44.0, 0.045, attack=3.0, release=3.5, detune=0.004)
tone(220.0, 0.0, 44.0, 0.016, attack=3.5, release=3.5, detune=-0.003)
# 8-24: soft pulse + alternating pads, gentle build
t = 8.0
pamp = 0.006
while t < 33.0:
    tone(1000.0, t, 0.05, pamp, attack=0.002, release=0.04)
    t += 0.5
    pamp = min(0.016, pamp * 1.035)
chords = [
    (8.0,  [220.00, 261.63, 329.63]),   # Am
    (10.5, [174.61, 220.00, 261.63]),   # F
    (13.0, [196.00, 246.94, 293.66]),   # G? keep consonant: Em
    (15.5, [220.00, 261.63, 329.63]),   # Am
    (18.0, [174.61, 220.00, 261.63]),   # F
    (20.5, [261.63, 329.63, 392.00]),   # C
    (23.0, [196.00, 246.94, 293.66]),   # Em
    (25.5, [174.61, 220.00, 261.63]),   # F
]
for start, freqs in chords:
    for f in freqs:
        tone(f, start, 3.2, 0.020, attack=1.1, release=1.4, detune=0.002)
# 24-34 montage + universe: expansive pad swell
for f in [220.00, 277.18, 329.63, 415.30]:
    tone(f, 28.8, 5.4, 0.016, attack=1.6, release=2.2, detune=0.003)
# 34-40: drop back (drone only, handled by long tones)
# 40.8: final resolving chord (A add9)
for f in [220.00, 277.18, 329.63, 493.88, 554.37]:
    tone(f, 40.8, 4.2, 0.030, attack=0.9, release=2.4, detune=0.002)

# glass pings at accents
glass(10.15, 2400)
glass(17.45, 2700)
glass(29.55, 2100)
glass(33.55, 3000)
glass(39.35, 2400)

# scene sfx
whoosh(8.20); glass(8.70)
typing_bed(9.35, 10.85)
return_click(11.10); save_ding(11.25); whoosh(11.62, 0.3, 0.03, lo=0.15, sweep=0.8)
thump(3.25, 55.0, 0.3, 0.06)                     # the idea lands
whoosh(16.45); glass(16.90)
typing_bed(17.30, 18.50)
return_click(18.75); save_ding(18.90); whoosh(19.15, 0.3, 0.028, lo=0.15, sweep=0.8)
whoosh(22.75); glass(23.15)
typing_bed(23.50, 24.45)
return_click(24.62); save_ding(24.76)
# montage rhythm
for s in [24.98, 26.03, 27.08, 28.13]:
    whoosh(s, 0.28, 0.038)
    glass(s + 0.28, 2500, 0.022)
    return_click(s + 0.72); save_ding(s + 0.82)
# 3D universe
noise_riser = None
whoosh(28.55, 0.9, 0.045, lo=0.05, sweep=0.85)
glass(29.60, 1900, 0.026)
whoosh(32.55, 0.5, 0.04, lo=0.85, sweep=0.05)

# ---------- write ----------
buf = [0.0 if (v != v or abs(v) == float("inf")) else v for v in buf]
peak = max(abs(v) for v in buf)
scale = 0.72 / peak
with wave.open("sfx/score.wav", "w") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    frames = bytearray()
    for v in buf:
        s = max(-1.0, min(1.0, v * scale))
        val = int(s * 32767)
        frames += struct.pack("<hh", val, val)
    w.writeframes(bytes(frames))
print("score.wav written:", DUR, "s, peak scaled", round(scale, 3))

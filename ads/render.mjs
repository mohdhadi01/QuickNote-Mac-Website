import puppeteer from "puppeteer-core";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FPS = 30;

function dur(f) {
  return parseFloat(execSync(
    `ffprobe -v error -show_entries format=duration -of csv=p=0 "${f}"`).toString().trim());
}

// 1) timeline from real VO durations
const vo = [1, 2, 3, 4, 5, 6].map(i => dur(path.join(HERE, `vo/S${i}.wav`)));
const starts = [0.8];
for (let i = 1; i < 6; i++) starts[i] = starts[i - 1] + vo[i - 1] + (i === 1 ? 1.2 : 1.1);
const total = starts[5] + vo[5] + 3.2;
console.log("starts:", starts.map(s => s.toFixed(2)).join(", "), "| total:", total.toFixed(2));

// 2) frames
fs.rmSync(path.join(HERE, "frames"), { recursive: true, force: true });
fs.mkdirSync(path.join(HERE, "frames"), { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--force-color-profile=srgb", "--disable-lcd-text", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto("file://" + path.join(HERE, "stage.html"), { waitUntil: "load" });
await page.evaluate(() => window.ready);
await page.evaluate(T => window.buildTimeline(T), { starts, vo, total });

const nFrames = Math.round(total * FPS);
const t0 = Date.now();
for (let i = 0; i <= nFrames; i++) {
  const t = i / FPS;
  await page.evaluate(t => window.apply(t), t);
  await page.screenshot({
    path: path.join(HERE, "frames", `f${String(i).padStart(5, "0")}.png`),
    clip: { x: 0, y: 0, width: 1920, height: 1080 },
  });
  if (i % 120 === 0) console.log(`frame ${i}/${nFrames} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
await browser.close();

// 3) assemble: silent video, then VO placed at scene starts
const outDir = path.join(HERE, "out");
fs.mkdirSync(outDir, { recursive: true });
const silent = path.join(outDir, "video_silent.mp4");
execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i "${path.join(HERE, "frames/f%05d.png")}" ` +
  `-c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p "${silent}"`);

const delays = starts.map(s => Math.round(s * 1000));
const inputs = vo.map((_, i) => `-i "${path.join(HERE, `vo/S${i + 1}.wav`)}"`).join(" ");
const chain = vo.map((_, i) => `[${i}:a]adelay=${delays[i]}:all=1[a${i}]`).join(";") +
  `;${vo.map((_, i) => `[a${i}]`).join("")}amix=inputs=${vo.length}:normalize=0,apad[aout]`;
const voTrack = path.join(outDir, "vo_track.m4a");
execSync(`ffmpeg -y -loglevel error ${inputs} -filter_complex "${chain}" ` +
  `-map "[aout]" -t ${total.toFixed(2)} -c:a aac -b:a 192k "${voTrack}"`);

const final = path.join(outDir, "QuickNote-Ad-1080p.mp4");
execSync(`ffmpeg -y -loglevel error -i "${silent}" -i "${voTrack}" ` +
  `-c:v copy -c:a aac -b:a 192k -shortest "${final}"`);

const size = (fs.statSync(final).size / 1e6).toFixed(1);
console.log(`DONE: ${final} (${size} MB, ${total.toFixed(1)}s)`);

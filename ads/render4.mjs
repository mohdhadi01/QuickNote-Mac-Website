import puppeteer from "puppeteer-core";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FPS = 30, DUR = 46.0;

fs.rmSync(path.join(HERE, "frames4"), { recursive: true, force: true });
fs.mkdirSync(path.join(HERE, "frames4"), { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: "new",
  args: ["--force-color-profile=srgb", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
await page.goto("file://" + path.join(HERE, "stage4.html"), { waitUntil: "load" });
await page.evaluate(() => window.ready);
await page.evaluate(() => window.buildTimeline());

const n = Math.round(DUR * FPS);
const t0 = Date.now();
for (let i = 0; i <= n; i++) {
  await page.evaluate(t => window.apply(t), i / FPS);
  await page.screenshot({ path: path.join(HERE, "frames4", `f${String(i).padStart(5, "0")}.png`) });
  if (i % 150 === 0) console.log(`frame ${i}/${n} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
await browser.close();

const outDir = path.join(HERE, "out");
fs.mkdirSync(outDir, { recursive: true });
const silent = path.join(outDir, "v4_silent.mp4");
execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i "${path.join(HERE, "frames4/f%05d.png")}" ` +
  `-c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p "${silent}"`);

// Dialogue configuration
const dlg = [
  ["vo4/d1.wav", 800], ["vo4/n1.wav", 7300], ["vo4/d2.wav", 14400],
  ["vo4/d3.wav", 18600], ["vo4/d4.wav", 23200], ["vo4/n2.wav", 42000],
  ["vo4/n3.wav", 43600],
];
const inputs = `-i "${path.join(HERE, "sfx/score.wav")}" ` +
  dlg.map(([f]) => `-i "${path.join(HERE, f)}"`).join(" ");
const delays = dlg.map(([, ms]) => ms);
const bus = dlg.map((_, i) => `[${i + 1}:a]adelay=${delays[i]}:all=1[d${i}]`).join(";") +
  `;${dlg.map((_, i) => `[d${i}]`).join("")}amix=inputs=${dlg.length}:normalize=0[db]`;
const chain = `[0:a]volume=0.5[m];${bus};` +
  `[m][db]sidechaincompress=threshold=0.02:ratio=8:attack=60:release=500[md];` +
  `[md][db]amix=inputs=2:normalize=0,alimiter=limit=0.89[aout]`;
const mixed = path.join(outDir, "v4_audio.m4a");

execSync(`ffmpeg -y -loglevel error ${inputs} -filter_complex "${chain}" ` +
  `-map "[aout]" -t ${DUR} -c:a aac -b:a 192k "${mixed}"`);

const master = path.join(outDir, "QuickNote-Ad-Master-Production.mp4");
execSync(`ffmpeg -y -loglevel error -i "${silent}" -i "${mixed}" ` +
  `-c:v copy -c:a aac -b:a 192k -shortest "${master}"`);

console.log(`DONE: Production Master rendered at ${master}`);

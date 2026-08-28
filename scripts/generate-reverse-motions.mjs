import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const motionRoot = resolve(projectRoot, "public/assets/motions");
const force = process.argv.includes("--force");
const pairs = [
  ["02-enter-forward.mp4", "02-enter-reverse.mp4"],
  ["04-city-to-monitor-forward.mp4", "04-city-to-monitor-reverse.mp4"],
  ["05-monitor-one-to-two-forward.mp4", "05-monitor-one-to-two-reverse.mp4"],
  ["06-monitor-two-to-three-forward.mp4", "06-monitor-two-to-three-reverse.mp4"],
  ["07-monitor-three-to-social-forward.mp4", "07-monitor-three-to-social-reverse.mp4"],
  ["08-social-to-outro-forward.mp4", "08-social-to-outro-reverse.mp4"],
];

for (const [forwardName, reverseName] of pairs) {
  const input = resolve(motionRoot, forwardName);
  const output = resolve(motionRoot, reverseName);
  if (!existsSync(input)) throw new Error(`Missing source motion: ${forwardName}`);
  if (existsSync(output) && !force) {
    console.log(`skip ${reverseName}`);
    continue;
  }

  console.log(`reverse ${forwardName} -> ${reverseName}`);
  const result = spawnSync(ffmpegPath, [
    "-hide_banner",
    "-loglevel", "warning",
    "-y",
    "-i", input,
    "-map_metadata", "-1",
    "-vf", "reverse",
    "-af", "areverse",
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "8",
    "-profile:v", "high",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", "256k",
    "-movflags", "+faststart",
    output,
  ], { stdio: "inherit" });

  if (result.status !== 0) throw new Error(`FFmpeg failed for ${forwardName}`);
}

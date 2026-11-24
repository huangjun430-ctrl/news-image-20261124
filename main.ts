import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1_048_576; // 1 MiB
const MAX_DIM = 1024;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function validatePng(buf: Buffer): { width: number; height: number } {
  if (buf.length === 0 || buf.length > MAX_BYTES) {
    throw new Error(`Invalid size: ${buf.length} bytes (must be 1..${MAX_BYTES})`);
  }
  if (buf.length < 24 || !buf.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error("Invalid PNG header signature");
  }
  const ihdrType = buf.subarray(12, 16).toString("ascii");
  if (ihdrType !== "IHDR") {
    throw new Error(`Expected IHDR chunk, got ${ihdrType}`);
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  if (width === 0 || height === 0 || width > MAX_DIM || height > MAX_DIM) {
    throw new Error(`Invalid dimensions: ${width}x${height} (max ${MAX_DIM}x${MAX_DIM})`);
  }
  return { width, height };
}

function main(): void {
  const rootDir = dirname(fileURLToPath(import.meta.url));
  const sourcePath = resolve(rootDir, "entry.png");
  const outputPath = process.env.OUTPUT_PATH
    ? resolve(process.env.OUTPUT_PATH)
    : "/output/entry.png";

  if (!existsSync(sourcePath)) {
    console.error(`entry.png not found at ${sourcePath}`);
    process.exit(1);
  }

  const data = readFileSync(sourcePath);
  const { width, height } = validatePng(data);

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, data);

  const outStat = statSync(outputPath);
  const sha256 = createHash("sha256").update(data).digest("hex");
  console.log(
    JSON.stringify({
      status: "ok",
      output: outputPath,
      width,
      height,
      bytes: outStat.size,
      sha256,
    }),
  );
}

main();

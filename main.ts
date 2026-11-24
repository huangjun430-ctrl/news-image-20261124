import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));
const entryPath = resolve(rootDir, "entry.png");
const outputPath = process.env.OUTPUT_PATH ? resolve(process.env.OUTPUT_PATH) : "/output/entry.png";

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

if (!existsSync(entryPath)) {
  fail(`entry.png not found at ${entryPath}`);
}

const stat = statSync(entryPath);
if (!stat.isFile()) {
  fail(`entry.png at ${entryPath} is not a regular file`);
}
const size = stat.size;
if (size < 1 || size > 1048576) {
  fail(`entry.png size ${size} bytes is outside 1..1048576`);
}

const buf = readFileSync(entryPath);
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (buf.length < 24 || !buf.subarray(0, 8).equals(PNG_SIG)) {
  fail("entry.png is not a PNG file");
}
if (buf.toString("ascii", 12, 16) !== "IHDR") {
  fail("entry.png first chunk is not IHDR");
}
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
if (width < 1 || width > 1024 || height < 1 || height > 1024) {
  fail(`entry.png dimensions ${width}x${height} exceed 1024x1024`);
}

const sha256 = createHash("sha256").update(buf).digest("hex");
mkdirSync(dirname(outputPath), { recursive: true });
copyFileSync(entryPath, outputPath);
console.log(JSON.stringify({ status: "ok", output: outputPath, width, height, bytes: size, sha256 }));

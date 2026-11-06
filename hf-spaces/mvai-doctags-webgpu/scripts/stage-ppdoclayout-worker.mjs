import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const PP_DOCLAYOUT_WORKER_URL =
  "https://cdn.jsdelivr.net/npm/web-sdk-pp-doclayoutv3@1.2.0/dist/inference.worker.js";
export const PP_DOCLAYOUT_WORKER_BYTES = 732503;
export const PP_DOCLAYOUT_WORKER_SHA256 =
  "128380b8f435c07b1dec25542355708dbd99e033b2fcf994d13d12bc8b3a6a6b";

const scriptPath = fileURLToPath(import.meta.url);
const spaceRoot = resolve(dirname(scriptPath), "..");
const vendorRoot = resolve(spaceRoot, "vendor", "ppdoclayoutv3");

export async function stagePpDocLayoutWorker({ fetchImpl = fetch, outputRoot = vendorRoot } = {}) {
  const response = await fetchImpl(PP_DOCLAYOUT_WORKER_URL, {
    headers: { accept: "application/javascript" },
    redirect: "follow"
  });
  if (!response.ok) {
    throw new Error(
      `Unable to download PP-DocLayoutV3 v1.2.0 worker: HTTP ${response.status}`
    );
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.byteLength !== PP_DOCLAYOUT_WORKER_BYTES) {
    throw new Error(
      `PP-DocLayoutV3 worker size mismatch: expected ${PP_DOCLAYOUT_WORKER_BYTES}, received ${bytes.byteLength}`
    );
  }
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  if (sha256 !== PP_DOCLAYOUT_WORKER_SHA256) {
    throw new Error(
      `PP-DocLayoutV3 worker SHA-256 mismatch: expected ${PP_DOCLAYOUT_WORKER_SHA256}, received ${sha256}`
    );
  }

  await mkdir(outputRoot, { recursive: true });
  const workerPath = resolve(outputRoot, "inference.worker.js");
  const basePath = resolve(outputRoot, "worker-base.js");
  await writeFile(workerPath, bytes);
  await writeFile(
    basePath,
    "/* Same-origin URL base for PP-DocLayoutV3 v1.2.0 worker resolution. */\\n"
  );

  return {
    bytes: bytes.byteLength,
    sha256,
    workerPath,
    basePath
  };
}

if (process.argv[1] !== undefined && resolve(process.argv[1]) === scriptPath) {
  const result = await stagePpDocLayoutWorker();
  process.stdout.write(
    `Staged PP-DocLayoutV3 worker: ${result.bytes} bytes, SHA-256 ${result.sha256}\\n`
  );
}

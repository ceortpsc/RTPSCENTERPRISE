import { spawnSync } from "node:child_process";
import { delimiter, resolve } from "node:path";

const packageRoot = resolve("services/tax-masterfiles");
const pythonPath = [packageRoot, process.env.PYTHONPATH].filter(Boolean).join(delimiter);
const candidates = process.platform === "win32" ? ["py", "python"] : ["python3", "python"];

for (const executable of candidates) {
  const result = spawnSync(executable, ["-m", "unittest", "discover", "-s", "services/tax-masterfiles/tests", "-v"], {
    stdio: "inherit",
    env: { ...process.env, PYTHONPATH: pythonPath }
  });
  if (result.error?.code === "ENOENT") continue;
  process.exit(result.status ?? 1);
}

console.error("Python 3 is required to run the tax-masterfiles test suite.");
process.exit(1);

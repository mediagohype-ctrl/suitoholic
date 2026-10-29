import { spawn } from "node:child_process";

const isWin = process.platform === "win32";
const npmCmd = isWin ? "npm.cmd" : "npm";
const npxCmd = isWin ? "npx.cmd" : "npx";

console.log("[dev:all] Starting Suitoholic API and Next.js Storefront...\n");

const api = spawn(npmCmd, ["--prefix", "server", "run", "dev"], {
  stdio: "inherit",
  shell: true,
});

const next = spawn(npxCmd, ["next", "dev"], {
  stdio: "inherit",
  shell: true,
});

function cleanup() {
  try { api.kill("SIGTERM"); } catch {}
  try { next.kill("SIGTERM"); } catch {}
  process.exit(0);
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);


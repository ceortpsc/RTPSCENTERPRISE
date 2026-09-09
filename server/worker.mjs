const intervalMs = Number(process.env.WORKER_HEARTBEAT_MS || 60_000);

function heartbeat() {
  console.log(JSON.stringify({ level: "info", service: "rtpsc-maintenance-worker", event: "heartbeat", at: new Date().toISOString() }));
}

heartbeat();
const timer = setInterval(heartbeat, intervalMs);

function shutdown(signal) {
  console.log(JSON.stringify({ level: "info", service: "rtpsc-maintenance-worker", event: "shutdown", signal, at: new Date().toISOString() }));
  clearInterval(timer);
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

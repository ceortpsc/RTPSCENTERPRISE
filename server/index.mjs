import http from "node:http";

const port = Number(process.env.PORT || 8800);
const allowedOrigins = new Set((process.env.CORS_ALLOWED_ORIGINS || "").split(",").map(v => v.trim()).filter(Boolean));

function send(res, status, payload, origin) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...(origin && allowedOrigins.has(origin) ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin" } : {})
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const origin = req.headers.origin;
  if (req.method === "GET" && url.pathname === "/health") {
    return send(res, 200, { status: "ok", service: "rtpsc-api", timestamp: new Date().toISOString() }, origin);
  }
  if (url.pathname.startsWith("/v1/") && !req.headers.authorization?.startsWith("Bearer ")) {
    return send(res, 401, { error: "unauthorized" }, origin);
  }
  if (req.method === "GET" && url.pathname === "/v1/me") {
    return send(res, 501, { error: "identity_adapter_not_configured" }, origin);
  }
  return send(res, 404, { error: "not_found" }, origin);
});

server.listen(port, "0.0.0.0", () => console.log(`rtpsc-api listening on ${port}`));

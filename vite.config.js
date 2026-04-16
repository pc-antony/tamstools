import { defineConfig } from "vite";
import path from 'path';
import react from "@vitejs/plugin-react";

function tokenProxyPlugin() {
  return {
    name: "token-proxy",
    configureServer(server) {
      server.middlewares.use("/__token_proxy", async (req, res) => {
        const tokenUrl = req.headers["x-token-url"];
        if (!tokenUrl) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Missing X-Token-Url header" }));
          return;
        }

        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const body = Buffer.concat(chunks);

        const headers = {
          "Content-Type": req.headers["content-type"],
        };

        try {
          const response = await fetch(tokenUrl, {
            method: "POST",
            headers,
            body: body.length ? body : undefined,
          });
          const data = Buffer.from(await response.arrayBuffer());
          if (!response.ok) {
            console.error(`[token-proxy] ${response.status} from ${tokenUrl}:`, data.toString());
          }
          res.writeHead(response.status, { "Content-Type": response.headers.get("content-type") });
          res.end(data);
        } catch (err) {
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: err.message }));
        }
      });

      server.middlewares.use("/__api_proxy", async (req, res) => {
        const targetUrl = req.headers["x-target-url"];
        if (!targetUrl) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Missing X-Target-Url header" }));
          return;
        }

        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const body = Buffer.concat(chunks);

        const headers = {};
        if (req.headers["content-type"]) headers["Content-Type"] = req.headers["content-type"];
        if (req.headers["authorization"]) headers["Authorization"] = req.headers["authorization"];

        try {
          const response = await fetch(targetUrl, {
            method: req.method,
            headers,
            body: body.length ? body : undefined,
          });
          const data = Buffer.from(await response.arrayBuffer());
          console.log(`[api-proxy] ${req.method} ${targetUrl} → ${response.status} (${data.length} bytes)`);
          if (!response.ok) {
            console.error(`[api-proxy] Response body:`, data.toString().slice(0, 500));
          }
          const resHeaders = {};
          const skipHeaders = new Set(["content-encoding", "transfer-encoding", "content-length", "connection"]);
          for (const [key, value] of response.headers) {
            if (!skipHeaders.has(key)) resHeaders[key] = value;
          }
          resHeaders["content-length"] = data.length;
          res.writeHead(response.status, resHeaders);
          res.end(data);
        } catch (err) {
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}

export default defineConfig({
  base: '/tamstool/',
  plugins: [react(), tokenProxyPlugin()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
  },
});

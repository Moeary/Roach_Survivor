import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../dist/", import.meta.url)));
const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 8080);

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".mp3", "audio/mpeg"],
  [".ogg", "audio/ogg"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".wasm", "application/wasm"],
  [".webp", "image/webp"],
]);

function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl || "/", `http://${host}:${port}`);
  const decodedPathname = decodeURIComponent(url.pathname);
  const safePathname = normalize(decodedPathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = resolve(join(root, safePathname));

  if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
    return join(root, "index.html");
  }

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    return filePath;
  }

  return join(root, "index.html");
}

createServer((request, response) => {
  const filePath = resolveRequestPath(request.url);
  const extension = extname(filePath);
  const contentType = contentTypes.get(extension) || "application/octet-stream";

  response.setHeader("Content-Type", contentType);
  response.setHeader("Cache-Control", extension === ".html" ? "no-cache" : "public, max-age=31536000, immutable");

  createReadStream(filePath)
    .on("error", () => {
      response.writeHead(404);
      response.end("Not found");
    })
    .pipe(response);
}).listen(port, host, () => {
  console.log(`Roach Survival is serving ${root} at http://${host}:${port}`);
});

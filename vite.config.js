import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
var version = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")).version;
export default defineConfig({
    base: "./",
    define: {
        __APP_VERSION__: JSON.stringify(version),
    },
    plugins: [react(), cloudflare()],
});

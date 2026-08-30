import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// Injects a strict Content-Security-Policy <meta> into the PRODUCTION build only.
// In dev we skip it so Vite's HMR (inline scripts + websocket) keeps working.
// frame-ancestors / X-Frame-Options are ignored in a <meta> per spec, so they
// are also shipped as real HTTP headers via public/_headers (see SECURITY.md).
function cspPlugin(): Plugin {
  const csp = [
    "default-src 'self'",
    "script-src 'self'",
    // framer-motion sets inline element styles, so style attributes need this.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
  ].join("; ");
  return {
    name: "html-csp",
    transformIndexHtml(html, ctx) {
      if (ctx.server) return html; // dev: keep HMR working
      return html.replace(
        "</head>",
        `  <meta http-equiv="Content-Security-Policy" content="${csp}" />\n  </head>`,
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), cspPlugin()],
  base: "./",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5175,
    strictPort: false,
  },
});

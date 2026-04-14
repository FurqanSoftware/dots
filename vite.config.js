import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
    jsxInject: `import { h, Fragment } from 'preact'`,
  },
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
    },
  },
  server: {
    proxy: {
      "/": {
        target: "http://localhost:3000",
        bypass(req) {
          if (req.method !== "POST") return req.url;
        },
      },
    },
  },
  build: {
    outDir: "dist",
  },
});

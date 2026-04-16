import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
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
    plugins: [
      {
        name: "inject-mapbox-token",
        transformIndexHtml(html) {
          return html.replace("__MAPBOX_TOKEN__", env.MAPBOX_TOKEN || "");
        },
      },
    ],
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
  };
});

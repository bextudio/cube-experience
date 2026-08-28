import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const catalogDirectory = path.resolve("public/assets/catalogs");

function catalogManifest() {
  const virtualId = "virtual:catalogs";
  const resolvedId = `\0${virtualId}`;
  const readCatalogs = () => {
    if (!existsSync(catalogDirectory)) return [];
    return readdirSync(catalogDirectory, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".pdf"))
      .map((entry) => {
        const basename = entry.name.replace(/\.pdf$/i, "");
        const coverFile = `${basename}.png`;
        const pageSlug = basename.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const pageDirectory = path.join(catalogDirectory, "pages", pageSlug);
        const pageCount = existsSync(pageDirectory)
          ? readdirSync(pageDirectory).filter((file) => /^\d+\.jpg$/i.test(file)).length
          : 0;
        return {
          id: pageSlug,
          title: basename.replace(/[-_]+/g, " "),
          url: `/assets/catalogs/${encodeURIComponent(entry.name)}`,
          pagesBase: pageCount ? `/assets/catalogs/pages/${pageSlug}` : null,
          pageCount,
          cover: existsSync(path.join(catalogDirectory, "covers", coverFile))
            ? `/assets/catalogs/covers/${encodeURIComponent(coverFile)}`
            : null,
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title, "en"));
  };

  return {
    name: "bextudio-catalog-manifest",
    resolveId(id) {
      if (id === virtualId) return resolvedId;
    },
    load(id) {
      if (id === resolvedId) return `export default ${JSON.stringify(readCatalogs())}`;
    },
    configureServer(server) {
      server.watcher.add(catalogDirectory);
      server.watcher.on("all", (_event, file) => {
        if (!path.resolve(file).startsWith(catalogDirectory)) return;
        const module = server.moduleGraph.getModuleById(resolvedId);
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: "full-reload" });
      });
    },
  };
}

export default defineConfig({
  build: {
    outDir: "dist/client",
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [catalogManifest(), react()],
});

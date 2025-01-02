import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({

    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@store": path.resolve(__dirname, "./src/store/pinia-store.ts"),
            "@artefacts/components": path.resolve(__dirname, "../libraries/components/index.ts"),
            "@artefacts/core": path.resolve(__dirname, "../libraries/core/index.ts"),
            "@artefacts/ipld": path.resolve(__dirname, "../libraries/ipld/index.ts"),
            "@artefacts/organizing-tabs": path.resolve(__dirname, '../prototypes/organizing-tabs/index.ts'),
            "@artefacts/shifting-canvas": path.resolve(__dirname, "../prototypes/shifting-canvas/index.ts")
        },
    },
    plugins: [vue()],
    // css: {
    //     postcss: path.resolve(__dirname, "../../postcss.config.js") //TODO: check why this doesn't work
    // },
    //instead adding postcss config here:
    css: {
        postcss: {
          plugins: [
            require('tailwindcss')(path.resolve(__dirname, '../tailwind.config.js')),
            require('autoprefixer'),
          ],
        },
      },
    server: {
        port: 8081
    }
});

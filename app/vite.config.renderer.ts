import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    },
    plugins: [vue()],
    // css: {
    //     postcss: path.resolve(__dirname, "../../postcss.config.js") //TODO: check why this doesn't work
    // },
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

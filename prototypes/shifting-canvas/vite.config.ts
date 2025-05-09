import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
        dts({
            outDir: "dist",
            tsconfigPath: path.resolve(__dirname, "tsconfig.json"),
            insertTypesEntry: true
        })
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, "index.ts"),
            name: "shifting-canvas",
            formats: ["es"],
            fileName: (format) => `index.${format}.js`
        },
        rollupOptions: {
            external: ["vue"],
            output: {
                globals: {
                    vue: "Vue"
                }
            }
        }
    }
});

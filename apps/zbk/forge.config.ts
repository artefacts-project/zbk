import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { VitePlugin } from "@electron-forge/plugin-vite";
import * as path from "path";

const config: ForgeConfig = {
    packagerConfig: {
        icon: path.join(process.cwd(), "src/assets/icons", "app-icon.png")
    },
    rebuildConfig: {},
    makers: [
        new MakerSquirrel({}),
        new MakerZIP({}, ["darwin"]),
        new MakerRpm({}),
        new MakerDeb({
            options: {
                icon: path.join(process.cwd(), "src/assets/icons", "app-icon.png")
            }
        })
    ],
    plugins: [
        new VitePlugin({
            // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
            // If you are familiar with Vite configuration, it will look really familiar.
            build: [
                {
                    // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
                    entry: "src/electron/main.ts",
                    config: "vite.config.ts"
                },
                {
                    entry: "src/electron/preload.ts",
                    config: "vite.config.preload.ts"
                }
            ],
            renderer: [
                {
                    name: "main_window",
                    config: "vite.config.renderer.ts"
                }
            ]
        })
    ]
};

export default config;

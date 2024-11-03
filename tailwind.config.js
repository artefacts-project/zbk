/** @type {import('tailwindcss').Config} */
import daisy from "daisyui";
import path from "path";

export default {
    content: [
        "!./**/node_modules/**/*.*",
        "./app/index.html",
        "./app/entry.ts",
        "./app/App.vue",
        "./**/src/**/*.{vue,js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {}
    },
    daisyui: {
        themes: [
            "light",
            "dark",
            "cupcake",
            "bumblebee",
            "emerald",
            "corporate",
            "synthwave",
            "retro",
            "cyberpunk",
            "valentine",
            "halloween",
            "garden",
            "forest",
            "aqua",
            "lofi",
            "pastel",
            "fantasy",
            "wireframe",
            "black",
            "luxury",
            "dracula",
            "cmyk",
            "autumn",
            "business",
            "acid",
            "lemonade",
            "night",
            "coffee",
            "winter",
            "dim",
            "nord",
            "sunset"
        ]
    },
    plugins: [daisy]
};

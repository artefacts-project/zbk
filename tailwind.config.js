/** @type {import('tailwindcss').Config} */
import daisy from "daisyui";
import path from "path";

export default {
    content: [
        path.resolve(__dirname, "./app/index.html"),
        path.resolve(__dirname, "./app/entry.ts"),
        path.resolve(__dirname, "./app/App.vue"),
        path.resolve(__dirname, "./{app,libraries,prototypes}/**/src/**/*.{vue,js,ts,jsx,tsx}"),
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

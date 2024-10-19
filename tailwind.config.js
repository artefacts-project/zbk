/** @type {import('tailwindcss').Config} */
import daisy from "daisyui";
export default {
    content: ["./**/index.html", "./**/entry.ts", "./**/App.vue", "./**/src/**/*.{vue,js,ts,jsx,tsx}"],
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

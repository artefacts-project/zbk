/** @type {import('tailwindcss').Config} */
import path from "path";

export default {
  content: [
    path.resolve(__dirname, "./app/index.html"),
    path.resolve(__dirname, "./app/entry.ts"),
    path.resolve(__dirname, "./app/App.vue"),
    path.resolve(__dirname, "./{app,libraries,prototypes}/**/src/**/*.{vue,js,ts,jsx,tsx}")
  ],
  theme: {
    extend: {
      boxShadow: {
        outer: "0 0 0.1rem rgba(0, 0, 0, 0.2)",
        open: "-2px -2px 3px 0 rgb(0 0 0 / 0.1), -1px -1px 3px -1px rgb(0 0 0 / 0.1)"
      }
    }
  }
};

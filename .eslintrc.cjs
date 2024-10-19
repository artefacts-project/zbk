/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: [
        "@vue/eslint-config-prettier/skip-formatting",
        "@vue/eslint-config-typescript",
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/electron",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "plugin:vue/vue3-essential"
    ],
    parserOptions: {
        ecmaVersion: "@typescript-eslint/parser"
    },
    plugins: ["import"],
    rules: {
        "import/no-unresolved": "error"
    },
    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"]
        },
        "import/resolver": {
            typescript: {
                project: ["tsconfig.app.json", "tsconfig.node.json", "tsconfig.vitest.json"]
            },
            node: {
                paths: ["src"],
                extensions: [".js", ".ts", ".d.ts", ".tsx"]
            }
        }
    }
};

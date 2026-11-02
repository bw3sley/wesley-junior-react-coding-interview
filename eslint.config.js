import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist", "build", "coverage", "node_modules"],
  },
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}", "*.ts"],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
);

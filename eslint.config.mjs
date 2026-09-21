import react from "eslint-plugin-react-hooks";
import storybook from "eslint-plugin-storybook";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsparser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "react-hooks": react,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
    },
  },
  globalIgnores([
    "dist/**",
    "storybook-static/**",
    "node_modules/**",
  ]),
  ...storybook.configs["flat/recommended"],
]);

export default eslintConfig;

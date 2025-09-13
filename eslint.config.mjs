import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js, tseslint }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  tseslint.configs.strict,
  pluginReact.configs.flat.recommended,
  globalIgnores(["*/utils/*"])
]);

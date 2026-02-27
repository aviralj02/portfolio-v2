import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const eslintConfig = [
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "src/types/**/*",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "react-hooks/set-state-in-effect": "warn",
      "no-unused-vars": "off",
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            // react & next.js
            ["^react", "^next"],
            // external packages
            ["^@?\\w"],
            // internal absolute imports (@/)
            ["^@"],
            // relative imports
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            // styles
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "@typescript-eslint/no-unused-vars": "error",
      "react-hooks/set-state-in-effect": "warn",
      "no-unused-vars": "off",
    },
  },
  {
    files: ["src/lib/utils.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-console": "off",
    },
    ignores: [".next/**/*", "node_modules/**/*", "dist/**/*"],
  },
];

export default eslintConfig;

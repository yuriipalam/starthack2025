import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";

/** @type {import("eslint").FlatConfig[]} */
export default [
  // Global Settings
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly"
      },
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      prettier
    },
    settings: {
      react: { version: "detect" }
    },
    rules: {
      "no-implicit-globals": "off",
      "prettier/prettier": "warn"
    }
  },

  // TypeScript Rules
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json"
      }
    },
    plugins: {
      "@typescript-eslint": ts
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off"
    }
  },

  // React Rules
  {
    files: ["**/*.jsx", "**/*.tsx"],
    plugins: {
      react,
      "jsx-a11y": jsxA11y
    },
    settings: {
      react: { version: "detect" },
      formComponents: ["Form"],
      linkComponents: [
        { name: "Link", linkAttribute: "to" },
        { name: "NavLink", linkAttribute: "to" }
      ]
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off"
    }
  },

  // Import Rules
  {
    plugins: {
      import: importPlugin
    },
    settings: {
      "import/resolver": {
        typescript: { alwaysTryTypes: true },
        node: { extensions: [".ts", ".tsx"] }
      },
      "import/internal-regex": "^~/"
    }
  },

  // Ignore Patterns
  {
    ignores: [
      "node_modules",
      "build",
      "dist",
      "tsconfig.json",
      "postcss.config.js",
      "tailwind.config.ts",
      "prettier.config.js",
      "!**/.server",
      "!**/.client"
    ]
  }
];

import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-mcp"
  ],
  "framework": "@storybook/nextjs-vite",
  "features": {
    "componentsManifest": true
  },
  "staticDirs": [
    "../public"
  ]
};
export default config;
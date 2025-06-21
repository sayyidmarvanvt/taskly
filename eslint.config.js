const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

// Import plugins as objects for flat config
const reactNativePlugin = require("eslint-plugin-react-native");

module.exports = defineConfig(
  [
    expoConfig,
    // eslintPluginPrettierRecommended,
    {
      plugins: {
        "react-native": reactNativePlugin,
      },
      rules: {
        "react-native/no-unused-styles": "error",
      },
    },
  ],
  {
    ignores: ["dist/*"],
  },
);

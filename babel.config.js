module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    env: {
      production: {
        plugins: [
          "react-native-paper/babel",
          [
            "module:react-native-dotenv",
            {
              moduleName: "@env",
              path: ".env",
              blocklist: null,
              allowlist: [
                "MAPS_API_KEY",
                "BASE_URL",
              ],
              blacklist: null,
              whitelist: null,
              safe: true,
              allowUndefined: false,
              verbose: false,
            },
          ],
        ],
      },
    },
  };
};

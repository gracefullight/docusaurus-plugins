export default {
  "*": [
    "biome check --fix --no-errors-on-unmatched --files-ignore-unknown=true",
  ],
  "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}": [
    "biome check --fix --unsafe --no-errors-on-unmatched",
  ],
};

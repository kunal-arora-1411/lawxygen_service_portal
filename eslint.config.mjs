import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * eslint-config-next 16 exports flat config arrays directly. Routing them through
 * FlatCompat — the pattern most guides still show — crashes with a circular-structure
 * error while validating the legacy schema.
 */
const config = [
  { ignores: [".next/**", "node_modules/**", "out/**", "docs/**"] },
  ...coreWebVitals,
  ...nextTypescript,
];

export default config;

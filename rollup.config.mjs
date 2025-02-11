// rollup.config.mjs
import terser from "@rollup/plugin-terser";

export default {
  input: "index.js",
  output: [
    {
      file: "dist/mgraph.random.js",
      format: "umd",
      name: "mgraphRandom"
    },
    {
      file: "dist/mgraph.random.min.js",
      format: "umd",
      name: "mgraphRandom",
      plugins: [terser()]
    }
  ]
};

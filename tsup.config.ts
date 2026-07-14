import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  minify: false,
  publicDir: "src/assets",
  outExtension({ format }) {
    return { js: format === "cjs" ? ".cjs" : ".js" };
  },
  async onSuccess() {
    const { readFileSync, writeFileSync } = await import("node:fs");
    const directive = '"use client";\n';
    for (const file of ["dist/index.js", "dist/index.cjs"]) {
      const content = readFileSync(file, "utf8");
      if (!content.startsWith(directive)) {
        writeFileSync(file, directive + content);
      }
    }
  },
});

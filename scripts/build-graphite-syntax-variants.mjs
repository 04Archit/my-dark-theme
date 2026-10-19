
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const themesDir = join(root, "themes");

const graphite = JSON.parse(
  readFileSync(
    join(themesDir, "DARK-graphite-color-theme.json"),
    "utf8"
  )
);

const variants = [
  {
    name: "Minimal Color Dark (Graphite, Classic Syntax)",
    include: "./DARK-classic-color-theme.json",
    filename: "DARK-graphite-classic-color-theme.json",
  },
  {
    name: "Minimal Color Dark (Graphite, 2026 Syntax)",
    include: "./DARK-2026-color-theme.json",
    filename: "DARK-graphite-2026-color-theme.json",
  },
];

for (const variant of variants) {
  const theme = {
    $schema: "vscode://schemas/color-theme",
    name: variant.name,
    include: variant.include,
    colors: graphite.colors,
  };

  writeFileSync(
    join(themesDir, variant.filename),
    JSON.stringify(theme, null, 2) + "\n"
  );

  console.log(`Generated ${variant.filename}`);
}

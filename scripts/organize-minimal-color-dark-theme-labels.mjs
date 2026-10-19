import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Run from the extension root: node scripts/organize-theme-labels.mjs
// Changes only package.json. Existing themes' saved settings IDs stay stable.
const root = process.cwd();
const manifestPath = join(root, 'package.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const registered = manifest.contributes?.themes;

if (!Array.isArray(registered)) {
  throw new Error('Missing contributes.themes in package.json');
}

const families = [
  ['Near-Black', 'DARK-color-theme.json', 'DARK-classic-color-theme.json', 'DARK-2026-color-theme.json'],
  ['Graphite', 'DARK-graphite-color-theme.json', 'DARK-graphite-classic-color-theme.json', 'DARK-graphite-2026-color-theme.json'],
  ['Soft Charcoal', 'DARK-charcoal-color-theme.json', 'DARK-charcoal-classic-color-theme.json', 'DARK-charcoal-2026-color-theme.json'],
  ['OLED Black', 'DARK-oled-color-theme.json', 'DARK-oled-classic-color-theme.json', 'DARK-oled-2026-color-theme.json'],
  ['Warm Graphite', 'DARK-warm-graphite-color-theme.json', 'DARK-warm-graphite-classic-color-theme.json', 'DARK-warm-graphite-2026-color-theme.json'],
];
const syntaxes = ['Muted', 'Classic', '2026'];
const paths = new Set();
const byPath = new Map();
for (const theme of registered) {
  if (typeof theme.path !== 'string' || byPath.has(theme.path)) {
    throw new Error(`Invalid or duplicate theme path: ${theme.path}`);
  }
  byPath.set(theme.path, theme);
}

const ordered = [];
for (const [family, ...files] of families) {
  files.forEach((filename, i) => {
    const path = `./themes/${filename}`;
    const theme = byPath.get(path);
    if (!theme || !existsSync(join(root, 'themes', filename))) {
      throw new Error(`Theme registration or file missing: ${path}`);
    }
    if (paths.has(path)) throw new Error(`Duplicate requested path: ${path}`);
    paths.add(path);
    // On previously published themes, the old label was the saved
    // workbench.colorTheme setting. Keep that ID even though the label changes.
    theme.id ??= theme.label;
    theme.label = `Minimal Color Dark — ${family} · ${syntaxes[i]}`;
    ordered.push(theme);
  });
}

if (registered.length !== 15 || paths.size !== 15) {
  throw new Error(`Expected exactly 15 theme registrations; found ${registered.length}`);
}
if (new Set(ordered.map(theme => theme.id)).size !== 15) {
  throw new Error('Theme settings IDs are not unique. package.json unchanged.');
}

manifest.contributes.themes = ordered;
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log('Organized 15 theme labels into 5 workbench groups.');
console.log('No theme JSON files or version numbers were changed.');
for (const theme of ordered) console.log(`- ${theme.label}`);

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Run from the extension root: node scripts/build-remaining-workbench-variants.mjs
// Existing themes remain untouched. This script creates/updates only the nine
// new theme files and their package.json registrations.
const root = process.cwd();
const themeDir = join(root, 'themes');
const packagePath = join(root, 'package.json');
const graphitePath = join(themeDir, 'DARK-graphite-color-theme.json');

if (!existsSync(graphitePath)) {
  throw new Error('Graphite theme missing. Run this from the dark-theme project root.');
}

const graphite = JSON.parse(readFileSync(graphitePath, 'utf8'));
const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
if (!graphite.colors || !pkg.contributes?.themes) {
  throw new Error('Expected Graphite colors and contributes.themes in package.json.');
}

const syntaxOptions = [
  { label: '', suffix: '', parent: 'DARK-color-theme.json' },
  { label: ', Classic Syntax', suffix: '-classic', parent: 'DARK-classic-color-theme.json' },
  { label: ', 2026 Syntax', suffix: '-2026', parent: 'DARK-2026-color-theme.json' },
];

// Each entry maps an existing Graphite surface color to a replacement color.
// Thus every new workbench overrides exactly the same set of VS Code color keys
// as the tested Graphite theme, without duplicating syntax-highlighting rules.
const workbenches = [
  {
    label: 'Soft Charcoal',
    slug: 'charcoal',
    colors: {
      '#141414': '#1B1B1B', // editor, active tab, terminal
      '#101010': '#151515', // sidebar, bars, panel
      '#171717': '#1E1E1E', // section headers
      '#242424': '#2E2E2E', // hover surfaces
      '#2D2D2D': '#383838', // primary borders
      '#292929': '#333333', // active selections
      '#1C1C1C': '#252525', // tab hover
      '#383838': '#404040', // text selection, active tab border
      '#1A1A1A': '#242424', // popup surfaces
      '#303030': '#383838', // input/widget borders
      '#1B1B1B': '#242424', // inputs and buttons
      '#181818': '#202020', // menu
      '#30303080': '#3A3A3A80', // inactive text selection (alpha)
    },
  },
  {
    label: 'OLED Black',
    slug: 'oled',
    colors: {
      '#141414': '#000000',
      '#101010': '#000000',
      '#171717': '#070707',
      '#242424': '#111111',
      '#2D2D2D': '#1F1F1F',
      '#292929': '#141414',
      '#1C1C1C': '#0C0C0C',
      '#383838': '#242424',
      '#1A1A1A': '#0B0B0B',
      '#303030': '#242424',
      '#1B1B1B': '#0D0D0D',
      '#181818': '#080808',
      '#30303080': '#20202080',
    },
  },
  {
    label: 'Warm Graphite',
    slug: 'warm-graphite',
    colors: {
      '#141414': '#15120F',
      '#101010': '#100E0C',
      '#171717': '#1B1713',
      '#242424': '#2B251F',
      '#2D2D2D': '#39312A',
      '#292929': '#302922',
      '#1C1C1C': '#211C17',
      '#383838': '#43382E',
      '#1A1A1A': '#201B17',
      '#303030': '#3A332B',
      '#1B1B1B': '#231E19',
      '#181818': '#1C1713',
      '#30303080': '#3A332B80',
    },
  },
];

// Preflight validation: reject unexpected Graphite colors rather than silently
// mixing graphite-gray surfaces into a new workbench.
const referenceColors = [...new Set(Object.values(graphite.colors))];
for (const workbench of workbenches) {
  const missing = referenceColors.filter(color => !(color in workbench.colors));
  if (missing.length) {
    throw new Error(`Missing ${workbench.label} mappings: ${missing.join(', ')}`);
  }
}
for (const syntax of syntaxOptions) {
  if (!existsSync(join(themeDir, syntax.parent))) {
    throw new Error(`Missing syntax parent: ${syntax.parent}`);
  }
}

let added = 0;
for (const workbench of workbenches) {
  const colors = Object.fromEntries(
    Object.entries(graphite.colors).map(([key, value]) => [key, workbench.colors[value]])
  );

  for (const syntax of syntaxOptions) {
    const label = `Minimal Color Dark (${workbench.label}${syntax.label})`;
    const filename = `DARK-${workbench.slug}${syntax.suffix}-color-theme.json`;
    const themePath = `./themes/${filename}`;

    const theme = {
      $schema: 'vscode://schemas/color-theme',
      name: label,
      include: `./${syntax.parent}`,
      colors,
    };
    writeFileSync(join(themeDir, filename), JSON.stringify(theme, null, 2) + '\n');

    if (!pkg.contributes.themes.some(entry => entry.path === themePath)) {
      pkg.contributes.themes.push({ label, uiTheme: 'vs-dark', path: themePath });
      added++;
    }
    console.log(`Ready: ${label}`);
  }
}

writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`\n9 theme files generated. ${added} registration(s) added.`);
console.log(`Total registered themes: ${pkg.contributes.themes.length}`);
console.log(`Version unchanged: ${pkg.version}`);

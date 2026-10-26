import { readFileSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { parse, printParseErrorCode } from 'jsonc-parser';

// Run from your extension root: node scripts/build-dark-modern-2024.mjs
// Replaces the Classic *syntax only* in all 5 workbenches with the
// source definitions inherited by VS Code Dark Modern in December 2024.
// It preserves all workbench color maps, theme file paths, saved IDs and version.
const root = process.cwd();
const themesDir = join(root, 'themes');
const vscodeVersion = '1.96.2'; // released December 2024
const upstream = `https://raw.githubusercontent.com/microsoft/vscode/${vscodeVersion}/extensions/theme-defaults/themes`;

const baseFile = 'DARK-classic-color-theme.json'; // retained for compatibility
const modernVariants = [
  [baseFile, 'Near-Black'],
  ['DARK-graphite-classic-color-theme.json', 'Graphite'],
  ['DARK-charcoal-classic-color-theme.json', 'Soft Charcoal'],
  ['DARK-oled-classic-color-theme.json', 'OLED Black'],
  ['DARK-warm-graphite-classic-color-theme.json', 'Warm Graphite'],
];

function readJSONC(text, label) {
  const errors = [];
  const parsed = parse(text, errors, { allowTrailingComma: true });
  if (errors.length || !parsed || typeof parsed !== 'object') {
    throw new Error(`Invalid JSONC in ${label}: ${errors.map(e => printParseErrorCode(e.error)).join(', ')}`);
  }
  return parsed;
}

async function fetchTheme(filename) {
  const url = `${upstream}/${filename}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return readJSONC(await response.text(), filename);
}

function themeLabel(workbench) {
  return `Minimal Color Dark — ${workbench} · Dark Modern`;
}

async function main() {
  const manifestPath = join(root, 'package.json');
  const noticePath = join(root, 'THIRD_PARTY_NOTICES.md');
  const basePath = join(themesDir, baseFile);
  const originalPath = join(themesDir, 'DARK-color-theme.json');

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const notices = readFileSync(noticePath, 'utf8');
  const original = readJSONC(readFileSync(originalPath, 'utf8'), originalPath);
  if (!original.colors || typeof original.colors !== 'object') {
    throw new Error('Original theme is missing the colors object.');
  }
  if (!Array.isArray(manifest.contributes?.themes) || manifest.contributes.themes.length !== 15) {
    throw new Error('Expected exactly 15 theme registrations in package.json.');
  }

  // Validate the 5 existing theme registrations before changing any files.
  const updates = [];
  for (const [filename, workbench] of modernVariants) {
    const filePath = join(themesDir, filename);
    const theme = readJSONC(readFileSync(filePath, 'utf8'), filename);
    const registration = manifest.contributes.themes.find(t => basename(t.path || '') === filename);
    if (!registration || typeof registration.id !== 'string') {
      throw new Error(`Registration or stable saved ID missing for ${filename}`);
    }
    if (filename !== baseFile && theme.include !== `./${baseFile}`) {
      throw new Error(`${filename} must inherit ./${baseFile}.`);
    }
    if (!theme.colors || typeof theme.colors !== 'object') {
      throw new Error(`Workbench color map missing in ${filename}.`);
    }
    updates.push({ filename, workbench, filePath, theme, registration });
  }

  const oldNoticeStart = notices.indexOf('The classic syntax-highlighting rules in ');
  const oldNoticeEnd = notices.indexOf('The source is licensed under the MIT License:', oldNoticeStart);
  if (oldNoticeStart < 0 || oldNoticeEnd < 0) {
    throw new Error('Expected Classic attribution not found. THIRD_PARTY_NOTICES.md unchanged.');
  }

  // Match the real VS Code 1.96.2 include chain:
  // dark_modern -> dark_plus -> dark_vs.
  const [darkVs, darkPlus, darkModern] = await Promise.all([
    fetchTheme('dark_vs.json'),
    fetchTheme('dark_plus.json'),
    fetchTheme('dark_modern.json'),
  ]);
  if (darkModern.include !== './dark_plus.json' ||
      darkPlus.include !== './dark_vs.json' ||
      !Array.isArray(darkVs.tokenColors) ||
      !Array.isArray(darkPlus.tokenColors) ||
      darkModern.tokenColors || darkModern.semanticTokenColors) {
    throw new Error('Unexpected Microsoft theme structure; no files changed.');
  }

  // Use ONLY inherited syntax. Never import Microsoft's workbench colors.
  const replacement = {
    $schema: 'vscode://schemas/color-theme',
    name: themeLabel('Near-Black'),
    semanticHighlighting: darkVs.semanticHighlighting ?? true,
    colors: updates[0].theme.colors,
    tokenColors: [...darkVs.tokenColors, ...darkPlus.tokenColors],
    semanticTokenColors: {
      ...(darkVs.semanticTokenColors || {}),
      ...(darkPlus.semanticTokenColors || {}),
    },
  };
  if (JSON.stringify(replacement.colors) !== JSON.stringify(original.colors)) {
    throw new Error('Original and base workbench colors differ; refusing to overwrite.');
  }

  const noticeIntro = [
    'The Dark Modern (December 2024) syntax-highlighting rules in',
    '`themes/DARK-classic-color-theme.json` are derived from Microsoft Visual',
    `Studio Code ${vscodeVersion}:`,
    '- `extensions/theme-defaults/themes/dark_vs.json`',
    '- `extensions/theme-defaults/themes/dark_plus.json`',
    '- `extensions/theme-defaults/themes/dark_modern.json` (the parent theme selection)',
    '',
    'The `dark_modern.json` file adds workbench colors but no new syntax rules.',
    'This extension deliberately keeps its own workbench colors.',
    '',
  ].join('\n');
  const newNotices = notices.slice(0, oldNoticeStart) + noticeIntro + notices.slice(oldNoticeEnd);

  // All checks have passed: write only the intended files.
  writeFileSync(basePath, JSON.stringify(replacement, null, 2) + '\n');
  for (const update of updates.slice(1)) {
    update.theme.name = themeLabel(update.workbench);
    writeFileSync(update.filePath, JSON.stringify(update.theme, null, 2) + '\n');
  }
  for (const update of updates) update.registration.label = themeLabel(update.workbench);
  manifest.description = '15 minimal dark VS Code themes: 5 workbench styles with Custom Muted, Dark Modern (2024), and softened 2026 syntax palettes.';
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  writeFileSync(noticePath, newNotices);

  console.log(`Updated 5 themes to December 2024 Dark Modern syntax (VS Code ${vscodeVersion}).`);
  console.log(`Imported ${replacement.tokenColors.length} TextMate rules and ${Object.keys(replacement.semanticTokenColors).length} semantic overrides.`);
  console.log('Preserved all workbench color maps, theme paths, saved IDs, 10 other themes and extension version.');
  console.log('Note: Dark Modern inherits Dark+ syntax; visual syntax differences may be subtle.');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

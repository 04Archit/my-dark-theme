import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse, printParseErrorCode } from 'jsonc-parser';

// Run this from the root folder of the Minimal Color Dark extension.
const themeDirectory = join(process.cwd(), 'themes');
const originalPath = join(themeDirectory, 'DARK-color-theme.json');
const outputPath = join(themeDirectory, 'DARK-classic-color-theme.json');

// Pin to a published VS Code release so rerunning this script is reproducible.
const vscodeVersion = '1.125.0';
const upstream = `https://raw.githubusercontent.com/microsoft/vscode/${vscodeVersion}`;
const upstreamThemes = `${upstream}/extensions/theme-defaults/themes`;

function parseTheme(text, name) {
  const errors = [];
  const result = parse(text, errors, { allowTrailingComma: true });
  if (errors.length > 0 || !result || typeof result !== 'object') {
    const detail = errors.map((e) => printParseErrorCode(e.error)).join(', ');
    throw new Error(`Could not parse ${name}: ${detail || 'invalid theme'}`);
  }
  return result;
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: HTTP ${response.status}`);
  }
  return response.text();
}

async function main() {
  const original = parseTheme(readFileSync(originalPath, 'utf8'), originalPath);
  if (!original.colors || typeof original.colors !== 'object') {
    throw new Error('The original theme does not contain a colors object.');
  }

  const [vsText, plusText, licenseText] = await Promise.all([
    fetchText(`${upstreamThemes}/dark_vs.json`),
    fetchText(`${upstreamThemes}/dark_plus.json`),
    fetchText(`${upstream}/LICENSE.txt`),
  ]);
  const darkVs = parseTheme(vsText, 'dark_vs.json');
  const darkPlus = parseTheme(plusText, 'dark_plus.json');
  if (!Array.isArray(darkVs.tokenColors) || !Array.isArray(darkPlus.tokenColors)) {
    throw new Error('Microsoft theme tokenColors are missing or not arrays.');
  }

  const result = {
    $schema: 'vscode://schemas/color-theme',
    name: 'Minimal Color Dark (Classic Syntax)',
    semanticHighlighting: darkVs.semanticHighlighting ?? true,
    colors: original.colors,
    // VS Code normally loads the included parent rules first, then child rules.
    tokenColors: [...darkVs.tokenColors, ...darkPlus.tokenColors],
    semanticTokenColors: {
      ...darkVs.semanticTokenColors,
      ...darkPlus.semanticTokenColors,
    },
  };

  mkdirSync(themeDirectory, { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);

  const notice = [
    '# Third-party notices',
    '',
    'The classic syntax-highlighting rules in `themes/DARK-classic-color-theme.json`',
    `were adapted from Microsoft Visual Studio Code version ${vscodeVersion}:`,
    '- `extensions/theme-defaults/themes/dark_vs.json`',
    '- `extensions/theme-defaults/themes/dark_plus.json`',
    '',
    'The source is licensed under the MIT License:',
    '',
    licenseText.trimEnd(),
    '',
  ].join('\n');
  writeFileSync(join(process.cwd(), 'THIRD_PARTY_NOTICES.md'), notice);

  console.log('Created:', outputPath);
  console.log('Created: THIRD_PARTY_NOTICES.md');
  console.log('Preserved:', Object.keys(result.colors).length, 'workbench color entries');
  console.log('Imported:', result.tokenColors.length, 'Microsoft TextMate syntax rules');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

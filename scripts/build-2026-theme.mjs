import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse, printParseErrorCode } from 'jsonc-parser';

// Run from the root of the Minimal Color Dark extension (the folder containing package.json).
// Pin the upstream definitions to a real stable VS Code release for reproducible builds.
const vscodeVersion = '1.141.1';
const root = process.cwd();
const originalPath = join(root, 'themes', 'DARK-color-theme.json');
const outputPath = join(root, 'themes', 'DARK-2026-color-theme.json');
const noticePath = join(root, 'THIRD_PARTY_NOTICES.md');
const sourceDir = `https://raw.githubusercontent.com/microsoft/vscode/${vscodeVersion}/extensions/theme-defaults/themes`;
const sourceNames = [
  'dark_vs.json',
  'dark_plus.json',
  'dark_modern.json',
  '2026-dark.json',
];

// Keep the original hue and lightness but reduce the saturation by 18%.
// 1.00 = official VS Code 2026 colors, 0.82 = gently muted, 0.70 = more muted.
const SATURATION_FACTOR = 0.82;

function muteHexColor(color) {
  if (typeof color !== 'string' || !/^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(color)) {
    return color;
  }

  const channels = [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16));
  const neutral = (Math.max(...channels) + Math.min(...channels)) / 2;
  const muted = channels.map(value => {
    const adjusted = Math.round(neutral + (value - neutral) * SATURATION_FACTOR);
    return Math.max(0, Math.min(255, adjusted)).toString(16).padStart(2, '0');
  });
  // Preserve any existing alpha channel.
  return `#${muted.join('')}${color.length === 9 ? color.slice(7) : ''}`.toUpperCase();
}

function muteTokenRule(rule) {
  if (!rule?.settings || typeof rule.settings.foreground !== 'string') return rule;
  return {
    ...rule,
    settings: { ...rule.settings, foreground: muteHexColor(rule.settings.foreground) },
  };
}

function muteSemanticStyle(style) {
  if (typeof style === 'string') return muteHexColor(style);
  if (style && typeof style === 'object' && typeof style.foreground === 'string') {
    return { ...style, foreground: muteHexColor(style.foreground) };
  }
  return style;
}


function parseJsonc(source, filename) {
  const errors = [];
  const parsed = parse(source, errors, { allowTrailingComma: true });
  if (errors.length || !parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    const messages = errors.map(e => printParseErrorCode(e.error)).join(', ');
    throw new Error(`Invalid theme JSON in ${filename}: ${messages || 'expected an object'}`);
  }
  return parsed;
}

async function download(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Cannot retrieve ${url}: HTTP ${response.status}`);
  }
  return response.text();
}

async function main() {
  if (!existsSync(join(root, 'package.json')) || !existsSync(originalPath)) {
    throw new Error('Run this from the dark-theme extension root (containing package.json and themes/DARK-color-theme.json).');
  }

  const original = parseJsonc(readFileSync(originalPath, 'utf8'), originalPath);
  if (!original.colors || typeof original.colors !== 'object' || Array.isArray(original.colors)) {
    throw new Error('Existing theme does not contain a valid workbench colors object.');
  }

  // Inheritance: 2026 Dark -> Dark Modern -> Dark+ -> Dark (Visual Studio).
  // Flatten in parent-first order so later token rules take precedence.
  const sources = await Promise.all(sourceNames.map(async name =>
    parseJsonc(await download(`${sourceDir}/${name}`), name)
  ));
  for (let i = 1; i < sources.length; i++) {
    const expected = `./${sourceNames[i - 1]}`;
    if (sources[i].include !== expected) {
      throw new Error(`${sourceNames[i]} now inherits ${sources[i].include ?? 'nothing'}, expected ${expected}. Review upstream changes before generating.`);
    }
  }

  const tokenColors = sources.flatMap(source => source.tokenColors ?? []);
  if (tokenColors.length === 0 || !Array.isArray(sources[3].tokenColors)) {
    throw new Error('Expected TextMate rules were not found in the official 2026 Dark theme.');
  }
  for (const [index, source] of sources.entries()) {
    if (source.tokenColors !== undefined && !Array.isArray(source.tokenColors)) {
      throw new Error(`Unexpected tokenColors format in ${sourceNames[index]}`);
    }
  }

  const semanticTokenColors = Object.assign({}, ...sources.map(source => source.semanticTokenColors ?? {}));
  const semanticHighlighting = [...sources].reverse()
    .find(source => typeof source.semanticHighlighting === 'boolean')?.semanticHighlighting ?? true;

  // Workbench colors are never adjusted; only syntax foregrounds.
  const mutedTokenColors = tokenColors.map(muteTokenRule);
  const mutedSemanticTokenColors = Object.fromEntries(
    Object.entries(semanticTokenColors).map(([token, style]) => [token, muteSemanticStyle(style)])
  );

  const result = {
    $schema: 'vscode://schemas/color-theme',
    name: 'Minimal Color Dark (2026 Syntax)',
    semanticHighlighting,
    colors: original.colors,
    tokenColors: mutedTokenColors,
    semanticTokenColors: mutedSemanticTokenColors,
  };

  // The original and Classic Syntax theme files are never modified.
  // The Microsoft notice is appended once, preserving the existing Classic Syntax attribution.
  let notices = existsSync(noticePath) ? readFileSync(noticePath, 'utf8') : '';
  const marker = '## 2026 Dark syntax attribution';
  if (!notices.includes(marker)) {
    if (!notices.trim()) {
      const licenseText = await download(`https://raw.githubusercontent.com/microsoft/vscode/${vscodeVersion}/LICENSE.txt`);
      notices = `# Third-party notices\n\nMicrosoft Visual Studio Code is licensed under the MIT License:\n\n${licenseText.trimEnd()}\n`;
    }
    notices = notices.trimEnd() + `\n\n${marker}\n\n` +
      `The syntax highlighting in \`themes/DARK-2026-color-theme.json\` is derived from\n` +
      `Microsoft Visual Studio Code ${vscodeVersion} (MIT License):\n\n` +
      sourceNames.map(name => `- \`extensions/theme-defaults/themes/${name}\``).join('\n') + '\n';
  }

  writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n');
  writeFileSync(noticePath, notices);

  console.log('Created:', outputPath);
  console.log('Updated: THIRD_PARTY_NOTICES.md (preserving existing attribution)');
  console.log('Preserved:', Object.keys(result.colors).length, 'workbench color entries');
  console.log('Adjusted syntax saturation to:', `${Math.round(SATURATION_FACTOR * 100)}% of the official palette`);
  console.log('Imported:', tokenColors.length, 'TextMate rules from VS Code', vscodeVersion);
  console.log('Imported:', Object.keys(semanticTokenColors).length, 'explicit semantic token rules');
  console.log('Left unchanged: DARK-color-theme.json and DARK-classic-color-theme.json');
}

main().catch(error => {
  console.error(error.message || error);
  process.exitCode = 1;
});

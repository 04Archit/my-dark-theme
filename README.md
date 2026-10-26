# Minimal Color Dark

**Five workbench styles. Three syntax palettes. Fifteen dark themes for Visual Studio Code.**

Minimal Color Dark is a collection of understated VS Code color themes built around neutral workbench surfaces and a choice of syntax-highlighting styles. Choose the background that suits your workspace, then pair it with **Muted**, **Dark Modern (2024)**, or **2026** syntax colors.

## Choose a Workbench

Each workbench changes the appearance of the editor and surrounding UI while keeping the selected syntax palette consistent.

| Workbench | Editor background | Sidebar / bars | Character |
| --- | --- | --- | --- |
| **Near-Black** | `#0A0A0A` | `#080808` | The original minimal, nearly black design |
| **Graphite** | `#141414` | `#101010` | Softer neutral greys with clearer surface separation |
| **Soft Charcoal** | `#1B1B1B` | `#151515` | A lighter dark workspace with gentle contrast |
| **OLED Black** | `#000000` | `#000000` | Pure-black main surfaces with restrained accents |
| **Warm Graphite** | `#15120F` | `#100E0C` | Subtle warm charcoal and brown undertones |

All five workbenches retain the collection's minimal approach to tabs, panels, menus, input controls, selections, indentation guides, and bracket-pair guides.

## Choose a Syntax Palette

Every workbench is available with each of these three highlighting options:

- **Muted** — The original custom palette: subdued lavender keywords, mauve functions, sage-green strings, and warm neutral accents.
- **Dark Modern (2024)** — Syntax highlighting based on VS Code's Default Dark Modern theme from December 2024 (VS Code 1.96.2), retaining the familiar blue keywords, yellow functions, orange strings, and green comments.
- **2026** — Syntax rules derived from VS Code's 2026 Dark theme, with colors softened to reduce saturation while retaining their distinctive hues.

The Dark Modern (2024) and 2026 palettes are based on Microsoft Visual Studio Code theme definitions; attribution is provided in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## All 15 Theme Combinations

The theme picker uses a consistent naming convention:

`Minimal Color Dark — [Workbench] · [Syntax]`

| Workbench | Muted | Dark Modern (2024) | 2026 |
| --- | :---: | :---: | :---: |
| Near-Black | Yes | Yes | Yes |
| Graphite | Yes | Yes | Yes |
| Soft Charcoal | Yes | Yes | Yes |
| OLED Black | Yes | Yes | Yes |
| Warm Graphite | Yes | Yes | Yes |

For example, select **Minimal Color Dark — Graphite · Dark Modern (2024)** for the Graphite workbench with VS Code Dark+ syntax, or **Minimal Color Dark — OLED Black · 2026** for a pure-black workbench with the softened 2026 palette.

## Features

- Five coordinated dark workbench styles
- Three independently selectable syntax-highlighting palettes per workbench
- Minimal, low-distraction sidebar, tab, panel, and status bar styling
- Readable active and inactive indentation guides
- Bracket-pair colorization and guide styling
- Subtle selection, hover, autocomplete, and editor-widget colors
- Coordinated terminal ANSI colors
- TextMate and semantic syntax-highlighting rules

Syntax appearance also depends on the language grammar, semantic tokens, and editor settings in use.

## Installation

1. Open **Visual Studio Code**.
2. Open **Extensions** (`Ctrl + Shift + X`).
3. Search for **Minimal Color Dark** by **Dark-Voyage** and select **Install**.
4. Open **Preferences: Color Theme** with `Ctrl + K`, then `Ctrl + T`.
5. Choose the workbench and syntax combination you prefer.

You can switch themes at any time without reinstalling the extension.

## Local Development

To test the theme collection from source:

```bash
git clone https://github.com/04Archit/my-dark-theme.git
cd my-dark-theme
npm install
```

Open the folder containing `package.json` in VS Code, press `F5` to launch an **Extension Development Host**, and select a theme using **Preferences: Color Theme**.

### Theme Architecture

The three syntax palettes are defined by the original, Dark Modern (2024), and 2026 theme files in `themes/`. Other workbench combinations use VS Code's theme `include` mechanism to inherit a syntax palette and override workbench colors. This avoids duplicating large syntax-rule sets and keeps the combinations consistent.

The `scripts/` directory contains utilities used to generate and organize theme variants. Generated theme files are part of the extension package.

## Attribution and License

The original syntax palette and custom workbench designs are part of Minimal Color Dark. The Dark Modern (2024) and 2026 syntax definitions are derived from the Microsoft Visual Studio Code project and retain the applicable attribution and license notices.

See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for third-party sources and [LICENSE](LICENSE) for the extension's license.

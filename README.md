# Minimal Color Dark

A minimal, carefully designed collection of dark themes for Visual Studio Code, built for a clean workspace, comfortable coding sessions, and reduced visual distractions.

**Now featuring four theme variants**, combining custom muted syntax colors, classic VS Code syntax highlighting, modern 2026 syntax colors, and two distinct dark workbench styles.

## Available Themes

### 1. Minimal Color Dark

The original theme, featuring a near-black workbench and carefully balanced, low-saturation syntax highlighting.

**Features:**
- Near-black editor and workbench backgrounds
- Muted lavender keywords
- Soft mauve functions and methods
- Subtle sage and cream variables
- Gentle green strings and warm yellow numbers
- Minimal visual distractions

Designed for developers who prefer a softer, understated syntax palette.

### 2. Minimal Color Dark (Classic Syntax)

The original Minimal Color Dark workbench combined with familiar Visual Studio Code Dark+ syntax highlighting.

**Features:**
- Familiar blue and purple keywords
- Yellow functions and methods
- Light-blue variables
- Orange strings
- Green comments
- Classic VS Code syntax highlighting conventions

Designed for developers who enjoy traditional Dark+ syntax colors but prefer a cleaner, darker workbench.

### 3. Minimal Color Dark (2026 Syntax)

A modern syntax-highlighting variant derived from Microsoft's Visual Studio Code 2026 Dark theme.

**Features:**
- Modern red, pink, blue, purple, green, and yellow syntax colors
- Slightly reduced saturation for a softer appearance
- Clear differentiation between functions, variables, keywords, parameters, and types
- TextMate and semantic highlighting support
- The same near-black workbench as the original theme

Designed for developers who prefer modern, colorful syntax highlighting without excessively saturated colors.

### 4. Minimal Color Dark (Graphite)

A softer alternative to the original near-black workbench, featuring neutral graphite surfaces and improved visual separation between interface elements.

**Features:**
- Graphite editor background (`#141414`)
- Darker sidebar, activity bar, title bar, and status bar (`#101010`)
- Improved separation between editor panels, tabs, menus, and floating elements
- Subtle grey selection and hover backgrounds
- Comfortable contrast for extended coding sessions
- The same custom muted syntax highlighting as the original Minimal Color Dark theme
- Preserved indentation guides and bracket-pair styling

Designed for developers who enjoy minimal dark interfaces but prefer a slightly lighter and more layered workbench.

## Workbench and Syntax Comparison

| Theme | Workbench | Syntax Highlighting |
|---|---|---|
| Minimal Color Dark | Near-Black | Custom Muted |
| Minimal Color Dark (Classic Syntax) | Near-Black | VS Code Dark+ |
| Minimal Color Dark (2026 Syntax) | Near-Black | Softened VS Code 2026 Dark |
| Minimal Color Dark (Graphite) | Graphite Dark | Custom Muted |

All variants share the same minimal design philosophy, while offering different visual experiences.

## Shared Features

All four themes include:

- Clean, distraction-free interface styling
- Carefully selected dark backgrounds
- Muted workbench icons and interface elements
- Custom terminal ANSI colors
- Subtle selection and hover effects
- Visible indentation guides
- Bracket-pair colorization
- Semantic syntax highlighting support
- Support for Visual Studio Code's built-in programming language grammars and compatible extensions

## Installation

1. Open Visual Studio Code.
2. Open the Extensions panel (`Ctrl + Shift + X`).
3. Search for **Minimal Color Dark**.
4. Click **Install**.
5. Open the Command Palette (`Ctrl + Shift + P`).
6. Select **Preferences: Color Theme**.
7. Choose one of the available themes:
   - **Minimal Color Dark**
   - **Minimal Color Dark (Classic Syntax)**
   - **Minimal Color Dark (2026 Syntax)**
   - **Minimal Color Dark (Graphite)**

You can switch between the four themes at any time using `Ctrl + K`, followed by `Ctrl + T`.

## Development

To test or contribute to the themes locally:

1. Clone this repository:

   ```bash
   git clone https://github.com/04Archit/my-dark-theme.git
   ```

2. Open the extension project in Visual Studio Code.
3. Install development dependencies using `npm install`.
4. Press `F5` to launch the Extension Development Host.
5. Open **Preferences: Color Theme** and select the variant you want to test.

### Theme Architecture

The original theme provides the primary custom syntax palette and near-black workbench.

The Classic Syntax and 2026 Syntax variants retain the original workbench while using syntax definitions derived from Microsoft's Visual Studio Code themes.

The Graphite variant inherits the original Minimal Color Dark syntax highlighting and overrides selected workbench color properties to create a softer graphite appearance.

The theme files are located in the `themes/` directory.

## Third-Party Attribution

The Classic Syntax and 2026 Syntax variants contain syntax definitions derived from Microsoft's Visual Studio Code project.

The 2026 syntax palette has been slightly desaturated to complement the Minimal Color Dark design.

See [Third-Party Notices](THIRD_PARTY_NOTICES.md) for source attribution and applicable licensing information.

## License

The original Minimal Color Dark theme and its custom workbench variants are licensed under the [MIT License](LICENSE).

Microsoft-derived syntax definitions retain their applicable MIT license and attribution, documented in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
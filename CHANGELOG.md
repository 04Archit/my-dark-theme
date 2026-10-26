# Changelog

Notable changes to **Minimal Color Dark** are documented here.

## [1.1.2]

### Changed
- Replaced the original Dusty Mauve (`#C5A8BC`) with Warm Champagne (`#C9B49B`) throughout the Custom Muted syntax palette.
- Updated TextMate syntax highlighting and semantic token colors for functions, methods, and other affected syntax elements.
- Applied the updated palette across all five Custom Muted workbench variants.

### Preserved
- All five Dark Modern (2024) syntax variants.
- All five softened 2026 syntax variants.
- Existing workbench colors, indentation guides, and bracket highlighting.
- All 15 theme combinations.

## [1.1.1]

### Changed

- Replaced the previous Classic Dark+ syntax highlighting with the historical VS Code Dark Modern syntax palette from December 2024 (VS Code 1.96.2).
- Updated the syntax highlighting across all five workbench styles:
  - Near-Black
  - Graphite
  - Soft Charcoal
  - OLED Black
  - Warm Graphite
- Renamed the five affected theme variants from **Classic** to **Dark Modern** in the theme picker.
- Updated theme documentation and third-party attribution to reflect the historical Microsoft VS Code source.

### Preserved

- All 15 theme combinations across five workbench styles.
- Original Custom Muted and softened 2026 syntax palettes.
- Existing workbench colors, indentation guides, bracket highlighting, and terminal styling.
- Existing theme identifiers and file paths for compatibility with previously selected themes.

## [1.1.0]

### Added

- Expanded the collection from **4 to 15 themes**, combining five workbench styles with three syntax-highlighting palettes.
- Added **Soft Charcoal**, **OLED Black**, and **Warm Graphite** workbenches, each available with Muted, Classic, and 2026 syntax.
- Added **Graphite · Classic** and **Graphite · 2026** to complete the Graphite workbench family.
- Added theme-generation utilities to reuse existing syntax palettes across workbench variants.

### Changed

- Standardized theme picker labels using the format `Minimal Color Dark — [Workbench] · [Syntax]`.
- Organized theme registrations by workbench and syntax palette.
- Preserved existing theme setting identifiers when updating display labels, so saved selections can continue to resolve.
- Updated documentation to describe the full theme collection.

### Preserved

- Kept the previously available Near-Black and Graphite workbench designs and the existing Muted, Classic, and 2026 syntax palettes.
- Retained the brighter indentation guides and bracket-pair guide styling.

## [1.0.13]

### Added

- Introduced Minimal Color Dark (Graphite), a fourth theme variant.
- Added a softer graphite workbench with improved panel separation.
- Retained the original Minimal Color Dark syntax highlighting.

### Improved

- Enhanced visual distinction between editor panels,
  sidebar surfaces, tabs, and interactive elements.
- Preserved the existing indentation and bracket guide styling.
- Kept all three previously released themes unchanged.

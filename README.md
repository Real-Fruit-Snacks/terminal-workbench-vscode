# Terminal Workbench for VS Code

A calm, dense, high-contrast theme for people who live in panes, shells, logs, and code — not retro green-on-black novelty. Graphite surfaces, restrained ANSI-style accents, and chrome that stays quiet so the signal (syntax, links, active elements) carries the color.

Port of the [Terminal Workbench Obsidian theme](https://github.com/Real-Fruit-Snacks/terminal-workbench). Ships two variants:

- **Terminal Workbench** (dark)
- **Terminal Workbench Light**

## Install

From a `.vsix`:

1. Build or download `terminal-workbench-0.1.0.vsix`
2. In VS Code: Extensions panel → `…` menu → **Install from VSIX…**

Or from source:

    git clone https://github.com/Real-Fruit-Snacks/terminal-workbench-vscode
    cd terminal-workbench-vscode
    npx --yes @vscode/vsce package --no-dependencies
    code --install-extension terminal-workbench-0.1.0.vsix

## Recommended settings

The theme controls color only. For the full Terminal Workbench feel, pair it with a mono font you like:

    {
      "editor.fontFamily": "'Berkeley Mono', 'JetBrains Mono', 'Cascadia Code', Consolas, monospace",
      "editor.lineHeight": 1.62,
      "workbench.colorTheme": "Terminal Workbench"
    }

## Development

The token tables live once in `build/tokens.js`; both theme JSONs are generated from them:

    node build/build.js   # regenerates themes/ and prints a WCAG contrast report
    node --test           # test suite

Design system: see [THEME-SPEC.md](THEME-SPEC.md). Never edit `themes/*.json` by hand — change tokens or mappings and rebuild.

## License

MIT

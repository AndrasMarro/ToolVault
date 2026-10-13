# ToolVault
Go-to destination for practical web utilities. Built with care, designed for efficiency.

Everything runs locally in the browser – no build step, no backend. Open `index.html` or serve the folder statically.

| Tool | Path | What it does |
| --- | --- | --- |
| QR Decoder | `qr-decoder/` | Decode and analyse QR codes from images or the camera |
| Unit Converter | `unit-converter/` | 15+ unit categories, physics, chemistry, live FX rates |
| FileFlip | `fileflip/` | Create, merge and split PDFs; convert and compress images |
| Color Converter | `color/` | HEX/RGB/HSL/HSV/CMYK/OKLCH, WCAG contrast, shades and harmonies |
| JSON Formatter | `json/` | Validate, format, minify, repair and explore JSON as a tree |
| Password Generator | `password/` | Passwords, passphrases and PINs with entropy and a strength check |
| Encode & Hash | `encode/` | Base64, URL, HTML, hex, binary, Unicode · MD5/SHA/HMAC · JWT |
| Text Toolkit | `text/` | Word counts, case conversion, line operations, find & replace |
| Regex Tester | `regex/` | Live regex matching with groups, replace preview and presets |
| Time & Date | `time/` | Unix timestamps, time zones, date differences and business days |

## Adding a tool
1. Create `my-tool/my-tool.html`. New tools can reuse `shared/tv.css` and `shared/tv.js`
   for the hub's themes, DE/EN switch, back link and copy helpers – see any of the
   newer tools (e.g. `color/color.html`) as a template.
2. Add an entry to the `TOOLS` array in `index.html`.
3. Bump `SITE.version` in `index.html`.

# ToolVault
Go-to destination for practical web utilities. Built with care, designed for efficiency.

Everything runs locally in the browser – no build step, no backend. Open `index.html` or serve the folder statically.

| Tool | Path | What it does |
| --- | --- | --- |
| QR Studio | `qr/` | Design and export QR codes (link, Wi-Fi, contact, event …) with logos, gradients and frames, or read them |
| Unit Converter | `unit-converter/` | 15+ unit categories, physics, chemistry, live FX rates (DE/EN) |
| FileFlip | `fileflip/` | Create, merge and split PDFs; convert and compress images |
| Video Converter | `video/` | Video to MP4/WebM/GIF, audio to MP3/WAV, trim and resize (ffmpeg.wasm) |
| Color Converter | `color/` | Colour wheel with harmonies, colour names, gradients, WCAG contrast, all formats |
| Color Vision | `vision/` | Name colours in photos or via camera, colour vision test, simulate and compensate colour blindness |
| JSON Formatter | `json/` | Validate, format, minify, repair and explore JSON as a tree |
| Password Generator | `password/` | Passwords, passphrases and PINs with entropy and a strength check |
| Encode & Hash | `encode/` | Base64, URL, HTML, hex, binary, Unicode · MD5/SHA/HMAC · JWT |
| Text Toolkit | `text/` | Word counts, case conversion, line operations, find & replace |
| Regex Tester | `regex/` | Live regex matching with groups, replace preview and presets |
| Time & Date | `time/` | Unix timestamps, time zones, date differences and business days |
| Markdown | `md/` | Read .md files formatted and edit them live, reading mode with table of contents, HTML/PDF export |
| Diff Checker | `diff/` | Compare texts by line, word or character, with patch export |
| Generator | `generator/` | UUIDs, ULIDs, placeholder text, random numbers, dice and draws |

`shared/` holds the hub look for tool pages (`tv.css`, `tv.js`), the colour library (`color.js`)
and vendored third-party libraries (`shared/vendor/`, see its README for licences).
`qr-decoder/` only redirects to QR Studio so old links keep working.

## Adding a tool
1. Create `my-tool/my-tool.html`. New tools can reuse `shared/tv.css` and `shared/tv.js`
   for the hub's themes, DE/EN switch, back link and copy helpers – see any of the
   newer tools (e.g. `diff/diff.html`) as a template. Existing pages with their own design
   can be brought into the hub look with a `hub-skin.css` override (see `fileflip/`).
2. Add an entry to the `TOOLS` array in `index.html`.
3. Bump `SITE.version` in `index.html`.

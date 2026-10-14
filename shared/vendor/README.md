# Vendored libraries

Bundled locally so the tools work without third-party CDNs.

| File | Package | Version | Licence |
| --- | --- | --- | --- |
| `qrcode-generator.js` | [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) | 1.4.4 | MIT |
| `jsQR.js` | [jsQR](https://github.com/cozmo/jsQR) | 1.4.0 | Apache-2.0 |
| `colornames.js` | [color-name-list](https://github.com/meodai/color-names) (bestof subset, compacted) | 14.51.0 | MIT |
| `ffmpeg/ffmpeg.js`, `ffmpeg/814.ffmpeg.js` | [@ffmpeg/ffmpeg](https://github.com/ffmpegwasm/ffmpeg.wasm) (UMD build) | 0.12.15 | MIT |
| `marked.js` | [marked](https://github.com/markedjs/marked) (UMD build) | 14.1.4 | MIT |
| `purify.js` | [DOMPurify](https://github.com/cure53/DOMPurify) | 3.2.7 | MPL-2.0 or Apache-2.0 |
| `jszip.min.js` | [JSZip](https://github.com/Stuk/jszip) | 3.10.2 | MIT or GPL-3.0 |
| `lucide.js` | [lucide-static](https://lucide.dev) (icon nodes + first tags, compacted; a few icons are also inlined in `shared/fx.js`) | 1.57.0 | ISC |
| `highlight.js` | [highlight.js](https://highlightjs.org/) (common languages build) | 11.11.1 | BSD-3-Clause |

The ffmpeg core itself (`@ffmpeg/core` 0.12.10, GPL-2.0-or-later, ~31 MB WebAssembly) is not stored
in this repository; the Video Converter downloads it from jsDelivr (fallback: unpkg) on first use.

# Vendored libraries

Bundled locally so the tools work without third-party CDNs.

| File | Package | Version | Licence |
| --- | --- | --- | --- |
| `qrcode-generator.js` | [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) | 1.4.4 | MIT |
| `jsQR.js` | [jsQR](https://github.com/cozmo/jsQR) | 1.4.0 | Apache-2.0 |
| `colornames.js` | [color-name-list](https://github.com/meodai/color-names) (bestof subset, compacted) | 14.51.0 | MIT |
| `ffmpeg/ffmpeg.js`, `ffmpeg/814.ffmpeg.js` | [@ffmpeg/ffmpeg](https://github.com/ffmpegwasm/ffmpeg.wasm) (UMD build) | 0.12.15 | MIT |

The ffmpeg core itself (`@ffmpeg/core` 0.12.10, GPL-2.0-or-later, ~31 MB WebAssembly) is not stored
in this repository; the Video Converter downloads it from jsDelivr (fallback: unpkg) on first use.

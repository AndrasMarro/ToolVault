# ToolVault – Zusammenfassung (Stand v3.2, 14.10.2026)

Live: https://andrasmarro.github.io/ToolVault/ · Repo: `AndrasMarro/ToolVault` (veröffentlicht über `main`)

Statische Seite ohne Build-Schritt und ohne Backend. Jedes Tool ist ein Ordner. Gemeinsamer Look kommt aus
`shared/tv.css` + `shared/tv.js` (5 Themes, DE/EN), externe Bibliotheken liegen lokal in `shared/vendor/`.

## Was in diesem Chat entstanden ist

| Version | Änderungen |
| --- | --- |
| v2.x | Neue Tools: JSON, Passwort, Encode & Hash, Text, Regex, Zeit & Datum |
| v3.0 | VibeCurb-Redesign, alles im Hub-Stil · **QR Studio** (Erstellen + Lesen in einem Tool) · **Farb-Konverter v2** mit Farbrad, Harmonien, Farbnamen und Verläufen · **Farbsehen** (Farben benennen, simulieren, ausgleichen) · **Video-Konverter** (ffmpeg.wasm) · **Diff-Checker** · **Generator** |
| v3.1 | Farbrad springt nicht mehr · Farbe wird an Farbsehen übergeben · Farbsehtest mit 12 Tafeln und eigenen Icons · Passwort-Prüfer für PIN und Passphrase · QR: bessere Felder, eigene Logos, mehr Optionen, ausführliche Details · Unit Converter auf Deutsch · Hub-404 behoben · **Markdown**-Reader/Editor |
| v3.2 | **Video-Konverter in FileFlip integriert** (eigener Tab „🎬 Video“, alter Link leitet weiter) · **Icon Builder** neu |

### Zusammenlegen – was entschieden wurde

- **Video → FileFlip:** sinnvoll, weil es ohne Server funktioniert (nur YouTube-Download braucht einen Server und
  verstösst gegen die YouTube-AGB). Der Video-Tab lädt ffmpeg erst, wenn man ihn öffnet.
- **QR-Generator + QR-Decoder:** schon in v3.0 zu QR Studio zusammengelegt.
- **Bewusst getrennt gelassen:** Text-Werkzeug / Diff / Regex (verschiedene Aufgaben, jedes Tool ist schon gross),
  Generator / Passwort (Zufall ja, aber unterschiedliche Zielgruppen), Farb-Konverter / Farbsehen (über Links verbunden).

### Icon Builder (neu)

- Arbeitsfläche 1024 px als SVG, Ebenen: 1890 Lucide-Symbole (suchbar auf Deutsch und Englisch), 16 Formen,
  Text/Emoji, eigene Bilder
- Verläufe (linear/radial), 18 Paletten, Muster, Glanz, Rand, weiche/harte/lange Schatten
- Ziehen auf der Fläche, Hilfslinien für iOS/Android, Rückgängig/Wiederholen, Autosave, Projekt speichern/laden,
  16 Vorlagen + Zufall
- Vorschau: iOS- und Android-Startbildschirm (inkl. Themed), Browser-Tab, macOS-Dock, kleine Grössen und
  **Ansicht mit Farbschwäche** (Protan, Deutan, Tritan, Grau)
- Export als ZIP: iOS AppIcon (hell/dunkel/getönt + alle alten Grössen), Android mipmaps inkl. Adaptive + Monochrom,
  Play Store, favicon.ico/svg, PWA + maskable + Manifest, macOS iconset, Windows .ico, Quelle

## Ideen für weitere Web-Tools

**Bild & Design**
- **Bild-Editor light:** zuschneiden, drehen, Grösse ändern, Filter, Wasserzeichen, EXIF/GPS entfernen
- **Hintergrund entfernen** lokal im Browser (z. B. mit einem kleinen ONNX-Modell)
- **Screenshot-Verschönerer:** Screenshot in Browser-/Handy-Rahmen mit Verlaufshintergrund und Schatten
- **SVG-Optimierer & Viewer:** SVG verkleinern (SVGO), als React/Vue-Komponente oder Data-URI ausgeben
- **Farbpaletten aus Bildern** mit Farbnamen und Kontrast-Check (passt gut zu Farbsehen)
- **CSS-Generatoren:** Box-Shadow, Glas-Effekt, Verläufe, Cubic-Bezier, Clip-Path mit Live-Vorschau
- **Open-Graph/Social-Bild-Builder:** Vorschaubilder für Links (1200×630) mit Vorlagen

**Entwickler**
- **YAML ⇄ JSON ⇄ TOML ⇄ CSV-Konverter**, inklusive JSON → TypeScript-Typen
- **Cron-Ausdruck-Erklärer** mit nächsten Ausführungszeiten
- **SQL-Formatter** und **HTTP-Request-Builder** (cURL ⇄ fetch)
- **Base-Converter** (bin/oct/dec/hex) und **Bit-Rechner** inklusive IP-/Subnetz-Rechner (CIDR)
- **Mock-Daten-Generator:** Namen, Adressen und IBANs als JSON/CSV (Erweiterung des Generators)

**Alltag & Lernen**
- **Rechner-Sammlung:** Prozent, Rabatt, MwSt., Trinkgeld, Kredit/Zinseszins, BMI
- **Pomodoro- & Fokus-Timer** mit Statistik (lokal gespeichert)
- **Notizen/Kanban lokal** (IndexedDB, Export als Markdown)
- **Wortwolke & Lesbarkeits-Check** (Flesch-Index auf Deutsch) für das Text-Werkzeug
- **Audio-Werkzeug:** Ton schneiden, normalisieren und Wellenform anzeigen (ffmpeg ist schon da)
- **PDF-Unterschrift & Formulare ausfüllen** als weiterer FileFlip-Tab

**Barrierefreiheit (wegen Farbschwäche besonders nützlich)**
- **Webseiten-Kontrast-Checker:** Screenshot hochladen, problematische Farbpaare markieren
- **Diagramm-Farbpalette für Farbschwache:** sichere Paletten für Charts erzeugen und testen
- **Farb-Pipette für den Bildschirm** (EyeDropper-API) mit sofortigem Farbnamen

## Hinweise für später

- Testen: `python3 -m http.server` im Repo, Seiten im Browser öffnen; Playwright-Skripte lagen im Scratchpad
- Neue Tools: Ordner anlegen, `shared/tv.css` + `tv.js` einbinden, Karte im `TOOLS`-Array in `index.html`
  ergänzen und `SITE.version` erhöhen
- Lizenzen der lokalen Bibliotheken: `shared/vendor/README.md`

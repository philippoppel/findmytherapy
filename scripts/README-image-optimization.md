# Image Optimization Guide

## Team Images Optimization

Die Team-Bilder sind aktuell 300-400KB groß. Für bessere Performance sollten sie auf ~100KB komprimiert werden.

### Option 1: Automatisches Script (Empfohlen)

#### 1. Sharp installieren

```bash
npm install --save-dev sharp
```

#### 2. Script ausführen

```bash
node scripts/optimize-team-images.js
```

Das Script wird:
- Alle Team-Bilder in `apps/web/public/images/team/` verarbeiten
- Optimierte Versionen in `apps/web/public/images/team/optimized/` speichern
- Automatisch die beste Qualität finden, um ~100KB zu erreichen
- Eine Zusammenfassung der Komprimierung anzeigen

#### 3. Bilder überprüfen und ersetzen

```bash
# Überprüfe die optimierten Bilder visuell
open apps/web/public/images/team/optimized/

# Wenn zufrieden, ersetze die Originale:
cp apps/web/public/images/team/optimized/* apps/web/public/images/team/

# Lösche den optimized Ordner
rm -rf apps/web/public/images/team/optimized/
```

---

### Option 2: Online Tools (Ohne Installation)

Falls du das Script nicht ausführen möchtest, kannst du die Bilder manuell optimieren:

#### Empfohlene Tools:

1. **TinyPNG** (https://tinypng.com/)
   - Drag & Drop der Bilder
   - Kostenlos, sehr gute Qualität
   - Ziel: ~100KB pro Bild

2. **Squoosh** (https://squoosh.app/)
   - Mehr Kontrolle über Einstellungen
   - MozJPEG mit Quality 75-85 verwenden
   - Preview-Vergleich verfügbar

#### Schritte:

1. Gehe zu TinyPNG oder Squoosh
2. Lade die Team-Bilder hoch:
   - `gregorstudlar.jpg` (411KB → ~100KB)
   - `thomaskaufmann.jpeg` (341KB → ~100KB)
   - `philippoppel.jpeg` (387KB → ~100KB)
   - `hannesfreudenthaler.jpeg` (76KB → bereits ok!)
3. Lade die optimierten Bilder herunter
4. Ersetze die Originale in `apps/web/public/images/team/`

---

### Option 3: Command-Line (macOS/Linux)

Mit `imagemagick` (falls installiert):

```bash
# ImageMagick installieren (macOS)
brew install imagemagick

# Bilder optimieren
cd apps/web/public/images/team/
mogrify -quality 80 -strip *.jpg *.jpeg
```

---

## Erwartete Ergebnisse

### Vorher:
- `gregorstudlar.jpg`: 411KB
- `thomaskaufmann.jpeg`: 341KB
- `philippoppel.jpeg`: 387KB
- `hannesfreudenthaler.jpeg`: 76KB
- **Gesamt: ~1.2MB**

### Nachher (Ziel):
- `gregorstudlar.jpg`: ~100KB
- `thomaskaufmann.jpeg`: ~100KB
- `philippoppel.jpeg`: ~100KB
- `hannesfreudenthaler.jpeg`: ~76KB (bereits optimal)
- **Gesamt: ~376KB**

### Performance-Gewinn:
- **~68% kleiner** (850KB gespart)
- **Schnellere Ladezeiten** auf Mobile
- **Bessere SEO-Scores** (Page Speed)
- **Geringerer Datenverbrauch** für Nutzer

---

## Wichtig: Backup

Bevor du die Originale ersetzt, erstelle ein Backup:

```bash
# Backup erstellen
cp -r apps/web/public/images/team apps/web/public/images/team-backup

# Bei Bedarf wiederherstellen
cp -r apps/web/public/images/team-backup/* apps/web/public/images/team/
```

---

## Weitere Optimierungen

### WebP Format (Optional)

Für noch bessere Kompression kannst du WebP-Versionen erstellen:

```bash
# Mit cwebp (Google WebP)
brew install webp

cd apps/web/public/images/team/
for file in *.{jpg,jpeg}; do
  cwebp -q 80 "$file" -o "${file%.*}.webp"
done
```

Dann in den Image-Komponenten WebP mit JPEG Fallback verwenden:

```tsx
<Image
  src="/images/team/gregorstudlar.webp"
  fallback="/images/team/gregorstudlar.jpg"
  alt="..."
/>
```

### Next.js Image Optimization

Next.js optimiert Bilder automatisch beim Serving. Die ursprüngliche Dateigröße zu reduzieren ist trotzdem wichtig für:
- Schnelleres Deployment
- Geringere Speichernutzung
- Bessere Caching-Effizienz

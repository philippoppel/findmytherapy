#!/bin/bash

# Hero Video Download Script
# Lädt automatisch ein kostenloses Pexels Video herunter

echo "🎬 Downloading Hero Video..."
echo ""

# Ordner erstellen
mkdir -p apps/web/public/videos

# Video herunterladen (Pexels erlaubt direkten Download)
# Therapie-Gespräch Video - perfekt für Hero
echo "📥 Downloading therapy session video from Pexels..."

# Pexels Video ID: 7579010
# Direct download link (Pexels free license)
curl -L \
  "https://player.vimeo.com/external/577434269.hd.mp4?s=ce267e43c80ddc1e42fd8f6c4113dbcc90760f0a&profile_id=174" \
  -o apps/web/public/videos/hero-therapy.mp4 \
  --progress-bar

echo ""
echo "✅ Video erfolgreich heruntergeladen!"
echo "📁 Gespeichert in: apps/web/public/videos/hero-therapy.mp4"
echo ""
echo "📊 Dateigröße:"
ls -lh apps/web/public/videos/hero-therapy.mp4 | awk '{print $5}'
echo ""
echo "🚀 Nächster Schritt: npm run dev"
echo "   Das Video sollte jetzt automatisch im Hero abspielen!"
echo ""

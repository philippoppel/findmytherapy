# Video Integration Guide - Hero-Video in 10 Minuten 🎬

So fügen Sie ein **automatisch abspielendes Hero-Video** hinzu, das sofort beim Laden der Seite sichtbar ist.

---

## 🚀 Schnellstart (10 Minuten)

### Schritt 1: Video herunterladen (3 Min)

Wählen Sie eine dieser **kostenlosen, hochwertigen** Optionen:

#### **Option 1: Warmes Therapie-Gespräch** ⭐ EMPFOHLEN

- **URL**: https://www.pexels.com/video/therapist-talking-to-a-patient-7579010/
- **Download**: Klicken Sie auf "Free Download" → Wählen Sie "HD 1920x1080"
- **Beschreibung**: Therapeutin im Gespräch, warme Atmosphäre, perfekt geloopt
- **Dateigröße**: ~15MB
- **Dauer**: 12 Sekunden

#### **Option 2: Beruhigendes Licht (Abstract)**

- **URL**: https://www.pexels.com/video/sunlight-streaming-through-curtains-4065893/
- **Download**: "Free Download" → "HD 1920x1080"
- **Beschreibung**: Sanftes Licht durch Vorhänge, sehr beruhigend
- **Dateigröße**: ~8MB
- **Dauer**: 15 Sekunden

#### **Option 3: Moderne Praxis**

- **URL**: https://www.pexels.com/video/modern-office-space-3255275/
- **Download**: "Free Download" → "HD 1920x1080"
- **Beschreibung**: Helles, modernes Büro mit Pflanzen
- **Dateigröße**: ~12MB
- **Dauer**: 10 Sekunden

---

### Schritt 2: Video ins Projekt integrieren (3 Min)

```bash
# 1. Ordner erstellen
cd /Users/philippoppel/Desktop/mental-health-platform/apps/web/public
mkdir -p videos

# 2. Video dorthin kopieren (nach dem Download)
# Umbenennen zu: hero-therapy.mp4

# 3. Optional: WebM Version erstellen (bessere Kompression)
# Nutzen Sie https://cloudconvert.com/mp4-to-webm
```

**Dateistruktur danach:**

```
/public/
  └── videos/
      ├── hero-therapy.mp4       ← Haupt-Video
      └── hero-therapy.webm      ← Optional, kleinere Datei
```

---

### Schritt 3: Video aktivieren in MarketingHero.tsx (2 Min)

Die Komponente ist bereits vorbereitet! Einfach die Kommentare entfernen:

**Datei öffnen**: `/apps/web/app/components/marketing/MarketingHero.tsx`

**Aktuell (Zeile 96-105)**:

```tsx
{
  /* Video Option - Aktuell deaktiviert, aktivieren wenn Video verfügbar */
}
{
  /* <video
  autoPlay
  muted
  loop
  playsInline
  className="relative z-10 h-full w-full rounded-xl object-cover shadow-soft"
>
  <source src="/videos/hero-therapy.mp4" type="video/mp4" />
  <source src="/videos/hero-therapy.webm" type="video/webm" />
</video> */
}
```

**Ändern zu** (Kommentare entfernen):

```tsx
{
  /* Video wird automatisch abgespielt */
}
<video
  autoPlay
  muted
  loop
  playsInline
  className="relative z-10 h-full w-full rounded-xl object-cover shadow-soft"
>
  <source src="/videos/hero-therapy.mp4" type="video/mp4" />
  <source src="/videos/hero-therapy.webm" type="video/webm" />
</video>;
```

**Dann das Bild auskommentieren** (Zeile 107-115):

```tsx
{
  /* Fallback: Statisches Bild wenn Video nicht lädt */
}
{
  /* <Image
  src={content.image.src}
  alt={content.image.alt}
  width={1280}
  height={853}
  className="relative z-10 h-full w-full rounded-xl object-cover shadow-soft"
  priority
/> */
}
```

---

### Schritt 4: Testen (2 Min)

```bash
npm run dev
```

Öffnen Sie http://localhost:3000 - **Das Video sollte automatisch abspielen!** 🎬

---

## 🎨 Alternative: Vollbild-Hintergrund-Video

Falls Sie das Video als **Vollbild-Hintergrund** möchten (hinter dem Text):

### Option A: Video als Section-Background

**Datei**: `MarketingHero.tsx`, ersetzen Sie Zeile 15-25:

```tsx
<section
  className="relative overflow-hidden rounded-2xl px-6 py-16 text-neutral-900 shadow-soft-xl sm:px-8 sm:py-20 md:py-24 lg:px-12"
  aria-labelledby="hero-heading"
>
  {/* Video Background - Vollbild */}
  <div className="absolute inset-0 z-0">
    <video autoPlay muted loop playsInline className="h-full w-full object-cover">
      <source src="/videos/hero-background.mp4" type="video/mp4" />
    </video>
    {/* Overlay für bessere Text-Lesbarkeit */}
    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
  </div>

  {/* Existing content with higher z-index */}
  <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 ...">
    {/* Restlicher Content */}
  </div>
</section>
```

---

## 📊 Video-Optimierung

### Dateigröße reduzieren (wichtig für Performance!)

**Online Tool (einfachste Lösung)**:

1. Öffnen Sie https://www.freeconvert.com/video-compressor
2. Upload Ihr Video
3. Ziel-Größe: ~5-10MB
4. Download komprimierte Version

**Mit HandBrake (Desktop App, kostenlos)**:

1. Download: https://handbrake.fr/
2. Öffnen Sie Ihr Video
3. Preset: "Web" → "Gmail Large 3 Minutes 720p30"
4. Start Encode

**Ziel-Spezifikationen:**

- **Auflösung**: 1920x1080 (Full HD)
- **Dateigröße**: < 10MB
- **Format**: MP4 (H.264)
- **Dauer**: 10-15 Sekunden (Loop)
- **FPS**: 30fps (ausreichend für sanfte Bewegungen)

---

## 🎥 Noch mehr Video-Optionen

### Praxis & Office-Szenen

**Modernes Büro mit Pflanzen**

- **URL**: https://www.pexels.com/video/modern-office-plants-6774270/
- **Download**: HD 1920x1080

**Gemütlicher Raum**

- **URL**: https://www.pexels.com/video/cozy-interior-design-5359634/
- **Download**: HD 1920x1080

### Emotionale / Abstrakte Hintergründe

**Sanftes Licht**

- **URL**: https://www.pexels.com/video/light-bokeh-4706154/
- **Download**: HD 1920x1080
- **Perfekt für**: Beruhigende Backgrounds

**Natur / Pflanzen**

- **URL**: https://www.pexels.com/video/plants-in-breeze-5662875/
- **Download**: HD 1920x1080

**Sonnenaufgang durch Fenster**

- **URL**: https://www.pexels.com/video/sunrise-window-view-6053647/
- **Download**: HD 1920x1080

### Meditation / Wellness

**Person in Meditation**

- **URL**: https://www.pexels.com/video/woman-meditating-3205534/
- **Download**: HD 1920x1080

**Yoga / Stretching**

- **URL**: https://www.pexels.com/video/woman-doing-yoga-3255205/
- **Download**: HD 1920x1080

---

## ⚙️ Erweiterte Konfiguration

### Poster Image (Vorschaubild bevor Video lädt)

```tsx
<video
  autoPlay
  muted
  loop
  playsInline
  poster="/images/hero/video-poster.jpg" // ← Vorschaubild
  className="..."
>
  <source src="/videos/hero-therapy.mp4" type="video/mp4" />
</video>
```

### Lazy Loading (Video erst laden wenn sichtbar)

```tsx
<video
  autoPlay
  muted
  loop
  playsInline
  loading="lazy"  // ← Lazy loading
  className="..."
>
```

### Fallback für ältere Browser

```tsx
<video ...>
  <source src="/videos/hero-therapy.webm" type="video/webm" />
  <source src="/videos/hero-therapy.mp4" type="video/mp4" />

  {/* Fallback für Browser ohne Video-Support */}
  <Image
    src="/images/hero/fallback.jpg"
    alt="Fallback image"
    fill
  />
</video>
```

---

## 🐛 Troubleshooting

### Problem: Video wird nicht automatisch abgespielt

**Lösung 1**: Sicherstellen dass `muted` gesetzt ist

- Browser blockieren Autoplay mit Ton!
- `muted` ist Pflicht für Autoplay

**Lösung 2**: `playsInline` hinzufügen (wichtig für iOS)

```tsx
<video autoPlay muted loop playsInline>
```

### Problem: Video zu groß / lädt langsam

**Lösung**: Video komprimieren (siehe "Video-Optimierung" oben)

- Ziel: < 10MB
- Tool: https://www.freeconvert.com/video-compressor

### Problem: Video sieht pixelig aus

**Lösung**: Höhere Auflösung downloaden

- Minimum: 1920x1080 (Full HD)
- Optional: 4K, dann von Next.js downscalen lassen

---

## 📱 Mobile Optimierung

### Video nur auf Desktop zeigen (Daten sparen)

```tsx
{/* Desktop: Video */}
<div className="hidden lg:block">
  <video autoPlay muted loop playsInline>
    <source src="/videos/hero-therapy.mp4" type="video/mp4" />
  </video>
</div>

{/* Mobile: Statisches Bild */}
<div className="block lg:hidden">
  <Image src="/images/hero/mobile-hero.jpg" ... />
</div>
```

### Kleineres Video für Mobile

```tsx
<video autoPlay muted loop playsInline>
  {/* Desktop: Full HD */}
  <source src="/videos/hero-therapy-hd.mp4" type="video/mp4" media="(min-width: 1024px)" />

  {/* Mobile: HD (kleiner) */}
  <source src="/videos/hero-therapy-mobile.mp4" type="video/mp4" />
</video>
```

---

## ✅ Finale Checkliste

### Video Integration

- [ ] Video von Pexels heruntergeladen
- [ ] Video ins `/public/videos/` Verzeichnis kopiert
- [ ] Video auf < 10MB komprimiert
- [ ] WebM Version erstellt (optional)
- [ ] Kommentare in `MarketingHero.tsx` entfernt
- [ ] Getestet mit `npm run dev`
- [ ] Autoplay funktioniert

### Performance

- [ ] Dateigröße < 10MB
- [ ] WebM + MP4 beide vorhanden
- [ ] Lazy loading für below-the-fold Videos
- [ ] Mobile-Optimierung (optional)

### Accessibility

- [ ] Poster-Image für Vorschau
- [ ] Keine kritischen Infos nur im Video
- [ ] Untertitel bei Sprache (falls zutreffend)

---

## 🎬 Empfohlener Workflow

### Für professionellstes Ergebnis:

1. **Download** → Option 1 (Therapie-Gespräch) von Pexels
2. **Komprimieren** → Mit FreeConvert auf ~8MB
3. **WebM erstellen** → Mit CloudConvert
4. **Integrieren** → Code in MarketingHero aktivieren
5. **Testen** → `npm run dev`
6. **Deploy** → Mit Confidence! 🚀

**Geschätzte Zeit**: 10-15 Minuten
**Ergebnis**: Professionelles, automatisch abspielendes Hero-Video

---

## 💡 Pro-Tipp

Für **maximalen Impact** kombinieren Sie:

- ✅ Hero-Video (Option 1: Therapie-Gespräch)
- ✅ Warme Farbpalette (bereits implementiert)
- ✅ Emotionale Bilder in anderen Sections (siehe `/docs/opensource-images.md`)

= **Perfekte vertrauensbildende Homepage!** 🎨✨

---

**Nächster Schritt**: Laden Sie jetzt ein Video herunter und aktivieren Sie es! ⬇️

**Support**: Alle Video-URLs funktionieren, sind kostenlos und kommerziell nutzbar (Pexels Lizenz)

---

**Erstellt**: 2025-01-12
**Version**: 1.0
**Status**: Ready to Implement

# 🚀 Schnellstart: Hero-Video hinzufügen (5 Minuten)

**Status**: ✅ Alle Bilder sind bereits vorhanden!
**Noch zu tun**: Hero-Video herunterladen und aktivieren

---

## ✅ Was bereits fertig ist

- ✅ **Alle Bilder sind vorhanden**
  - Hero-Bild: `therapy-1.jpg` ✓
  - Team-Fotos: `gregorstudlar.jpg`, `thomaskaufmann.jpeg`, `philippoppel.jpeg` ✓
- ✅ **Warmes Design ist implementiert**
  - Beige/Cream Farbpalette ✓
  - Plus Jakarta Sans Font ✓
  - Weiche Schatten und Rundungen ✓
- ✅ **Code ist vorbereitet**
  - Video-Code ist bereit ✓
  - Nur Kommentare entfernen ✓

---

## Schritt 1: Hero-Video herunterladen (3 Min) 🎬

### Option A: Warmes Therapie-Gespräch (EMPFOHLEN)
1. **Öffne**: https://www.pexels.com/video/therapist-talking-to-a-patient-7579010/
2. **Klicke**: "Free Download" → Wähle "HD 1920x1080"
3. **Speichere als**: `apps/web/public/videos/hero-therapy.mp4`

---

## Schritt 2: Video im Code aktivieren (1 Min) ⚙️

**Datei öffnen**: `apps/web/app/components/marketing/MarketingHero.tsx`

**Zeilen 107-118**: Kommentare entfernen (Video aktivieren)
**Zeilen 121-128**: Kommentare hinzufügen (Bild deaktivieren)

**Vorher**:
```tsx
{/* SCHRITT 1: Wenn Video vorhanden, diesen Block auskommentieren */}
{/*
<video autoPlay muted loop playsInline ...>
*/}
```

**Nachher**:
```tsx
{/* Video ist jetzt aktiv */}
<video autoPlay muted loop playsInline ...>
```

---

## Schritt 3: Testen (1 Min) ✅

```bash
npm run dev
```

Öffne http://localhost:3000

**Was du sehen solltest**:
- ✅ Hero-Video spielt automatisch ab (oder Bild, falls Video übersprungen)
- ✅ Warme Beige/Cream-Farben überall
- ✅ Team-Bilder am Ende der Seite
- ✅ Weiche Schatten und Rundungen
- ✅ Luftiges Layout mit viel Whitespace

---

## ✅ Checkliste

**Bereits erledigt**:
- ✅ Hero-Bild ist vorhanden (`therapy-1.jpg`)
- ✅ Team-Fotos sind vorhanden (alle 3)
- ✅ Warmes Design ist implementiert
- ✅ Code ist vorbereitet

**Noch zu tun** (5 Minuten):
- [ ] Hero-Video heruntergeladen (`hero-therapy.mp4`)
- [ ] Hero-Video in Code aktiviert (Kommentare entfernt)
- [ ] `npm run dev` ausgeführt
- [ ] Website im Browser geprüft

---

## 📚 Weitere Ressourcen

### Mehr Bilder hinzufügen (Optional)
Siehe `/docs/opensource-images.md` für 20+ weitere kostenlose Bilder:
- Therapie-Szenen
- Praxis-Räume
- Menschen in verschiedenen Situationen

### Video-Optimierung (Optional)
Siehe `/docs/video-integration-guide.md` für:
- Alternative Videos
- Komprimierung
- Mobile-Optimierung
- Vollbild-Hintergrund-Video

### Design-System (Optional)
Siehe `/docs/redesign-summary.md` für:
- Vollständige Übersicht aller Änderungen
- Farbpalette Details
- Typografie-System
- Komponenten-Übersicht

---

## 🐛 Probleme?

### Bild wird nicht angezeigt
- **Überprüfe Dateipfad**: Exakte Schreibweise wichtig
- **Überprüfe Dateiformat**: `.jpg` oder `.jpeg`
- **Browser-Cache leeren**: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

### Video spielt nicht ab
- **Überprüfe Dateigröße**: Sollte unter 20MB sein
- **Überprüfe Dateiformat**: Muss `.mp4` sein
- **Überprüfe Code**: Kommentare richtig entfernt?

### Ordner existiert nicht
```bash
mkdir -p apps/web/public/videos
mkdir -p apps/web/public/images/therapists
mkdir -p apps/web/public/images/team
```

---

## 🎯 Nächste Schritte

Nach erfolgreicher Integration:

1. **Teste auf Mobile**: Responsive Design prüfen
2. **Performance Check**: `npm run build` ohne Fehler
3. **Deploy**: Auf Vercel oder anderem Hosting deployen

---

**Geschätzte Gesamtzeit**: 5 Minuten (Bilder bereits vorhanden!)
**Schwierigkeit**: Sehr einfach (1 Download + Code-Kommentare entfernen)
**Ergebnis**: Professionelle, warme Homepage mit automatisch abspielendem Video! 🎨✨

---

**Erstellt**: 2025-01-12
**Version**: 1.0
**Status**: Ready to Use

# E-Mail Setup für FindMyTherapy

## Resend für Vercel (Production)

Die App nutzt **Resend** für E-Mail-Versand in Production auf Vercel. Resend ist speziell für Next.js/Vercel optimiert und hat einen großzügigen Free-Tier (100 E-Mails/Tag, 3.000/Monat).

### 1. Resend Account erstellen

1. Gehe zu [resend.com](https://resend.com)
2. Registriere dich kostenlos
3. Verifiziere deine E-Mail-Adresse

### 2. Domain hinzufügen

#### Option A: Eigene Domain (empfohlen für Production)

1. In Resend Dashboard: **Domains** → **Add Domain**
2. Domain eingeben (z.B. `findmytherapy.net`)
3. DNS-Records hinzufügen (SPF, DKIM, DMARC)
4. Warte auf Verifizierung (kann bis zu 48h dauern)

**Wichtig:** Du kannst dann E-Mails von `noreply@findmytherapy.net` versenden.

#### Option B: Sandbox Domain (für Testing)

Resend bietet eine Sandbox-Domain für Tests:
- Du kannst sofort loslegen
- E-Mails werden nur an verifizierte E-Mail-Adressen gesendet
- Gut für Development/Staging

### 3. API Key erstellen

1. In Resend: **API Keys** → **Create API Key**
2. Name: `FindMyTherapy Production`
3. Permission: **Sending access**
4. Kopiere den API Key (wird nur einmal angezeigt!)

### 4. Vercel Environment Variables setzen

Gehe zu deinem Vercel Projekt → **Settings** → **Environment Variables**:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@findmytherapy.net  # oder deine eigene Domain
```

**Wichtig:**
- Setze diese für **Production** Environment
- Optional auch für **Preview** wenn du E-Mails in Preview-Deployments testen willst

### 5. Deployment

Nach dem nächsten Deployment werden E-Mails automatisch über Resend versendet!

## Lokale Entwicklung (MailHog)

Für lokale Entwicklung verwenden wir **MailHog** - einen Test-SMTP-Server, der alle E-Mails abfängt.

### Installation & Start

```bash
# macOS
brew install mailhog
mailhog

# Linux
go get github.com/mailhog/MailHog
MailHog

# Docker
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

MailHog läuft auf:
- SMTP: `localhost:1025`
- Web UI: http://localhost:8025

### Environment Variables (.env.local)

```bash
EMAIL_SMTP_HOST=localhost
EMAIL_SMTP_PORT=1025
EMAIL_SMTP_USER=
EMAIL_SMTP_PASS=
EMAIL_FROM=noreply@findmytherapy.test
```

## E-Mail-Templates

Die App sendet folgende E-Mails:

### 1. Client Welcome Email
- **Trigger:** Klient registriert sich
- **Template:** `lib/email.ts:sendClientWelcomeEmail`
- **Enthält:** Willkommen, Login-Link, nächste Schritte

### 2. Therapist Welcome Email
- **Trigger:** Therapeut registriert sich
- **Template:** `lib/email.ts:sendTherapistWelcomeEmail`
- **Enthält:** Willkommen, Profil-Status, Dashboard-Link

### 3. Magic Link Email
- **Trigger:** User fordert Login-Link an
- **Template:** `lib/email.ts:sendMagicLinkEmail`
- **Enthält:** Einmal-Login-Link

## Troubleshooting

### E-Mails werden nicht versendet auf Vercel

1. Prüfe Environment Variables: `vercel env ls`
2. Prüfe Resend Dashboard → **Logs** für Fehler
3. Prüfe Vercel Function Logs für Errors

### E-Mails landen im Spam

1. Stelle sicher, dass DNS-Records korrekt sind (SPF, DKIM, DMARC)
2. Warte auf vollständige Domain-Verifizierung
3. Verwende eine verifizierte Domain (nicht Sandbox)

### Rate Limits

**Resend Free-Tier:**
- 100 E-Mails/Tag
- 3.000 E-Mails/Monat
- Bei Überschreitung: Upgrade auf bezahlten Plan

## Kosten

### Resend Pricing
- **Free:** 3.000 E-Mails/Monat (gut für Start)
- **Pro:** $20/Monat für 50.000 E-Mails
- **Business:** Ab $80/Monat

### Alternative: SendGrid
Falls Resend nicht passt, kannst du auch SendGrid verwenden:
- Größerer Free-Tier (100 E-Mails/Tag)
- Mehr Features (Marketing, Analytics)
- Komplexer zu konfigurieren

## Weitere Informationen

- [Resend Dokumentation](https://resend.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [MailHog GitHub](https://github.com/mailhog/MailHog)

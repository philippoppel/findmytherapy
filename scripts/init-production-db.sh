#!/bin/bash

# Production Database Initialisierung für Vercel
# Führe dieses Script nach dem ersten erfolgreichen Deployment aus

set -e

echo "🗄️  Klarthera Production Database Setup"
echo "======================================="
echo ""

# Farben
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Prüfe ob Vercel CLI installiert ist
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI nicht gefunden${NC}"
    echo "Installiere mit: npm i -g vercel"
    exit 1
fi

# Prüfe Login
if ! vercel whoami &> /dev/null; then
    echo -e "${RED}❌ Nicht bei Vercel eingeloggt${NC}"
    echo "Führe aus: vercel login"
    exit 1
fi

echo -e "${GREEN}✅ Vercel CLI bereit${NC}"
echo ""

# Environment Variables abrufen
echo "📥 Lade Production Environment Variables..."
if [ -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️  .env.production existiert bereits. Überschreiben?${NC}"
    read -p "Überschreiben? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Verwende existierende .env.production"
    else
        vercel env pull .env.production --yes
    fi
else
    vercel env pull .env.production --yes
fi

echo -e "${GREEN}✅ Environment Variables geladen${NC}"
echo ""

# Source Environment Variables
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ .env.production nicht gefunden${NC}"
    exit 1
fi

# DATABASE_URL extrahieren
export $(grep -v '^#' .env.production | grep DATABASE_URL | xargs)

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL nicht in .env.production gefunden${NC}"
    exit 1
fi

echo -e "${GREEN}✅ DATABASE_URL gefunden${NC}"
echo ""

# Prisma Client generieren
echo "🔧 Generiere Prisma Client..."
pnpm --filter @mental-health/db db:generate
echo -e "${GREEN}✅ Prisma Client generiert${NC}"
echo ""

# Datenbank-Schema pushen
echo "🚀 Pushe Database Schema..."
echo -e "${YELLOW}⚠️  Dies erstellt/aktualisiert Tabellen in der Production-Datenbank${NC}"
read -p "Fortfahren? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Schema-Push abgebrochen"
    exit 0
fi

DATABASE_URL="$DATABASE_URL" pnpm --filter @mental-health/db db:push

echo -e "${GREEN}✅ Schema erfolgreich gepusht${NC}"
echo ""

# Seed-Daten laden (optional)
echo "🌱 Seed-Daten laden?"
echo "   Dies erstellt Demo-Accounts und Test-Daten"
echo ""
echo "   Accounts die erstellt werden:"
echo "   - admin@mental-health-platform.com (Admin123!)"
echo "   - demo.client@example.com (Client123!)"
echo "   - 3x Pilot-Therapeuten"
echo ""
read -p "Seed-Daten laden? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Lade Seed-Daten..."
    DATABASE_URL="$DATABASE_URL" pnpm --filter @mental-health/db db:seed
    echo -e "${GREEN}✅ Seed-Daten geladen${NC}"
else
    echo "Seed-Daten übersprungen"
fi

echo ""
echo -e "${GREEN}🎉 Datenbank-Setup abgeschlossen!${NC}"
echo ""
echo "📊 Nächste Schritte:"
echo "  1. Teste die App auf Vercel"
echo "  2. Login mit Demo-Accounts:"
echo "     • Admin: admin@mental-health-platform.com / Admin123!"
echo "     • Client: demo.client@example.com / Client123!"
echo "     • Therapeut: dr.mueller@example.com / Therapist123!"
echo ""
echo "  3. Prüfe Datenbank mit Prisma Studio:"
echo "     DATABASE_URL=\"\$DATABASE_URL\" pnpm db:studio"
echo ""
echo "🔒 Sicherheitshinweis:"
echo "   Lösche .env.production nach dem Setup!"
echo "   Die Datei enthält sensitive Production-Credentials"
echo ""

# Cleanup-Warnung
echo -e "${YELLOW}⚠️  .env.production löschen?${NC}"
read -p "Jetzt löschen? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm .env.production
    echo -e "${GREEN}✅ .env.production gelöscht${NC}"
else
    echo -e "${YELLOW}⚠️  Denk daran, .env.production manuell zu löschen!${NC}"
fi

echo ""
echo "✨ Fertig! Viel Erfolg mit der Production-Deployment!"

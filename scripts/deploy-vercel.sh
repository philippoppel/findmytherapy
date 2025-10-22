#!/bin/bash

# Vercel Deployment Script für Klarthera
# Dieses Script automatisiert das Deployment-Setup

set -e

echo "🚀 FindMyTherapy Vercel Deployment Setup"
echo "========================================="
echo ""

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Prüfe ob Vercel CLI installiert ist
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI ist nicht installiert.${NC}"
    echo "Installiere mit: npm i -g vercel"
    exit 1
fi

echo -e "${GREEN}✅ Vercel CLI gefunden${NC}"
echo ""

# Login prüfen
echo "🔐 Prüfe Vercel Login-Status..."
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Nicht eingeloggt. Führe Login durch...${NC}"
    vercel login
else
    echo -e "${GREEN}✅ Eingeloggt als: $(vercel whoami)${NC}"
fi
echo ""

# Projekt linken oder neu erstellen
echo "🔗 Verknüpfe mit Vercel Projekt..."
if [ ! -f ".vercel/project.json" ]; then
    echo -e "${YELLOW}Kein Projekt gefunden. Erstelle neues Projekt...${NC}"
    vercel link
else
    echo -e "${GREEN}✅ Projekt bereits verknüpft${NC}"
fi
echo ""

# Environment Variables prüfen
echo "📋 Environment Variables..."
echo -e "${YELLOW}⚠️  Stelle sicher, dass folgende Env Vars im Vercel Dashboard gesetzt sind:${NC}"
echo ""
echo "  🔴 KRITISCH:"
echo "     - DATABASE_URL"
echo "     - NEXTAUTH_URL"
echo "     - NEXTAUTH_SECRET"
echo "     - EMAIL_FROM"
echo "     - EMAIL_PROVIDER_API_KEY"
echo "     - APP_BASE_URL"
echo ""
echo "  🟡 OPTIONAL:"
echo "     - STRIPE_SECRET_KEY"
echo "     - S3_ENDPOINT"
echo ""
echo "Siehe .env.production.example für alle Variablen"
echo ""

read -p "Sind alle Environment Variables in Vercel gesetzt? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Bitte setze zuerst alle Env Vars im Vercel Dashboard${NC}"
    echo "Gehe zu: https://vercel.com/dashboard → Dein Projekt → Settings → Environment Variables"
    exit 1
fi

echo -e "${GREEN}✅ Environment Variables bestätigt${NC}"
echo ""

# Build lokal testen (optional)
echo "🔨 Möchtest du den Build lokal testen? (empfohlen)"
read -p "Build testen? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Starte Build..."
    pnpm install
    pnpm prisma generate
    pnpm turbo build --filter=web
    echo -e "${GREEN}✅ Build erfolgreich${NC}"
fi
echo ""

# Deployment durchführen
echo "🚀 Bereit für Deployment!"
echo ""
echo "Wähle Deployment-Typ:"
echo "  1) Preview Deployment (Branch-Deploy)"
echo "  2) Production Deployment"
echo ""
read -p "Wähle Option (1/2): " -n 1 -r
echo

if [[ $REPLY == "1" ]]; then
    echo "Starte Preview Deployment..."
    vercel
elif [[ $REPLY == "2" ]]; then
    echo -e "${YELLOW}⚠️  Production Deployment wird gestartet...${NC}"
    read -p "Bist du sicher? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        vercel --prod
    else
        echo "Deployment abgebrochen"
        exit 0
    fi
else
    echo -e "${RED}Ungültige Option${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Deployment gestartet!${NC}"
echo ""
echo "📊 Nächste Schritte:"
echo "  1. Warte bis Deployment fertig ist"
echo "  2. Öffne die URL und teste die App"
echo "  3. Initialisiere die Datenbank:"
echo "     vercel env pull .env.production"
echo "     DATABASE_URL=\"<URL>\" pnpm prisma db push"
echo "     DATABASE_URL=\"<URL>\" pnpm db:seed"
echo ""
echo "📚 Weitere Infos: Siehe DEPLOYMENT.md"
echo ""
echo -e "${GREEN}🎉 Deployment abgeschlossen!${NC}"

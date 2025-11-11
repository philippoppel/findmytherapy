#!/bin/bash

# ============================================================================
# E2E Test Data Setup Runner
# ============================================================================
# Führt das SQL-Setup-Script gegen die Production-Datenbank aus
#
# Usage:
#   bash scripts/run-e2e-setup.sh
#
# Oder mit Custom DB URL:
#   DATABASE_URL="..." bash scripts/run-e2e-setup.sh
# ============================================================================

set -e  # Exit on error

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SQL_FILE="$SCRIPT_DIR/setup-e2e-test-data.sql"

echo "🚀 E2E Test Data Setup"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check if SQL file exists
if [ ! -f "$SQL_FILE" ]; then
  echo "❌ SQL file not found: $SQL_FILE"
  exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  DATABASE_URL not set!"
  echo ""
  echo "Optionen:"
  echo "  1) Export via: export DATABASE_URL='postgres://...'"
  echo "  2) Verwende Production DB aus .env.production"
  echo ""
  read -p "Production DB verwenden? (y/n) " -n 1 -r
  echo

  if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Load from .env.production
    if [ -f ".env.production" ]; then
      export $(grep -v '^#' .env.production | grep DATABASE_URL | xargs)
      echo "✅ DATABASE_URL geladen aus .env.production"
    else
      echo "❌ .env.production nicht gefunden!"
      echo "Führe zuerst aus: vercel env pull .env.production"
      exit 1
    fi
  else
    echo "Abgebrochen."
    exit 0
  fi
fi

# Show DB info (without password)
DB_INFO=$(echo "$DATABASE_URL" | sed -E 's/:([^@]+)@/:***@/')
echo "📊 Database: $DB_INFO"
echo ""

# Confirm
read -p "⚠️  Dies wird Test-Daten in der Production-DB erstellen. Fortfahren? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Abgebrochen."
  exit 0
fi

echo ""
echo "🔄 Führe Setup-Script aus..."
echo ""

# Run SQL script
cd "$SCRIPT_DIR/../packages/db"
npx prisma db execute --file "$SQL_FILE" --schema prisma/schema.prisma

echo ""
echo "✅ Test-Daten erfolgreich erstellt!"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📖 NÄCHSTE SCHRITTE:"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "1️⃣  Microsite testen:"
echo "   https://findmytherapy-qyva-d3510xutv-philipps-projects-0f51423d.vercel.app/t/dr-maria-mueller"
echo ""
echo "2️⃣  Vollständige Test-Anleitung:"
echo "   cat docs/E2E_TESTING_GUIDE.md"
echo ""
echo "3️⃣  Test-Daten anzeigen:"
echo "   DATABASE_URL=\"...\" node -e \"
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const profiles = await prisma.therapistProfile.findMany({
    where: { micrositeSlug: { not: null } },
    select: { displayName: true, micrositeSlug: true, micrositeStatus: true }
  });
  console.table(profiles);
  await prisma.\\\$disconnect();
})();
\""
echo ""

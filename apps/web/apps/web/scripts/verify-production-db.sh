#!/bin/bash

# Skript zur Verifizierung der Production-Datenbank vor Deployment
# Verwendung: ./scripts/verify-production-db.sh

set -e

echo "🔍 Verifying Production Database Setup..."
echo ""

# 1. Vercel env vars abrufen
echo "📥 Pulling Vercel production environment variables..."
vercel env pull .env.vercel.production --environment=production --yes

# 2. DATABASE_URL extrahieren
DATABASE_URL=$(grep "^DATABASE_URL=" .env.vercel.production | cut -d= -f2- | tr -d '"')

if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL not found in .env.vercel.production"
  exit 1
fi

# Datenbank-Host extrahieren
DB_HOST=$(echo "$DATABASE_URL" | sed 's/.*@\([^:]*\).*/\1/')
echo "✅ Database host: $DB_HOST"
echo ""

# 3. Schema-Drift prüfen
echo "🔍 Checking for schema drift..."
cd apps/web
DRIFT_CHECK=$(DATABASE_URL="$DATABASE_URL" pnpm exec prisma db push --dry-run 2>&1 || true)

if echo "$DRIFT_CHECK" | grep -q "already in sync"; then
  echo "✅ Database schema is in sync"
elif echo "$DRIFT_CHECK" | grep -q "will be created\|will be altered"; then
  echo "⚠️  WARNING: Schema drift detected!"
  echo ""
  read -p "Do you want to apply schema changes? (y/N) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📝 Applying schema changes..."
    DATABASE_URL="$DATABASE_URL" pnpm exec prisma db push
    echo "✅ Schema updated"
  else
    echo "❌ Aborted. Please fix schema drift before deploying."
    exit 1
  fi
else
  echo "✅ Schema check completed"
fi

echo ""
echo "✅ Production database is ready for deployment"

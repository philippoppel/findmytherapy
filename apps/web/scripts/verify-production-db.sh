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

# Datenbank-Host extrahieren (zur Anzeige)
DB_HOST=$(echo "$DATABASE_URL" | sed 's/.*@\([^:]*\).*/\1/')
echo "✅ Database host: $DB_HOST"
echo ""

# 3. Kritische Tabellen prüfen
echo "🔍 Checking critical tables..."

TABLES=("User" "TherapistProfile" "Match" "MatchingPreferences")
MISSING_TABLES=()

for TABLE in "${TABLES[@]}"; do
  RESULT=$(DATABASE_URL="$DATABASE_URL" npx prisma db execute --stdin <<EOF
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = '$TABLE';
EOF
)

  if echo "$RESULT" | grep -q "$TABLE"; then
    echo "  ✅ $TABLE exists"
  else
    echo "  ❌ $TABLE MISSING"
    MISSING_TABLES+=("$TABLE")
  fi
done

echo ""

# 4. Schema-Drift prüfen
echo "🔍 Checking for schema drift..."
DRIFT_CHECK=$(DATABASE_URL="$DATABASE_URL" npx prisma db push --dry-run 2>&1 || true)

if echo "$DRIFT_CHECK" | grep -q "already in sync"; then
  echo "✅ Database schema is in sync"
elif echo "$DRIFT_CHECK" | grep -q "will be created"; then
  echo "⚠️  WARNING: Schema drift detected!"
  echo "$DRIFT_CHECK"
  echo ""
  read -p "Do you want to apply schema changes? (y/N) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📝 Applying schema changes..."
    DATABASE_URL="$DATABASE_URL" npx prisma db push
    echo "✅ Schema updated"
  fi
else
  echo "ℹ️  Schema check output:"
  echo "$DRIFT_CHECK"
fi

echo ""

# 5. Zusammenfassung
if [ ${#MISSING_TABLES[@]} -eq 0 ]; then
  echo "✅ All critical tables exist"
  echo "✅ Production database is ready for deployment"
  exit 0
else
  echo "❌ Missing tables: ${MISSING_TABLES[*]}"
  echo ""
  echo "To fix, run:"
  echo "  DATABASE_URL=\"\$DATABASE_URL\" npx prisma db push"
  exit 1
fi

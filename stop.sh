#!/bin/bash

echo "🛑 Stopping Klarthera..."
echo ""

# Stop Next.js dev server
echo "Stopping Next.js server..."
pkill -f "next dev" 2>/dev/null || true

# Stop Docker services
echo "Stopping Docker services..."
docker-compose down

echo ""
echo "✅ All services stopped successfully!"

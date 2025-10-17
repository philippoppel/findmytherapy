#!/bin/bash

echo "🚀 Starting Klarthera..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

# Start Docker services
echo "📦 Starting Docker services (PostgreSQL, Redis, Mailhog)..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if services are healthy
if docker-compose ps | grep -q "healthy"; then
    echo "✅ Docker services are running"
else
    echo "⚠️  Services might not be fully ready yet"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Start the development server
echo ""
echo "🌐 Starting Next.js development server..."
echo ""
echo "=================================="
echo "🎉 Klarthera – Der klare Weg zur richtigen Hilfe."
echo "=================================="
echo ""
echo "📍 URLs:"
echo "   Frontend:    http://localhost:3000"
echo "   Mailhog:     http://localhost:8025"
echo "   Database:    localhost:5432"
echo "   Redis:       localhost:6379"
echo ""
echo "🔑 Test Accounts:"
echo "   Admin:       admin@mental-health-platform.com / Admin123!"
echo "   Client:      demo.client@example.com / Client123!"
echo "   Therapist:   dr.mueller@example.com / Therapist123!"
echo ""
echo "Press Ctrl+C to stop all services"
echo "=================================="
echo ""

# Start Next.js
cd apps/web && pnpm dev

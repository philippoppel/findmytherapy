.PHONY: help install dev build test clean docker-up docker-down db-setup

# Default target
help:
	@echo "Klarthera – Der klare Weg zur richtigen Hilfe. (Development Commands)"
	@echo ""
	@echo "Setup & Installation:"
	@echo "  make install       - Install all dependencies"
	@echo "  make setup         - Full setup (install + docker + db)"
	@echo ""
	@echo "Development:"
	@echo "  make dev           - Start development servers"
	@echo "  make dev-web       - Start only web app"
	@echo "  make dev-worker    - Start only worker"
	@echo ""
	@echo "Database:"
	@echo "  make db-setup      - Setup database (push + seed)"
	@echo "  make db-push       - Push Prisma schema"
	@echo "  make db-migrate    - Run migrations"
	@echo "  make db-seed       - Seed database"
	@echo "  make db-studio     - Open Prisma Studio"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-up     - Start Docker services"
	@echo "  make docker-down   - Stop Docker services"
	@echo "  make docker-logs   - Show Docker logs"
	@echo ""
	@echo "Testing:"
	@echo "  make test          - Run all tests"
	@echo "  make test-unit     - Run unit tests"
	@echo "  make test-e2e      - Run E2E tests"
	@echo "  make test-a11y     - Run accessibility tests"
	@echo ""
	@echo "Code Quality:"
	@echo "  make lint          - Run linting"
	@echo "  make format        - Format code"
	@echo "  make typecheck     - Run type checking"
	@echo ""
	@echo "Build & Deploy:"
	@echo "  make build         - Build for production"
	@echo "  make start         - Start production server"
	@echo ""
	@echo "Stripe:"
	@echo "  make stripe-listen - Forward Stripe webhooks to localhost"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean         - Clean build artifacts"
	@echo "  make reset         - Reset everything (clean + remove deps)"

# Installation
install:
	pnpm install

# Complete setup
setup: install docker-up
	@echo "Waiting for services to start..."
	@sleep 5
	$(MAKE) db-setup
	@echo ""
	@echo "✅ Setup complete!"
	@echo "Run 'make dev' to start the development server"

# Development
dev:
	pnpm dev

dev-web:
	pnpm --filter web dev

dev-worker:
	pnpm --filter worker dev

# Database
db-setup: db-push db-seed

db-push:
	pnpm db:push

db-migrate:
	pnpm db:migrate

db-seed:
	pnpm db:seed

db-studio:
	pnpm db:studio

# Docker
docker-up:
	docker-compose up -d
	@echo "Services starting..."
	@echo "PostgreSQL: localhost:5432"
	@echo "Redis: localhost:6379"
	@echo "Mailhog: localhost:8025"

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

docker-restart:
	$(MAKE) docker-down
	$(MAKE) docker-up

# Testing
test:
	pnpm test

test-unit:
	pnpm test

test-e2e:
	pnpm e2e

test-e2e-ui:
	pnpm e2e:ui

test-a11y:
	pnpm e2e -- --grep "a11y"

test-watch:
	pnpm test -- --watch

test-coverage:
	pnpm test -- --coverage

# Code Quality
lint:
	pnpm lint

format:
	pnpm format

typecheck:
	pnpm --filter web exec tsc --noEmit
	pnpm --filter worker exec tsc --noEmit

# Build
build:
	pnpm build

start:
	pnpm start

# Stripe
stripe-listen:
	pnpm stripe:listen

# Clean
clean:
	rm -rf apps/web/.next
	rm -rf apps/web/out
	rm -rf apps/worker/dist
	rm -rf **/coverage
	rm -rf **/test-results
	rm -rf **/.turbo
	find . -name "*.tsbuildinfo" -type f -delete

reset: clean
	rm -rf node_modules
	rm -rf **/node_modules
	rm -rf .pnpm-store

# Quick commands
quick-start: docker-up db-setup dev

restart-all: docker-restart db-setup dev

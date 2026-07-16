#!/bin/bash

echo "🚀 Starting Trace AI deployment..."

# Check environment variables
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL not set"
  exit 1
fi

echo "✅ Environment variables validated"

# Run migrations
echo "📦 Running database migrations..."
psql $DATABASE_URL < migrations/001_initial_schema.sql

echo "✅ Migrations complete"

# Start application
echo "🎉 Starting Trace AI application..."
npm start

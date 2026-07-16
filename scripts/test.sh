#!/bin/bash

echo "🧪 Running Trace AI tests..."

# Unit tests
echo "Running unit tests..."
npm run test

# Type checking
echo "Running type checking..."
npm run type-check

# Linting
echo "Running linter..."
npm run lint

# Build verification
echo "Verifying production build..."
npm run build

echo "✅ All tests passed!"

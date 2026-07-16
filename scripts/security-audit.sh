#!/bin/bash

echo "📊 Running security audit..."

# NPM audit
echo "Checking dependencies..."
npm audit

# OWASP dependency check (if installed)
if command -v dependency-check &> /dev/null; then
  echo "Running OWASP Dependency Check..."
  dependency-check --scan .
fi

# Snyk check (optional)
if command -v snyk &> /dev/null; then
  echo "Running Snyk security scan..."
  snyk test
fi

echo "✅ Security audit complete"

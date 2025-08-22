 
#!/usr/bin/env bash
set -euo pipefail

# Ensure dev env only
export RAILS_ENV=development
export RACK_ENV=development
export NODE_ENV=development
export RAILS_SERVE_STATIC_FILES=true
cat > /workspace/.env <<-EOL
RAILS_ENV=development
RACK_ENV=development
NODE_ENV=development
DISABLE_DATABASE_ENVIRONMENT_CHECK=1
RAILS_SERVE_STATIC_FILES=true
EOL
echo ".env written"

# Install missing gems, if necessary (git repos mainly)
echo "Checking if bundle install is needed…"
if bundle check > /dev/null 2>&1; then
  echo "  ✅ All gems already satisfied, skipping bundle install"
else
  echo "  ⏳ Some gems missing, running bundle install (this may take several minutes)…"
  bundle install
fi

echo "✅ All setup steps complete"
echo ""
echo "Development environment for deploy ready!"

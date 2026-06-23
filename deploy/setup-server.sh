#!/usr/bin/env bash
# Setup iniziale server (una tantum).
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/rifugiebivacchilugo}"
REPO_URL="${REPO_URL:-https://github.com/ghiro994/rifugio-connesso.git}"

if [[ ! -d "$APP_DIR/.git" ]]; then
  mkdir -p "$APP_DIR"
  git clone "$REPO_URL" "$APP_DIR"
fi

cd "$APP_DIR"

if [[ ! -f .env.prod ]]; then
  cp .env.prod.example .env.prod
  POSTGRES_PASSWORD=$(openssl rand -hex 16)
  JWT_SECRET=$(openssl rand -hex 32)
  sed -i "s/CAMBIA_QUESTA_PASSWORD_DB/$POSTGRES_PASSWORD/" .env.prod
  sed -i "s/CAMBIA_QUESTO_JWT_SECRET_LUNGO_E_CASUALE/$JWT_SECRET/" .env.prod
  echo "Creato .env.prod con secret generati."
fi

chmod +x deploy/deploy.sh
echo "Setup OK. Esegui: $APP_DIR/deploy/deploy.sh"

#!/usr/bin/env bash
# Deploy produzione — eseguire sulla macchina host.
# Uso: ./deploy/deploy.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/rifugiebivacchilugo}"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-rifugiebivacchilugo}"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env.prod}"

cd "$APP_DIR"

echo "==> git pull"
git fetch origin
git pull --ff-only origin main

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERRORE: $ENV_FILE mancante. Copia .env.prod.example e compila i secret."
  exit 1
fi

echo "==> docker compose build & up"
docker compose --env-file "$ENV_FILE" -f docker-compose.prod.yml -p "$COMPOSE_PROJECT_NAME" up -d --build --remove-orphans

echo "==> collegamento rete Traefik (se esiste)"
if docker network inspect traefik-net >/dev/null 2>&1; then
  docker network connect traefik-net rifugio_connesso_app 2>/dev/null || true
  docker network connect traefik-net rifugio_connesso_pgadmin 2>/dev/null || true
else
  echo "ATTENZIONE: rete traefik-net non trovata — collega manualmente il container app."
fi

echo "==> stato servizi"
docker compose --env-file "$ENV_FILE" -f docker-compose.prod.yml -p "$COMPOSE_PROJECT_NAME" ps

echo "Deploy completato."

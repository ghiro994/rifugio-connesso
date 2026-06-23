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

if compgen -G "$APP_DIR/scripts/migrate/output/*.csv" > /dev/null; then
  echo "==> import dati CSV (se DB vuoto)"
  docker cp "$APP_DIR/scripts/migrate/output/." rifugio_connesso_api:/import/
  docker compose --env-file "$ENV_FILE" -f docker-compose.prod.yml -p "$COMPOSE_PROJECT_NAME" \
    exec -T api sh -c "IMPORT_DIR=/import node dist/import-csv.js" || true
fi

echo "==> collegamento rete Traefik (se esiste)"
for NET in traefik-net proxy; do
  if docker network inspect "$NET" >/dev/null 2>&1; then
    docker network connect "$NET" rifugio_connesso_app 2>/dev/null || true
    docker network connect "$NET" rifugio_connesso_pgadmin 2>/dev/null || true
    echo "Collegato a rete: $NET"
    break
  fi
done

echo "==> stato servizi"
docker compose --env-file "$ENV_FILE" -f docker-compose.prod.yml -p "$COMPOSE_PROJECT_NAME" ps

echo "Deploy completato."

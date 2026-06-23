"""Minimal pgAdmin init — server pre-configurato via PGADMIN_SERVER_JSON_FILE."""
import time

# Attende che pgAdmin sia pronto; la config servers.json viene applicata all'avvio.
time.sleep(2)

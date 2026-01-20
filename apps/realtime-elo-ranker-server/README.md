Instructions pour `realtime-elo-ranker-server`

Installation des dépendances (depuis la racine du workspace):

```bash
cd apps/realtime-elo-ranker-server
pnpm install
```

Démarrer le serveur en local:

```bash
pnpm start
```

Le serveur expose les routes:
- `POST /api/player` -> { id, rank? }
- `POST /api/match` -> { winner, loser, draw? }
- `GET /api/ranking` -> liste triée
- `GET /api/ranking/events` -> SSE pour mises à jour

Simulateur local (optionnel):

```bash
node simulate.js
```

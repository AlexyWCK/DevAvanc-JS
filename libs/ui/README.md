# Librairie de composants graphiques

Ce dossier contient les composants graphiques React réutilisables pour le client.

# Compilation

Pour compiler la librairie, exécutez la commande suivante à la racine de l'espace de travail :

```bash
pnpm run libs:ui:build
```

## Ressources exposées

Les ressources exposées par la librairie sont les suivantes :

- Les sources JS dans le dossier `dist` au format ESNext
- Les styles CSS dans le dossier `dist` au format CSS dans un fichier unique `styles.css`

# Utilisation

Pour utiliser les composants graphiques dans le client, importez-les depuis la librairie :

```javascript
import { MatchForm } from '@realtime-elo-ranker/libs/ui';
```

Les styles CSS doivent être importés dans le fichier racine du client (`layout` ou composant racine) :

```javascript
import '@realtime-elo-ranker/libs/ui/styles';
```

La compilation des styles CSS doit être effectuée en avance pour les rendre disponibles.

# Composants


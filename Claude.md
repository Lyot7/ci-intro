# CI/CD Configuration - ci-intro

## Vue d'ensemble
Configuration d'une chaîne CI/CD pour un projet Node.js avec déploiement Docker sur Scaleway Container Registry. Ce projet sert d'atelier pratique pour apprendre les concepts CI/CD.

## Stack Technique
- **Projet** : **mtech-node/** - Node.js avec Jest pour les tests
- **CI/CD** : GitHub Actions
- **VCS** : GitHub
- **Conteneurisation** : Docker
- **Registry** : Scaleway Container Registry
- **Qualité du code** : SonarQube (optionnel - à configurer)
- **Gestion de projet** : YouTrack (optionnel - à configurer)

---

## 1. Configuration GitHub Actions

### Pipeline CI/CD
Le workflow `.github/workflows/ci.yml` contient les jobs suivants :

#### Job 1: test-node
**Tests unitaires avec couverture de code**

Étapes :
1. **Checkout code** : Récupération du code source
2. **Setup Node.js** : Installation de Node.js v20 avec cache npm
3. **Install dependencies** : `npm ci` dans mtech-node/
4. **Run tests with coverage** : `npm run test:coverage`
5. **Upload coverage** : Upload des rapports de couverture comme artifacts (7 jours de rétention)

#### Job 2: build-status
**Vérification du statut global du build**

- Dépend de : `test-node`
- S'exécute toujours (`if: always()`)
- Affiche un résumé du statut des tests

#### Job 3: deploy
**Déploiement Docker vers Scaleway Container Registry**

**Conditions de déclenchement** :
- Branche : `main` uniquement
- Commit message contient : `#deploy`
- Tests réussis

**Étapes** :
1. **Checkout code** : Récupération du code source
2. **Set up Docker Buildx** : Configuration de Docker pour le build multi-plateforme
3. **Log in to Scaleway** : Connexion au registre Scaleway avec credentials stockés dans GitHub Secrets
4. **Build and push** : Construction de l'image Docker et push vers `rg.fr-par.scw.cloud/mds-m2-dfs/mtech-node:latest`
5. **Deployment summary** : Affichage d'un résumé du déploiement

### Triggers
- **Push** : Sur toutes les branches
- **Pull Request** : Sur toutes les PRs
- **Deploy** : Uniquement sur `main` avec commit contenant `#deploy`

---

## 2. Configuration Docker

### Dockerfile (mtech-node/Dockerfile)

**Image de base** : `node:20-alpine` (légère et sécurisée)

**Architecture** :
1. Copie des fichiers `package*.json`
2. Installation des dépendances de production : `npm ci --only=production`
3. Copie du code source (app.js, test/, jest.config.js)
4. Installation de toutes les dépendances (dev inclus) : `npm ci`
5. Création d'un utilisateur non-root `nodejs` (UID 1001)
6. Switch vers l'utilisateur `nodejs`
7. **CMD par défaut** : `npm test`

### .dockerignore (mtech-node/.dockerignore)

Exclusions pour optimiser la taille de l'image :
- `node_modules/` : Réinstallés dans le container
- `coverage/` : Fichiers générés localement
- `.git/`, `.github/` : Non nécessaires dans l'image
- Fichiers IDE (`.vscode/`, `.idea/`)
- Documentation (`*.md`)

---

## 3. Scaleway Container Registry

### Configuration

**Endpoint** : `rg.fr-par.scw.cloud/mds-m2-dfs`

**Namespace** : `mds-m2-dfs` (région Paris)

**Image** : `mtech-node:latest`

### Authentification

Les credentials Scaleway doivent être configurés dans les **GitHub Secrets** :

1. Aller dans `Settings` → `Secrets and variables` → `Actions`
2. Ajouter les secrets suivants :
   - **Name** : `SCW_SECRET_KEY`
   - **Value** : La clé secrète Scaleway

**Note** : Le login Scaleway utilise toujours le username `nologin` avec la clé secrète comme password.

### Commandes Docker Utiles

**Tester l'image localement** :
```bash
# Build de l'image
cd mtech-node
docker build -t mtech-node:local .

# Exécuter les tests (CMD par défaut)
docker run --rm mtech-node:local

# Shell interactif dans le container
docker run --rm -it mtech-node:local sh

# Pull depuis Scaleway (après déploiement)
docker login rg.fr-par.scw.cloud/mds-m2-dfs -u nologin -p <SECRET_KEY>
docker pull rg.fr-par.scw.cloud/mds-m2-dfs/mtech-node:latest
docker run --rm rg.fr-par.scw.cloud/mds-m2-dfs/mtech-node:latest
```

---

## 4. Workflow de Développement

### Développement Standard

1. **Créer une branche** :
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```

2. **Développer et tester localement** :
   ```bash
   cd mtech-node
   npm test
   npm run test:coverage
   ```

3. **Commit et push** :
   ```bash
   git add .
   git commit -m "Ajout de la nouvelle fonctionnalité"
   git push origin feature/ma-nouvelle-fonctionnalite
   ```

4. **Créer une Pull Request** sur GitHub
5. Les tests s'exécutent automatiquement via GitHub Actions
6. **Merge** après revue et tests réussis

### Workflow de Déploiement

Pour déclencher un déploiement Docker :

1. **S'assurer que les tests passent** sur `main`
2. **Créer un commit avec `#deploy`** dans le message :
   ```bash
   git commit -m "Release v1.2.0 #deploy"
   git push origin main
   ```
3. GitHub Actions va :
   - ✅ Exécuter les tests
   - ✅ Construire l'image Docker
   - ✅ Se connecter à Scaleway
   - ✅ Pusher l'image vers le registre
4. L'image est disponible à : `rg.fr-par.scw.cloud/mds-m2-dfs/mtech-node:latest`

---

## 5. Structure du Projet

```
ci-intro/
├── .github/
│   └── workflows/
│       └── ci.yml              # Workflow GitHub Actions (tests + deploy)
├── mtech-node/                 # Application Node.js
│   ├── app.js                  # Code source (fonctions de calcul)
│   ├── test/                   # Tests Jest
│   ├── package.json            # Dépendances npm
│   ├── package-lock.json       # Lock file npm
│   ├── jest.config.js          # Configuration Jest
│   ├── Dockerfile              # Définition de l'image Docker
│   ├── .dockerignore           # Exclusions Docker
│   ├── coverage/               # Rapports de couverture (généré)
│   └── node_modules/           # Dépendances (généré)
├── CLAUDE.md                   # Ce fichier - Documentation CI/CD
├── README.md                   # Documentation du projet
└── .gitignore                  # Exclusions Git
```

---

## 6. Tests et Couverture de Code

### Configuration Jest (mtech-node/jest.config.js)

```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['app.js'],
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: ['**/test/**/*.test.js']
};
```

### Scripts npm (mtech-node/package.json)

```json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  }
}
```

### Commandes

```bash
cd mtech-node

# Exécuter les tests
npm test

# Tests avec couverture
npm run test:coverage

# Tests en mode watch (développement)
npm run test:watch
```

---

## 7. Intégration SonarQube (Optionnel)

### Configuration du Projet

Pour activer l'analyse SonarQube, créer `sonar-project.properties` à la racine :

```properties
# Project identification
sonar.projectKey=ci-intro
sonar.projectName=CI Intro - Node.js
sonar.projectVersion=1.0.0

# Source configuration
sonar.sources=mtech-node/app.js
sonar.tests=mtech-node/test
sonar.test.inclusions=**/*.test.js

# Coverage report
sonar.javascript.lcov.reportPaths=mtech-node/coverage/lcov.info

# Exclusions
sonar.exclusions=**/node_modules/**,**/coverage/**,**/.DS_Store

# Encoding
sonar.sourceEncoding=UTF-8
```

### Intégration GitHub Actions

Ajouter un job SonarQube dans `.github/workflows/ci.yml` :

```yaml
sonarqube:
  name: SonarQube Analysis
  runs-on: ubuntu-latest
  needs: [test-node]

  steps:
    - name: Checkout code
      uses: actions/checkout@v4
      with:
        fetch-depth: 0

    - name: SonarQube Scan
      uses: sonarsource/sonarqube-scan-action@master
      env:
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

**Secrets à configurer** :
- `SONAR_TOKEN` : Token d'authentification SonarQube
- `SONAR_HOST_URL` : URL du serveur SonarQube

---

## 8. Intégration YouTrack (Optionnel)

### Format des Commits

Pour lier automatiquement les commits aux issues YouTrack :

```
[PROJECT-123] Description du commit

Détails supplémentaires si nécessaire
```

### Workflow YouTrack Suggéré

1. **Création d'issue** → État : `Open`
2. **Début du développement** → État : `In Progress`
3. **Commit avec référence** → Commit lié automatiquement à l'issue
4. **Pull Request créée** → État : `Code Review`
5. **Tests GitHub Actions réussis** → État : `Testing`
6. **Merge dans main** → État : `Done`

---

## 9. Branch Protection Rules

### Recommandations pour la branche `main`

Dans GitHub : `Settings` → `Branches` → `Add rule`

**Configuration suggérée** :
- ✅ **Require a pull request before merging**
  - Require approvals: 1
- ✅ **Require status checks to pass before merging**
  - Status checks: `test-node`, `build-status`
- ✅ **Require branches to be up to date before merging**
- ✅ **Do not allow bypassing the above settings**

---

## 10. Variables d'Environnement et Secrets

### GitHub Secrets Requis

| Secret Name       | Description                              | Exemple                             |
|------------------|------------------------------------------|-------------------------------------|
| `SCW_SECRET_KEY` | Clé secrète Scaleway Container Registry  | `804838a0-5492-46fa-8037-...`      |

### GitHub Secrets Optionnels (selon extensions)

| Secret Name        | Description                    | Utilisation          |
|-------------------|--------------------------------|----------------------|
| `SONAR_TOKEN`     | Token SonarQube                | Analyse de code      |
| `SONAR_HOST_URL`  | URL du serveur SonarQube       | Analyse de code      |
| `DISCORD_WEBHOOK` | Webhook Discord                | Notifications        |

---

## 11. Monitoring et Métriques

### Métriques à Surveiller

**GitHub Actions** :
- Temps de build moyen
- Taux de succès des builds
- Fréquence des commits/PRs
- Temps d'exécution des tests

**Docker** :
- Taille de l'image
- Temps de build de l'image
- Nombre de layers
- Fréquence des déploiements

**SonarQube** (si configuré) :
- Couverture de code (≥ 80% recommandé)
- Dette technique
- Bugs et vulnérabilités
- Code smells

### Logs à Conserver

- Build logs (GitHub Actions)
- Deployment logs
- Test results
- Coverage reports (artifacts 7 jours)

---

## 12. Troubleshooting

### Les tests échouent sur GitHub Actions mais passent localement

**Causes possibles** :
- Versions Node.js différentes
- Dépendances manquantes dans `package-lock.json`
- Variables d'environnement manquantes

**Solutions** :
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm test

# Vérifier la version Node.js
node --version  # Doit être v20
```

### Le déploiement Docker ne se déclenche pas

**Vérifications** :
1. Le commit est-il sur la branche `main` ?
2. Le message contient-il `#deploy` ?
3. Les tests sont-ils passés ?
4. Le secret `SCW_SECRET_KEY` est-il configuré dans GitHub ?

**Debug** :
- Consulter les logs GitHub Actions (onglet "Actions")
- Vérifier la condition `if:` du job `deploy`

### Erreur de connexion au registre Scaleway

**Erreur** : `denied: access forbidden`

**Solutions** :
1. Vérifier que le secret `SCW_SECRET_KEY` est correct
2. Vérifier que la clé Scaleway a les permissions nécessaires
3. Vérifier que le namespace `mds-m2-dfs` existe

---

## 13. Améliorations Futures

### Court terme
- [ ] Ajouter des badges de build dans le README
- [ ] Configurer des notifications Discord
- [ ] Ajouter un versioning sémantique (git tags)

### Moyen terme
- [ ] Intégrer SonarQube pour l'analyse de code
- [ ] Mettre en place un environnement de staging
- [ ] Ajouter des tests d'intégration

### Long terme
- [ ] Déploiement automatique sur un orchestrateur (Kubernetes, Docker Swarm)
- [ ] Monitoring avec Prometheus + Grafana
- [ ] Alertes automatiques sur échec de build

---

## 14. Ressources Utiles

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Scaleway Container Registry](https://www.scaleway.com/en/docs/containers/container-registry/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [SonarQube Documentation](https://docs.sonarqube.org/latest/)
- [GitHub Status Checks API](https://docs.github.com/en/rest/checks)

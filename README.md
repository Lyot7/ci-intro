# CI/CD Introduction - Projet Node.js avec Docker

[![CI Status](https://github.com/Lyot7/ci-intro/workflows/CI%20-%20Tests%20&%20Build/badge.svg)](https://github.com/Lyot7/ci-intro/actions)

Projet d'atelier pratique pour apprendre les concepts de CI/CD avec GitHub Actions, Docker et Scaleway Container Registry.

## Vue d'ensemble

Ce projet démontre une chaîne CI/CD complète :
- **Tests automatisés** avec Jest et couverture de code
- **Analyse de code** avec SonarCloud Quality Gate
- **Notifications** Slack à chaque étape du pipeline
- **Build Docker** automatisé
- **Déploiement** sur Scaleway Container Registry
- **Intégration continue** via GitHub Actions

## Stack Technique

- **Langage** : Node.js 20
- **Tests** : Jest
- **CI/CD** : GitHub Actions
- **Analyse de code** : SonarCloud
- **Notifications** : Slack
- **Conteneurisation** : Docker
- **Registry** : Scaleway Container Registry
- **VCS** : GitHub

## Structure du Projet



```
ci-intro/
├── .github/
│   └── workflows/
│       └── ci.yml           # Pipeline GitHub Actions
├── mtech-node/              # Application Node.js
│   ├── app.js               # Fonctions de calcul
│   ├── test/                # Tests Jest
│   ├── package.json         # Dépendances npm
│   ├── jest.config.js       # Configuration Jest
│   ├── Dockerfile           # Image Docker
│   └── .dockerignore        # Exclusions Docker
├── CLAUDE.md                # Documentation complète CI/CD
└── README.md                # Ce fichier
```

## Démarrage Rapide

### Prérequis

- Node.js 20 ou supérieur
- npm
- Docker (optionnel, pour tester localement)
- Git

### Installation et Tests

```bash
# Cloner le repository
git clone https://github.com/Lyot7/ci-intro.git
cd ci-intro

# Installer les dépendances
cd mtech-node
npm install

# Lancer les tests
npm test

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

### Test Docker Local

```bash
# Build de l'image Docker
cd mtech-node
docker build -t mtech-node:local .

# Exécuter les tests dans le container
docker run --rm mtech-node:local

# Shell interactif
docker run --rm -it mtech-node:local sh
```

## Workflow CI/CD

### 1. Développement Standard

```bash
# Créer une branche
git checkout -b feature/ma-fonctionnalite

# Développer et tester
npm test

# Commit et push
git add .
git commit -m "Ajout de ma fonctionnalité"
git push origin feature/ma-fonctionnalite
```

**Résultat** : GitHub Actions exécute automatiquement les tests sur la PR.

### 2. Déploiement Docker

Pour déclencher un déploiement vers Scaleway Container Registry :

```bash
# S'assurer d'être sur main
git checkout main
git pull

# Créer un commit avec #deploy
git commit -m "Release v1.2.0 #deploy"
git push origin main
```

**Résultat** : GitHub Actions :
1. Exécute les tests
2. Vérifie le statut du build
3. Analyse le code avec SonarCloud Quality Gate (sur `main` uniquement)
4. Construit l'image Docker
5. Se connecte à Scaleway
6. Push l'image : `rg.fr-par.scw.cloud/mds-m2-dfs/bouquerel-leroy-lambaraa:latest`
7. Envoie des notifications Slack à chaque étape

## Configuration Secrets GitHub

### Secrets Requis

Pour que le pipeline fonctionne, configurez les secrets suivants dans GitHub :

1. Aller dans **Settings** → **Secrets and variables** → **Actions**
2. Cliquer sur **New repository secret**
3. Créer les secrets :

   **Pour le déploiement Scaleway** :
   - **Name** : `SCW_SECRET_KEY`
   - **Value** : Votre clé secrète Scaleway

   **Pour l'analyse SonarCloud** :
   - **Name** : `SONAR_TOKEN`
   - **Value** : Votre token SonarCloud

   **Pour les notifications Slack** :
   - **Name** : `SLACK_WEBHOOK_URL`
   - **Value** : Votre URL de webhook Slack

### Tester le Déploiement

Après le déploiement, vous pouvez pull l'image depuis Scaleway :

```bash
# Login au registre Scaleway
docker login rg.fr-par.scw.cloud/mds-m2-dfs -u nologin -p YOUR_SECRET_KEY

# Pull de l'image
docker pull rg.fr-par.scw.cloud/mds-m2-dfs/bouquerel-leroy-lambaraa:latest

# Exécuter l'image
docker run --rm rg.fr-par.scw.cloud/mds-m2-dfs/bouquerel-leroy-lambaraa:latest
```

## Pipeline GitHub Actions

### Jobs

1. **test-node** : Exécute les tests Jest avec couverture + notification Slack
2. **build-status** : Vérifie le statut global du build + notification Slack
3. **sonarqube** : Analyse de code avec SonarCloud Quality Gate (uniquement sur `main`) + notification Slack
4. **deploy** : Déploie vers Scaleway (uniquement si `#deploy` sur `main`) + notification Slack

### Déclencheurs

- **push** : S'exécute sur tous les push de toutes les branches
- **pull_request** : S'exécute sur toutes les pull requests

### Conditions Spéciales

**Job `sonarqube`** :
- ✅ Branche = `main` uniquement
- ✅ Tests réussis
- ⚡ Télécharge les rapports de couverture
- 🔍 Vérifie la Quality Gate SonarCloud

**Job `deploy`** :
- ✅ Branche = `main`
- ✅ Commit message contient `#deploy`
- ✅ Tests réussis
- ✅ Build status OK
- ✅ Quality Gate SonarCloud passée

## Métriques de Qualité

- **Test Coverage** : Rapports automatiques uploadés comme artifacts (7 jours de rétention)
- **SonarCloud Quality Gate** : Analyse automatique de la qualité du code sur `main`
- **Notifications Slack** : Notifications en temps réel pour chaque job (tests, build, SonarCloud, déploiement)
- **Build Time** : Visible dans les logs GitHub Actions
- **Docker Image Size** : Optimisée avec Alpine Linux et cache GitHub Actions

## Activité Pratique : Erreur et Correction

### Objectif
Simuler un bug et observer le pipeline CI/CD.

### Étapes

1. **Créer une branche de test**
   ```bash
   git checkout -b test/bug-simulation
   ```

2. **Modifier un test pour qu'il échoue**

   Éditer `mtech-node/test/app.test.js` et changer une assertion :
   ```javascript
   test('adds 2 + 3 to equal 5', () => {
     expect(add(2, 3)).toBe(999); // Valeur incorrecte
   });
   ```

3. **Commit et push**
   ```bash
   git add mtech-node/test/app.test.js
   git commit -m "Test avec bug volontaire"
   git push origin test/bug-simulation
   ```

4. **Créer une Pull Request** sur GitHub
   - Observer l'échec des tests dans GitHub Actions
   - Consulter les logs d'erreur

5. **Corriger le test**
   ```javascript
   test('adds 2 + 3 to equal 5', () => {
     expect(add(2, 3)).toBe(5); // Valeur correcte
   });
   ```

6. **Commit la correction**
   ```bash
   git add mtech-node/test/app.test.js
   git commit -m "Correction du test #Fixed"
   git push origin test/bug-simulation
   ```

7. **Observer le build réussir** ✅

## Intégrations Actives

### SonarCloud ✅
L'analyse de code SonarCloud est **active** et s'exécute automatiquement sur la branche `main`.
- 🔍 Quality Gate automatique
- 📊 Rapports de couverture de code
- 🛡️ Détection des bugs et vulnérabilités
- 📈 Analyse de la dette technique

**Configuration** :
- **Project Key** : `Lyot7_ci-intro`
- **Organization** : `lyot7`
- **Host** : `https://sonarcloud.io`
- **Coverage** : Utilise les rapports LCOV générés par Jest

### Notifications Slack ✅
Les notifications Slack sont **actives** pour tous les jobs :
- ✅ Succès/échec des tests
- ✅ Statut du build
- ✅ Résultat SonarCloud Quality Gate
- ✅ Déploiements réussis ou échoués

**Informations dans les notifications** :
- Repository et branche
- Auteur du commit
- Message du commit
- Liens directs vers le workflow et le commit
- Statut visuel (✅ succès, ❌ échec, 🚀 déploiement)

### Intégrations Optionnelles

#### YouTrack
Pour lier les commits aux issues YouTrack, utilisez le format :
```
[PROJECT-123] Description du commit
```

## Troubleshooting

### Les tests échouent sur GitHub Actions mais passent localement

**Solution** :
```bash
# Vérifier la version Node.js
node --version  # Doit être v20

# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm test
```

### Le déploiement ne se déclenche pas

**Vérifications** :
1. Le commit est sur `main` ?
2. Le message contient `#deploy` ?
3. Les tests sont passés ?
4. La Quality Gate SonarCloud a réussi ?
5. Les secrets `SCW_SECRET_KEY`, `SONAR_TOKEN` et `SLACK_WEBHOOK_URL` sont configurés ?

**Debug** : Consulter les logs dans l'onglet **Actions** de GitHub.

### SonarCloud Quality Gate échoue

**Causes possibles** :
- Couverture de code insuffisante
- Bugs détectés dans le code
- Code smells ou dette technique
- Vulnérabilités de sécurité

**Solution** : Consultez le rapport SonarCloud pour identifier et corriger les problèmes.

### Les notifications Slack ne fonctionnent pas

**Vérifications** :
1. Le secret `SLACK_WEBHOOK_URL` est correctement configuré ?
2. Le webhook Slack est actif dans votre workspace ?
3. Les permissions du webhook sont correctes ?

## Documentation Complète

Consultez **CLAUDE.md** pour :
- Configuration détaillée de GitHub Actions
- Architecture Docker
- Guide complet Scaleway
- Configuration SonarCloud avancée
- Intégrations Slack et YouTrack
- Troubleshooting approfondi
- Variables d'environnement et secrets
- Monitoring et métriques

## Ressources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Scaleway Container Registry](https://www.scaleway.com/en/docs/containers/container-registry/)
- [Jest Documentation](https://jestjs.io/)
- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [Slack Incoming Webhooks](https://api.slack.com/messaging/webhooks)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est à but éducatif dans le cadre d'un atelier CI/CD.

---

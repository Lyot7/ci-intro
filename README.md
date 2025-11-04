# CI/CD Introduction - Projet Node.js avec Docker

[![CI Status](https://github.com/YOUR_USERNAME/ci-intro/workflows/CI%20-%20Tests%20&%20Build/badge.svg)](https://github.com/YOUR_USERNAME/ci-intro/actions)

Projet d'atelier pratique pour apprendre les concepts de CI/CD avec GitHub Actions, Docker et Scaleway Container Registry.

## Vue d'ensemble

Ce projet démontre une chaîne CI/CD complète :
- **Tests automatisés** avec Jest et couverture de code
- **Build Docker** automatisé
- **Déploiement** sur Scaleway Container Registry
- **Intégration continue** via GitHub Actions

## Stack Technique

- **Langage** : Node.js 20
- **Tests** : Jest
- **CI/CD** : GitHub Actions
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
git clone https://github.com/YOUR_USERNAME/ci-intro.git
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
2. Construit l'image Docker
3. Se connecte à Scaleway
4. Push l'image : `rg.fr-par.scw.cloud/mds-m2-dfs/mtech-node:latest`

## Configuration Scaleway

### Secrets GitHub Requis

Pour que le déploiement fonctionne, configurez le secret suivant dans GitHub :

1. Aller dans **Settings** → **Secrets and variables** → **Actions**
2. Cliquer sur **New repository secret**
3. Créer le secret :
   - **Name** : `SCW_SECRET_KEY`
   - **Value** : Votre clé secrète Scaleway

### Tester le Déploiement

Après le déploiement, vous pouvez pull l'image depuis Scaleway :

```bash
# Login au registre Scaleway
docker login rg.fr-par.scw.cloud/mds-m2-dfs -u nologin -p YOUR_SECRET_KEY

# Pull de l'image
docker pull rg.fr-par.scw.cloud/mds-m2-dfs/mtech-node:latest

# Exécuter l'image
docker run --rm rg.fr-par.scw.cloud/mds-m2-dfs/mtech-node:latest
```

## Pipeline GitHub Actions

### Jobs

1. **test-node** : Exécute les tests Jest avec couverture
2. **build-status** : Vérifie le statut global du build
3. **deploy** : Déploie vers Scaleway (uniquement si `#deploy` sur `main`)

### Conditions de Déploiement

Le job `deploy` s'exécute uniquement si :
- ✅ Branche = `main`
- ✅ Commit message contient `#deploy`
- ✅ Tests réussis

## Métriques de Qualité

- **Test Coverage** : Rapports automatiques uploadés comme artifacts
- **Build Time** : Visible dans les logs GitHub Actions
- **Docker Image Size** : Optimisée avec Alpine Linux

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

## Intégrations Optionnelles

### SonarQube
Pour activer l'analyse de code avec SonarQube, consultez la section 7 de `CLAUDE.md`.

### YouTrack
Pour lier les commits aux issues YouTrack, utilisez le format :
```
[PROJECT-123] Description du commit
```

### Notifications Discord
Configurez un webhook Discord pour recevoir des notifications de build. Voir section 5 de `CLAUDE.md`.

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
4. Le secret `SCW_SECRET_KEY` est configuré ?

**Debug** : Consulter les logs dans l'onglet **Actions** de GitHub.

## Documentation Complète

Consultez **CLAUDE.md** pour :
- Configuration détaillée de GitHub Actions
- Architecture Docker
- Guide complet Scaleway
- Intégrations avancées (SonarQube, YouTrack, Discord)
- Troubleshooting approfondi

## Ressources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Scaleway Container Registry](https://www.scaleway.com/en/docs/containers/container-registry/)
- [Jest Documentation](https://jestjs.io/)
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

**Note** : Remplacez `YOUR_USERNAME` par votre nom d'utilisateur GitHub dans les URLs.

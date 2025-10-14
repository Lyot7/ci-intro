# CI/CD Configuration - ci-intro

## Vue d'ensemble
Configuration complète d'une chaîne CI/CD pour un projet multi-langages (Node.js + PHP) avec intégration YouTrack, TeamCity, GitHub et Discord. Ce projet sert d'atelier pratique pour apprendre les concepts CI/CD.

## Stack Technique
- **Projets** :
  - **mtech-node/** : Node.js avec Jest pour les tests
  - **mtech-php/** : PHP avec PHPUnit pour les tests
- **CI/CD** : TeamCity
- **Gestion de projet** : YouTrack
- **VCS** : GitHub
- **Qualité du code** : SonarQube
- **Notifications** : Discord

---

## 1. Configuration TeamCity

### Pipeline CI/CD
Créer une configuration de build TeamCity avec les étapes suivantes pour les deux projets :

#### Build Steps - Projet Node.js (mtech-node)

1. **Install Dependencies (Node.js)**
   ```bash
   cd mtech-node
   npm ci
   ```

2. **Run Tests with Coverage (Node.js)**
   ```bash
   cd mtech-node
   npm test -- --coverage
   ```

#### Build Steps - Projet PHP (mtech-php)

3. **Install Dependencies (PHP)**
   ```bash
   cd mtech-php
   composer install --no-interaction --prefer-dist
   ```

4. **Run Tests with Coverage (PHP)**
   ```bash
   cd mtech-php
   ./vendor/bin/phpunit --coverage-clover coverage/clover.xml --coverage-html coverage/html
   ```

#### Build Steps - Analyse Globale

5. **SonarQube Analysis**
   ```bash
   sonar-scanner \
     -Dsonar.projectKey=ci-intro \
     -Dsonar.sources=. \
     -Dsonar.host.url=%sonar.host.url% \
     -Dsonar.token=%sonar.token%
   ```

#### VCS Triggers
- Déclencher sur chaque commit sur `main`
- Déclencher sur chaque Pull Request

#### Artifacts
- Coverage reports : `mtech-node/coverage/` et `mtech-php/coverage/`
- Test reports : résultats Jest et PHPUnit
- Logs de build

---

## 2. Analyse de Code avec SonarQube

### Configuration du Projet SonarQube

#### Création du Projet
1. Se connecter à SonarQube
2. Créer un nouveau projet : `ci-intro`
3. Générer un token d'authentification
4. Configurer le Quality Gate

#### Quality Gate Personnalisé
Critères de qualité à respecter :
- **Coverage** : ≥ 80%
- **Duplications** : ≤ 3%
- **Maintainability Rating** : A
- **Reliability Rating** : A
- **Security Rating** : A
- **Security Hotspots Reviewed** : 100%

### Configuration du Projet

#### sonar-project.properties
Créer à la racine du projet :
```properties
# Project identification
sonar.projectKey=ci-intro
sonar.projectName=CI Intro - Multi-langages
sonar.projectVersion=1.0.0

# Multi-module structure
sonar.modules=mtech-node,mtech-php

# Node.js module configuration
mtech-node.sonar.projectName=MTech Node.js
mtech-node.sonar.sources=app.js
mtech-node.sonar.tests=test
mtech-node.sonar.test.inclusions=**/*.test.js
mtech-node.sonar.javascript.lcov.reportPaths=coverage/lcov.info

# PHP module configuration
mtech-php.sonar.projectName=MTech PHP
mtech-php.sonar.sources=src
mtech-php.sonar.tests=tests
mtech-php.sonar.test.inclusions=**/*Test.php
mtech-php.sonar.php.coverage.reportPaths=coverage/clover.xml

# Global exclusions
sonar.exclusions=**/node_modules/**,**/vendor/**,**/coverage/**,**/.DS_Store

# Encoding
sonar.sourceEncoding=UTF-8
```

#### Configuration mtech-node/package.json
Ajouter les scripts de test avec couverture :
```json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}
```

#### Configuration mtech-php/composer.json
Les scripts sont déjà configurés :
```json
{
  "scripts": {
    "test": "phpunit"
  }
}
```

### Intégration TeamCity → SonarQube

#### Build Feature
Ajouter dans TeamCity :
```kotlin
features {
    sonar {
        serverUrl = "%sonar.host.url%"
        serverToken = "%sonar.token%"
        projectKey = "ci-intro"
        projectName = "CI Intro"
        projectVersion = "%build.number%"
    }
}
```

### Quality Gate Status

#### Gestion des Échecs
- **Quality Gate Failed** → Bloquer le merge de la PR
- **New Code Quality Gate** → Analyser uniquement le nouveau code
- **Overall Code Quality Gate** → Analyser tout le code

#### Webhook SonarQube → TeamCity
Configurer un webhook dans SonarQube :
```
URL: https://teamcity.company.com/app/sonar/webhook
Events: Quality Gate status changed
```

### Métriques SonarQube à Surveiller

#### Code Smells
- Complexité cyclomatique élevée
- Fonctions trop longues
- Code dupliqué
- Commentaires TODO/FIXME

#### Bugs
- Erreurs potentielles
- Null pointer exceptions
- Type errors

#### Vulnerabilities
- Injections SQL
- XSS vulnerabilities
- Hardcoded credentials
- Weak cryptography

#### Security Hotspots
- Points sensibles à vérifier manuellement
- Utilisation de bibliothèques obsolètes
- Configurations non sécurisées

---

## 3. Intégration YouTrack

### Commit Message Pattern
Format requis pour lier les commits aux issues YouTrack :
```
[PROJECT-123] Description du commit

Détails supplémentaires si nécessaire
```

### Workflow YouTrack
1. **Création d'issue** → État : `Open`
2. **Début du développement** → État : `In Progress`
3. **Commit avec référence** → Commit lié automatiquement
4. **Pull Request créée** → État : `Code Review`
5. **Build TeamCity réussi** → État : `Testing`
6. **Merge dans main** → État : `Done`

### Configuration TeamCity → YouTrack
- Activer l'intégration YouTrack dans TeamCity
- Parser les messages de commit pour extraire les IDs d'issues
- Mettre à jour automatiquement le statut des issues

---

## 4. GitHub Checks

### Configuration des Status Checks
Protections de branche requises sur `main` :

#### Required Checks
- ✅ TeamCity Build Status
- ✅ Node.js Tests (Jest)
- ✅ PHP Tests (PHPUnit)
- ✅ Code Coverage (Node.js + PHP)
- ✅ SonarQube Quality Gate

#### Branch Protection Rules
```yaml
Require status checks to pass before merging: true
Require branches to be up to date before merging: true
Required status checks:
  - teamcity/build
  - teamcity/tests-node
  - teamcity/tests-php
  - sonarqube/quality-gate
```

#### Pull Request Template
Créer `.github/pull_request_template.md` :
```markdown
## Description
<!-- Décrivez les changements -->

## YouTrack Issue
<!-- Lien vers l'issue YouTrack -->
Fixes: [PROJECT-XXX](https://youtrack.company.com/issue/PROJECT-XXX)

## Type de changement
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Le code compile sans erreurs
- [ ] Les tests passent
- [ ] La documentation est à jour
```

### TeamCity → GitHub Integration
- Utiliser GitHub App ou Personal Access Token
- Publier les résultats de build comme GitHub Checks
- Bloquer le merge si TeamCity échoue

---

## 5. Notifications Discord

### Webhooks Discord
Créer un webhook Discord pour le canal de développement.

### Notifications à Envoyer

#### 1. Build Success
```
✅ Build Réussi - ci-intro
Branch: main
Commit: abc1234 - [PROJECT-123] Feature description
Author: @developer
Duration: 2m 35s
🔗 TeamCity | 🔗 GitHub
```

#### 2. Build Failed
```
❌ Build Échoué - ci-intro
Branch: feature/new-feature
Commit: def5678 - Fix calculator bug
Author: @developer
Error: PHPUnit tests failed (mtech-php)
Failed test: testAdditionNegativeNumbers
Duration: 1m 12s
🔗 TeamCity Logs | 🔗 GitHub
```

#### 3. Pull Request Events
```
🔔 Nouvelle Pull Request
PR #42: Add user authentication
Author: @developer
YouTrack: PROJECT-123
Status: ⏳ Waiting for checks
🔗 View PR
```

#### 4. Deployment Success
```
🚀 Déploiement Réussi - Production
Version: v1.2.3
Deployed by: TeamCity
Time: 14:32 UTC
🔗 Live Site
```

#### 5. SonarQube Quality Gate
```
📊 SonarQube Analysis - Quality Gate PASSED
Project: ci-intro
Coverage: 85.2% (+2.1%)
Bugs: 0
Vulnerabilities: 0
Code Smells: 3 (Minor)
Technical Debt: 15min
Rating: A
🔗 View Report
```

```
⚠️ SonarQube Analysis - Quality Gate FAILED
Project: ci-intro
Coverage: 72.1% (Required: 80%)
New Bugs: 2
New Vulnerabilities: 1 (Critical)
Code Smells: 12
Issues to fix before merge
🔗 View Details
```

### Configuration TeamCity → Discord
Utiliser un Build Feature dans TeamCity :
```kotlin
features {
    notifications {
        notifierSettings = discordNotifier {
            webhookUrl = "%discord.webhook.url%"
            sendOnSuccess = true
            sendOnFailure = true
            sendOnStart = false
        }
    }
}
```

---

## 6. Variables d'Environnement

### TeamCity Parameters
```properties
# GitHub
github.token = %vault:github/token%
github.repo = owner/ci-intro

# YouTrack
youtrack.url = https://youtrack.company.com
youtrack.token = %vault:youtrack/token%
youtrack.project = PROJECT

# SonarQube
sonar.host.url = https://sonarqube.company.com
sonar.token = %vault:sonarqube/token%
sonar.projectKey = ci-intro

# Discord
discord.webhook.url = %vault:discord/webhook%
discord.channel.id = 123456789

# Application
env.NODE_ENV = production
```

---

## 7. Fichiers de Configuration à Créer

### `.teamcity/settings.kts`
Configuration TeamCity as Code (Kotlin DSL) pour orchestrer les builds des deux projets

### `sonar-project.properties` (racine)
Configuration SonarQube multi-module pour analyser Node.js et PHP

### `mtech-node/jest.config.js`
Configuration Jest pour générer les rapports de couverture LCOV :
```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['app.js'],
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: ['**/test/**/*.test.js']
};
```

### `mtech-php/phpunit.xml` (mise à jour)
Ajouter la génération de rapport de couverture Clover pour SonarQube

### `.gitignore` (racine)
Exclure les dépendances et fichiers générés :
```gitignore
# Node.js
mtech-node/node_modules/
mtech-node/coverage/

# PHP
mtech-php/vendor/
mtech-php/coverage/

# IDE
.DS_Store
.idea/
.vscode/

# TeamCity
.teamcity/

# SonarQube
.sonar/
.scannerwork/
```

### `.github/pull_request_template.md`
Template pour les Pull Requests avec liens YouTrack

### `discord-notifier.js` (optionnel)
Script Node.js pour envoyer des notifications Discord personnalisées

---

## 8. Ordre de Mise en Place

1. ✅ **Projets Node.js et PHP créés** (fait)
   - ✅ mtech-node/ avec Jest
   - ✅ mtech-php/ avec PHPUnit
2. ⬜ Créer les fichiers de configuration locaux :
   - `jest.config.js` dans mtech-node/
   - Mise à jour de `phpunit.xml` dans mtech-php/
   - `sonar-project.properties` à la racine
   - `.gitignore` à la racine
3. ⬜ Configurer le repository GitHub avec les branch protections
4. ⬜ Créer le projet YouTrack et définir le workflow
5. ⬜ Configurer SonarQube :
   - Créer le projet multi-module dans SonarQube
   - Générer le token d'authentification
   - Configurer le Quality Gate
   - Activer les analyseurs JavaScript et PHP
6. ⬜ Configurer TeamCity :
   - Créer le projet
   - Ajouter les build steps Node.js (npm ci, npm test)
   - Ajouter les build steps PHP (composer install, phpunit)
   - Ajouter le step SonarQube Analysis
   - Configurer les VCS triggers
   - Ajouter le SonarQube Build Feature
7. ⬜ Intégrer TeamCity avec GitHub (checks)
8. ⬜ Intégrer TeamCity avec YouTrack (issue tracking)
9. ⬜ Configurer le webhook SonarQube → TeamCity
10. ⬜ Configurer les webhooks Discord (incluant SonarQube)
11. ⬜ Tester le workflow complet :
   - Créer une issue YouTrack (ex: PICT-101)
   - Créer une branche
   - Décommenter le test erroné (Node.js ou PHP)
   - Faire un commit avec référence YouTrack
   - Créer une PR
   - Vérifier l'échec du build (test failed)
   - Corriger le test
   - Vérifier tous les checks GitHub (tests Node.js, PHP, SonarQube)
   - Vérifier le Quality Gate SonarQube
   - Merger et vérifier toutes les notifications Discord

---

## 9. Monitoring et Logs

### Métriques à Surveiller
- Temps de build moyen
- Taux de succès des builds
- Temps de déploiement
- Fréquence des commits/PRs
- **SonarQube Metrics** :
  - Évolution de la couverture de code
  - Tendance de la dette technique
  - Nombre de bugs/vulnérabilités
  - Taux de passage du Quality Gate

### Logs à Conserver
- Build logs (TeamCity)
- Deployment logs
- Error traces
- Performance metrics
- SonarQube analysis reports

---

## 10. Notes et Considérations

- Utiliser des secrets/vault pour toutes les clés API (GitHub, YouTrack, SonarQube, Discord)
- Documenter les processus pour l'équipe
- Prévoir des rollback automatiques en cas d'échec
- Configurer des alertes pour les builds critiques
- Mettre en place des environments de staging/production séparés
- **SonarQube** :
  - Définir un Quality Gate adapté au projet
  - Former l'équipe aux métriques de qualité
  - Prévoir du temps pour corriger la dette technique
  - Utiliser les Quality Profiles adaptés (TypeScript/JavaScript)
  - Activer les règles de sécurité (OWASP)

---

## 11. Ressources Utiles

- [TeamCity Documentation](https://www.jetbrains.com/help/teamcity/)
- [YouTrack Integration](https://www.jetbrains.com/help/youtrack/integrations-overview.html)
- [GitHub Status Checks API](https://docs.github.com/en/rest/checks)
- [Discord Webhooks Guide](https://discord.com/developers/docs/resources/webhook)
- [SonarQube Documentation](https://docs.sonarqube.org/latest/)
- [SonarQube JavaScript/TypeScript Analysis](https://docs.sonarqube.org/latest/analysis/languages/javascript/)
- [TeamCity SonarQube Integration](https://www.jetbrains.com/help/teamcity/sonarqube.html)

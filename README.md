# CI/CD Introduction - Projet Multi-langages

Projet d'atelier pratique pour apprendre les concepts de CI/CD avec TeamCity, YouTrack, SonarQube et GitHub.

## Structure du Projet

```
ci-intro/
├── mtech-node/          # Projet Node.js avec Jest
│   ├── app.js           # Fonction addition
│   ├── test/            # Tests Jest
│   ├── package.json     # Configuration npm
│   └── jest.config.js   # Configuration Jest avec couverture
│
├── mtech-php/           # Projet PHP avec PHPUnit
│   ├── src/             # Code source PHP
│   ├── tests/           # Tests PHPUnit
│   ├── composer.json    # Configuration Composer
│   └── phpunit.xml      # Configuration PHPUnit avec couverture
│
├── sonar-project.properties  # Configuration SonarQube multi-module
├── Claude.md                 # Guide complet de configuration CI/CD
├── .gitignore                # Exclusions Git
└── README.md                 # Ce fichier
```

## Démarrage Rapide

### Projet Node.js (mtech-node)

```bash
cd mtech-node
npm install
npm test                # Lancer les tests
npm run test:coverage   # Tests avec couverture
```

### Projet PHP (mtech-php)

```bash
cd mtech-php
composer install
composer test           # Lancer les tests
./vendor/bin/phpunit --coverage-html coverage/html  # Tests avec couverture HTML
```

## Activité "Erreur et Correction"

1. Décommentez le test erroné dans `mtech-node/test/app.test.js` ou `mtech-php/tests/CalculatorTest.php`
2. Lancez les tests → un test échouera
3. Corrigez la valeur attendue dans le test
4. Committez avec un message lié à YouTrack : `PICT-XXX Correction du test négatifs #Fixed`
5. Poussez vers GitHub et observez le pipeline CI/CD

## Configuration CI/CD

Consultez le fichier **Claude.md** pour le guide complet de configuration :
- TeamCity (builds automatisés)
- SonarQube (analyse de qualité du code)
- YouTrack (gestion des tickets)
- Discord (notifications)
- GitHub (checks et branch protection)

## Métriques de Qualité

- **Coverage** : ≥ 80%
- **Duplications** : ≤ 3%
- **Maintainability Rating** : A
- **Reliability Rating** : A
- **Security Rating** : A

## Ressources

- [TeamCity Documentation](https://www.jetbrains.com/help/teamcity/)
- [SonarQube JavaScript/TypeScript](https://docs.sonarqube.org/latest/analysis/languages/javascript/)
- [SonarQube PHP](https://docs.sonarqube.org/latest/analysis/languages/php/)
- [Jest Documentation](https://jestjs.io/)
- [PHPUnit Documentation](https://phpunit.de/)

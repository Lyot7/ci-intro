# mtech (PHP)
Exemple minimal pour l'atelier CI/CD avec **PHPUnit**.

## Installation
```bash
composer install
```

## Lancer les tests
```bash
composer test
# ou
./vendor/bin/phpunit
```

## Activité "Erreur et correction"
1) Lancez les tests — un test échoue (addition de nombres négatifs).
2) Corrigez `tests/CalculatorTest.php` pour attendre `-5` :
```php
$this->assertSame(-5, Calculator::add(-2, -3));
```
3) Committez et poussez avec un message lié à votre ticket YouTrack, par ex. :
```
PICT-101 Comment "Correction du test négatifs" #Fixed
```
# Guide : Mettre à Jour YouTrack avec les Commits Git

## Format de Base

```bash
git commit -m "[ISSUE-ID] Description

#commande"
```

## Changer l'État d'une Issue

### Les 3 États Disponibles

```bash
# 1. Mettre en "À faire"
git commit -m "[MTE-1] Plan implementation

#À-faire"

# 2. Mettre en "En cours"
git commit -m "[MTE-1] Start implementation

#En-cours"

# 3. Mettre en "Terminé"
git commit -m "[MTE-1] Complete feature

#Terminé"
```

## Points Importants

- **Format requis** : `[MTE-X]` au début du message (X = numéro d'issue)
- **Ligne vide** : Obligatoire entre la description et la commande
- **Commande** : Doit commencer par `#` sur une nouvelle ligne
- **Syntaxe exacte** : Respecter les accents et tirets (`À-faire`, `En-cours`, `Terminé`)

## Exemples Complets

### Exemple 1 : Commencer une tâche
```bash
git add .
git commit -m "[MTE-1] Connecter YouTrack à GitHub

#En-cours"
git push
```

### Exemple 2 : Terminer une tâche
```bash
git add .
git commit -m "[MTE-1] Configuration terminée

#Terminé"
git push
```

### Exemple 3 : Remettre en "À faire"
```bash
git add .
git commit -m "[MTE-1] Besoin de refactoring

#À-faire"
git push
```

## Workflow Typique

```bash
# 1. Créer une branche
git checkout -b feature/MTE-1-github-integration

# 2. Faire vos modifications...

# 3. Commit avec état "En cours"
git add .
git commit -m "[MTE-1] Start GitHub integration

#En-cours"

# 4. Continuer le développement...

# 5. Commit final avec état "Terminé"
git add .
git commit -m "[MTE-1] GitHub integration complete

#Terminé"

# 6. Push
git push origin feature/MTE-1-github-integration
```

## États YouTrack - MTECH

| État | Commande | Signification |
|------|----------|---------------|
| À faire | `#À-faire` | Tâche planifiée, pas encore commencée |
| En cours | `#En-cours` | Tâche en cours de développement |
| Terminé | `#Terminé` | Tâche complétée et vérifiée |

## Vérification

Pour vérifier que votre commit a bien mis à jour l'état :
1. Poussez votre commit : `git push`
2. Allez sur YouTrack
3. Ouvrez l'issue MTE-1
4. L'état devrait être mis à jour automatiquement
5. Votre commit devrait apparaître dans l'onglet "VCS Changes" de l'issue

## En Cas de Problème

Si l'état n'est pas mis à jour automatiquement :
- Vérifiez que l'intégration VCS est active dans YouTrack
- Vérifiez le format exact : `[MTE-1]` au début
- Vérifiez qu'il y a bien une ligne vide avant la commande
- Vérifiez l'orthographe exacte des états (avec accents)

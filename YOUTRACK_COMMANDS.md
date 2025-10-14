# Tutoriel Complet : Commandes YouTrack

## 1. Commandes dans les Messages de Commit

### Format de Base
```bash
git commit -m "[ISSUE-ID] Description

#commande paramètre"
```

### Commandes Principales

#### Changer l'État
```bash
# Marquer comme "In Progress"
git commit -m "[MTE-1] Start implementation

#In-Progress"

# Marquer comme "Fixed"
git commit -m "[MTE-1] Fix bug

#Fixed"

# Marquer comme "Done"
git commit -m "[MTE-1] Complete feature

#Done"

# Fermer l'issue
git commit -m "[MTE-1] Final commit

#close"
```

#### Assigner à Quelqu'un
```bash
git commit -m "[MTE-1] Assign task

#assign @username"

# Assigner à soi-même
git commit -m "[MTE-1] Take ownership

#for me"
```

#### Ajouter des Commentaires
```bash
git commit -m "[MTE-1] Update code

#comment Implémentation terminée, prêt pour review"
```

#### Changer la Priorité
```bash
git commit -m "[MTE-1] Critical fix

#Priority Critical"

# Autres priorités : Show-stopper, Critical, Major, Normal, Minor
```

#### Ajouter du Temps de Travail
```bash
git commit -m "[MTE-1] Implement feature

#spent 2h 30m"

# Formats acceptés :
# - 1h, 2h 30m, 45m
# - 1d, 2d 4h
# - 1w, 2w 3d
```

#### Définir une Estimation
```bash
git commit -m "[MTE-1] Plan task

#estimation 5h"
```

#### Combiner Plusieurs Commandes
```bash
git commit -m "[MTE-1] Complete authentication

#In-Progress #spent 3h #comment Backend integration done"
```

---

## 2. API REST YouTrack

### Configuration
```bash
# Variables d'environnement
export YOUTRACK_URL="https://your-instance.youtrack.cloud"
export YOUTRACK_TOKEN="perm:your-token-here"
```

### Récupérer une Issue
```bash
curl -X GET \
  "$YOUTRACK_URL/api/issues/MTE-1" \
  -H "Authorization: Bearer $YOUTRACK_TOKEN" \
  -H "Accept: application/json"
```

### Mettre à Jour l'État
```bash
curl -X POST \
  "$YOUTRACK_URL/api/issues/MTE-1" \
  -H "Authorization: Bearer $YOUTRACK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customFields": [{
      "name": "State",
      "$type": "StateIssueCustomField",
      "value": {"name": "In Progress"}
    }]
  }'
```

### Ajouter un Commentaire
```bash
curl -X POST \
  "$YOUTRACK_URL/api/issues/MTE-1/comments" \
  -H "Authorization: Bearer $YOUTRACK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Integration avec GitHub terminée"
  }'
```

### Assigner à Quelqu'un
```bash
curl -X POST \
  "$YOUTRACK_URL/api/issues/MTE-1" \
  -H "Authorization: Bearer $YOUTRACK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customFields": [{
      "name": "Assignee",
      "$type": "SingleUserIssueCustomField",
      "value": {"login": "username"}
    }]
  }'
```

### Modifier la Priorité
```bash
curl -X POST \
  "$YOUTRACK_URL/api/issues/MTE-1" \
  -H "Authorization: Bearer $YOUTRACK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customFields": [{
      "name": "Priority",
      "$type": "SingleEnumIssueCustomField",
      "value": {"name": "Critical"}
    }]
  }'
```

### Ajouter du Temps de Travail
```bash
curl -X POST \
  "$YOUTRACK_URL/api/issues/MTE-1/timeTracking/workItems" \
  -H "Authorization: Bearer $YOUTRACK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "duration": {
      "minutes": 180
    },
    "text": "Implementation et tests",
    "date": 1697270400000
  }'
```

### Créer une Nouvelle Issue
```bash
curl -X POST \
  "$YOUTRACK_URL/api/issues" \
  -H "Authorization: Bearer $YOUTRACK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project": {"id": "0-0"},
    "summary": "Nouvelle fonctionnalité",
    "description": "Description détaillée"
  }'
```

---

## 3. Script Shell pour Automatisation

Créez `youtrack-cli.sh` :

```bash
#!/bin/bash

YOUTRACK_URL="https://your-instance.youtrack.cloud"
YOUTRACK_TOKEN="perm:your-token-here"

# Fonction pour mettre à jour l'état
update_state() {
    local issue_id=$1
    local state=$2

    curl -X POST \
        "$YOUTRACK_URL/api/issues/$issue_id" \
        -H "Authorization: Bearer $YOUTRACK_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"customFields\": [{
                \"name\": \"State\",
                \"\$type\": \"StateIssueCustomField\",
                \"value\": {\"name\": \"$state\"}
            }]
        }"
}

# Fonction pour ajouter un commentaire
add_comment() {
    local issue_id=$1
    local comment=$2

    curl -X POST \
        "$YOUTRACK_URL/api/issues/$issue_id/comments" \
        -H "Authorization: Bearer $YOUTRACK_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"text\": \"$comment\"}"
}

# Fonction pour ajouter du temps
add_time() {
    local issue_id=$1
    local minutes=$2
    local description=$3

    curl -X POST \
        "$YOUTRACK_URL/api/issues/$issue_id/timeTracking/workItems" \
        -H "Authorization: Bearer $YOUTRACK_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"duration\": {\"minutes\": $minutes},
            \"text\": \"$description\"
        }"
}

# Utilisation
case "$1" in
    state)
        update_state "$2" "$3"
        ;;
    comment)
        add_comment "$2" "$3"
        ;;
    time)
        add_time "$2" "$3" "$4"
        ;;
    *)
        echo "Usage: $0 {state|comment|time} issue_id [params]"
        exit 1
        ;;
esac
```

### Utilisation du Script
```bash
chmod +x youtrack-cli.sh

# Changer l'état
./youtrack-cli.sh state MTE-1 "In Progress"

# Ajouter un commentaire
./youtrack-cli.sh comment MTE-1 "Tests passent correctement"

# Ajouter du temps (en minutes)
./youtrack-cli.sh time MTE-1 120 "Développement de la fonctionnalité"
```

---

## 4. Intégration Git Hooks

Créez `.git/hooks/commit-msg` :

```bash
#!/bin/bash

commit_msg_file=$1
commit_msg=$(cat "$commit_msg_file")

# Vérifier le format [ISSUE-ID]
if ! echo "$commit_msg" | grep -qE '^\[MTE-[0-9]+\]'; then
    echo "❌ Erreur : Le message de commit doit commencer par [MTE-XXX]"
    echo "Exemple : [MTE-1] Description du commit"
    exit 1
fi

# Extraire l'ID de l'issue
issue_id=$(echo "$commit_msg" | grep -oE 'MTE-[0-9]+' | head -1)

# Mettre à jour YouTrack automatiquement
if [ ! -z "$issue_id" ]; then
    curl -s -X POST \
        "$YOUTRACK_URL/api/issues/$issue_id/comments" \
        -H "Authorization: Bearer $YOUTRACK_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"text\": \"Commit: ${commit_msg:0:100}...\"}" > /dev/null
fi
```

```bash
chmod +x .git/hooks/commit-msg
```

---

## 5. Commandes dans l'Interface YouTrack

### Barre de Commandes (Ctrl+J ou Cmd+J)

```plaintext
# Changer l'état
State: In Progress

# Assigner
Assignee: username

# Priorité
Priority: Critical

# Ajouter du temps
add work Today 2h Development

# Tags
tag: bug, urgent

# Subsystem
Subsystem: Backend

# Version
Fix versions: 1.0.0

# Sprint
Sprint: Sprint 1

# Estimation
Estimation: 5h

# Multiple commandes
State: In Progress Assignee: me Priority: Major
```

---

## 6. Workflow Automatique avec TeamCity

Configuration TeamCity pour mettre à jour YouTrack :

```kotlin
// .teamcity/settings.kts
import jetbrains.buildServer.configs.kotlin.v2019_2.*
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2019_2.buildFeatures.commitStatusPublisher.*

object Build : BuildType({
    name = "CI Build"

    features {
        commitStatusPublisher {
            vcsRootExtId = "${VcsRoot.id}"
            publisher = youtrack {
                serverUrl = "%youtrack.url%"
                authToken = "%youtrack.token%"
            }
        }
    }

    steps {
        script {
            name = "Update YouTrack on Success"
            scriptContent = """
                #!/bin/bash
                ISSUE_ID=${'$'}(git log -1 --pretty=%B | grep -oE 'MTE-[0-9]+' | head -1)
                if [ ! -z "${'$'}ISSUE_ID" ]; then
                    curl -X POST \
                        "%youtrack.url%/api/issues/${'$'}ISSUE_ID" \
                        -H "Authorization: Bearer %youtrack.token%" \
                        -H "Content-Type: application/json" \
                        -d '{"customFields": [{"name": "State", "value": {"name": "Testing"}}]}'
                fi
            """.trimIndent()
            conditions {
                success = true
            }
        }
    }
})
```

---

## 7. Exemples de Workflows Complets

### Workflow 1 : Début de Tâche
```bash
# 1. Créer une branche
git checkout -b feature/MTE-1-github-integration

# 2. Premier commit avec commandes YouTrack
git commit -m "[MTE-1] Start GitHub integration

#In-Progress #for me #spent 30m"

# 3. Push
git push origin feature/MTE-1-github-integration
```

### Workflow 2 : Mise à Jour Pendant le Développement
```bash
# Commit intermédiaire
git commit -m "[MTE-1] Add webhook configuration

#spent 1h #comment Webhook endpoints configured"
```

### Workflow 3 : Finalisation
```bash
# Commit final
git commit -m "[MTE-1] Complete GitHub integration

#Fixed #spent 2h #comment Ready for review"

# Créer la PR
gh pr create --title "[MTE-1] GitHub Integration" \
             --body "Closes MTE-1"
```

### Workflow 4 : Après Merge
```bash
# Via API après le merge
curl -X POST \
  "$YOUTRACK_URL/api/issues/MTE-1" \
  -H "Authorization: Bearer $YOUTRACK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customFields": [{
      "name": "State",
      "value": {"name": "Done"}
    }]
  }'
```

---

## 8. Résumé des Commandes Essentielles

| Action | Commit Message | API | Interface |
|--------|---------------|-----|-----------|
| Changer état | `#In-Progress` | POST /api/issues/{id} | `State: In Progress` |
| Assigner | `#for me` | POST /api/issues/{id} | `Assignee: username` |
| Commenter | `#comment text` | POST /api/issues/{id}/comments | Ajouter commentaire |
| Temps passé | `#spent 2h` | POST /api/issues/{id}/timeTracking/workItems | `add work 2h` |
| Priorité | `#Priority Critical` | POST /api/issues/{id} | `Priority: Critical` |
| Fermer | `#close` | POST /api/issues/{id} | `State: Done` |

---

## 9. Références YouTrack

### États Disponibles (selon votre workflow)
- `Open` : Nouvelle tâche
- `In Progress` : En cours de développement
- `Code Review` : En revue de code
- `Testing` : En phase de test
- `Fixed` : Corrigé/Terminé
- `Done` : Complété et vérifié
- `Verified` : Vérifié en production
- `Reopened` : Réouvert

### Priorités Standards
- `Show-stopper` : Bloquant critique
- `Critical` : Critique
- `Major` : Majeur
- `Normal` : Normal (par défaut)
- `Minor` : Mineur

### Types d'Issues
- `Task` : Tâche générique
- `Bug` : Bug à corriger
- `Feature` : Nouvelle fonctionnalité
- `Epic` : Grande fonctionnalité
- `Story` : User story
- `Improvement` : Amélioration

---

## 10. Bonnes Pratiques

### Messages de Commit
- Toujours commencer par `[ISSUE-ID]`
- Utiliser des messages descriptifs
- Ajouter le temps passé pour le tracking
- Mentionner les changements importants dans les commentaires

### Workflow Git
1. Créer une branche par issue : `feature/MTE-XXX-description`
2. Commit réguliers avec référence à l'issue
3. Pull Request avec référence dans le titre et la description
4. Merge après validation et tests

### API YouTrack
- Toujours utiliser HTTPS
- Stocker les tokens dans des variables d'environnement
- Ne jamais commiter les tokens dans le code
- Utiliser des secrets managers (TeamCity Parameters, GitHub Secrets)

### TeamCity Integration
- Configurer le VCS Root avec GitHub
- Ajouter YouTrack Integration Build Feature
- Parser les commit messages pour extraire les issue IDs
- Mettre à jour automatiquement le statut des issues

---

## 11. Dépannage

### Problème : Les commandes dans les commits ne fonctionnent pas
**Solution** : Vérifier que l'intégration VCS est correctement configurée dans YouTrack

### Problème : API renvoie 401 Unauthorized
**Solution** : Vérifier que le token est valide et a les permissions nécessaires

### Problème : Les commits ne sont pas liés aux issues
**Solution** : Vérifier le format `[ISSUE-ID]` au début du message de commit

### Problème : TeamCity ne met pas à jour YouTrack
**Solution** : Vérifier la configuration du Build Feature "Commit Status Publisher"

---

## 12. Ressources Utiles

- [YouTrack REST API Documentation](https://www.jetbrains.com/help/youtrack/devportal/rest-api.html)
- [YouTrack Command Language](https://www.jetbrains.com/help/youtrack/incloud/Command-Language.html)
- [TeamCity YouTrack Integration](https://www.jetbrains.com/help/teamcity/youtrack.html)
- [GitHub YouTrack Integration](https://www.jetbrains.com/help/youtrack/incloud/integration-with-github.html)
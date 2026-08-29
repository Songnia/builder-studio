# Guide de configuration SSH — Machine locale & o2switch

## 1. Génération de la clé SSH sur votre machine locale

Sur votre ordinateur (terminal), générez une clé SSH dédiée au déploiement :

```bash
cd ~/.ssh
ssh-keygen -t ed25519 -C "vanda-studio-deployment" -f o2switch_deployment
```

Vous allez recevoir trois fichiers :
- `o2switch_deployment` — **clé privée** (à garder secrète)
- `o2switch_deployment.pub` — clé publique
- `o2switch_deployment-known_hosts.json` (optionnel)

**N'** partagez jamais la clé privée. Vous ne garderez que la publique sur o2switch.

## 2. Ajout de la clé publique sur o2switch

1. Connectez-vous à votre **cPanel o2switch**, allez dans **Sécurité > SSH Keys**
2. Cliquez sur **Manage Authorized Keys** (ou Import Key)
3. Sélectionnez le fichier `o2switch_deployment.pub`
4. Donnez un nom explicite comme `vanda-studio-deployment`
5. Enregistrez

La clé publique est maintenant autorisée à vous connecter en SSH.

## 3. Configuration du fichier SSH local (`config`)

Rédigez ou éditez le fichier `~/.ssh/config` :

```text
Host o2switch-vanda
    HostName your-ssh-host.o2switch.io
    User appboy               # votre utilisateur cPanel/SSH (ex: appboy)
    Port 2222
    IdentityFile ~/.ssh/o2switch_deployment
    IdentitiesOnly yes
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
```

Remplacez `your-ssh-host.o2switch.io` par l’hôte SSH affiché dans cPanel > SSH (souvent une adresse comme `vanda-studio.o2switch.ca`).

Testez la connexion :

```bash
ssh o2switch-vanda
```

Vous devriez voir un message du type `Welcome to cPanel on o2switch`. Tapez `exit` pour sortir.

## 4. Mise à jour des secrets GitHub Actions

Dans **GitHub > Settings > Secrets and variables > Actions**, ajoutez ces quatre secrets :

| Secret | Valeur |
|--------|--------|
| `SSH_HOST` | l’hôte SSH (ex: `vanda-studio.o2switch.ca`) |
| `SSH_USER` | votre utilisateur cPanel/SSH (ex: `appboy`) |
| `SSH_PRIVATE_KEY` | **contenu entier** de la clé privée `~/.ssh/o2switch_deployment` (sans les `-----BEGIN ...-----` et `-----END ...-----` si le workflow les attend nus, ou avec — vérifiez ; de préférence **sans** les bornes PKCS#8/PEM vides, collez la clé brute generée par `ssh-keygen -m pem`) |
| `REMOTE_PATH` | chemin absolu du projet **sans** `/backend` final, ex: `/home/appboy/vanda-studio-all-2-builder-vanda-studio` |

**Note sur `SSH_PRIVATE_KEY`** : Le workflow `.github/workflows/deploy.yml` ligne 70 fait :
```bash
echo "${{ secrets.SSH_PRIVATE_KEY }}" > private_key
```
Si vous avez généré la clé avec des bornes `-----BEGIN OPENSSH PRIVATE KEY-----`/`,-----END OPENSSH PRIVATE KEY-----`, collez l'intégralité incluant ces bornes. Si la clé est au format **PKCS#8** (commence par `-----BEGIN PRIVATE KEY-----`), c'est aussi accepté par GitHub Actions. En cas d'échec, essayez de convertir la clé :
```bash
ssh-keygen -p -m pem -f o2switch_deployment
```
pour forcer le format PEM attendu par le workflow.

## 5. Déploiement automatique (via GitHub Actions)

Quand tout est configuré, poussez vers `main` :

```bash
git status
git pull --ff-only origin main
# ... vos modifications, commits, tests locaux ...
git add .
git commit -m "chore: prepare production deployment"
git push origin main
```

GitHub Actions lancera d'abord la pipeline CI/CD, puis le workflow de déploiement qui :
1. Construit les bundles frontend en production
2. Valide qu'il n'y a pas d'URL `localhost:8000`
3. RSYNC le projet vers o2switch (port 2222, en excluant node_modules, vendor, .git, .env)
4. Exécute les commandes Laravel via SSH (composer install, migrations, cache)

## 6. Déploiement manuel de secours

Si GitHub Actions n'est pas disponible, depuis votre machine locale :

```bash
# 1. Construisez les bundles frontend
cd frontend
npm ci
VITE_API_URL=https://api.vanda-studio.org/api \
VITE_ADMIN_URL=https://app.vanda-studio.org \
VITE_PUBLIC_DOMAIN=vanda-studio.org \
npm run build

# 2. Synchronisez vers le backend local
npm run sync:public:backend
npm run sync:admin:backend

# 3. Via SFTP/rsync (en excluant .git, .env, node_modules, logs)
rsync -avz -e "ssh -i ~/.ssh/o2switch_deployment -p 2222 -o StrictHostKeyChecking=no" \
  --exclude='node_modules' \
  --exclude='vendor' \
  --exclude='.git' \
  --exclude='.github' \
  --exclude='.env' \
  --exclude='logs' \
  ./* appboy@your-ssh-host.o2switch.io:/home/appboy/vanda-studio-all-2-builder-vanda-studio/

# 4. Via SSH, sur le serveur o2switch
ssh -i ~/.ssh/o2switch_deployment -p 2222 appboy@your-ssh-host.o2switch.io <<'EOF'
    cd /home/appboy/vanda-studio-all-2-builder-vanda-studio/backend
    php artisan down --retry=60
    composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader
    php artisan migrate --force
    php artisan storage:link || true
    php artisan optimize:clear
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    php artisan up
EOF
```

## 7. Mise à jour manuelle de production (pas de CI)

Si vous voulez mettre à jour la production sans pousser sur `main`, exécutez les commandes de mise à jour directement en SSH :

```bash
ssh -i ~/.ssh/o2switch_deployment -p 2222 appboy@your-ssh-host.o2switch.io <<'EOF'
    cd /home/appboy/vanda-studio-all-2-builder-vanda-studio/backend
    php artisan down --retry=60
    composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader
    php artisan migrate --force
    php artisan storage:link || true
    php artisan optimize:clear
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    php artisan up
EOF
```

Pensez ensuite à vider le cache navigateur et à vérifier les trois domaines :
- `https://vanda-studio.org`
- `https://app.vanda-studio.org`
- `https://api.vanda-studio.org`

---
*Guide créé le 21 août 2026 — VANDA STUDIO production deployment*
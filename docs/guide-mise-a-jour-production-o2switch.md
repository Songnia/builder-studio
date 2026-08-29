# Guide pratique de mise à jour de production — o2switch

Dernière vérification du guide : 21 août 2026.

Ce guide déploie le monorepo VANDA STUDIO sur les trois domaines :

- `https://vanda-studio.org` : site public et pages SEO ;
- `https://app.vanda-studio.org` : application d'administration ;
- `https://api.vanda-studio.org` : API Laravel et webhook Maketou.

## 1. Architecture à conserver dans cPanel

Dans **cPanel > Domaines**, configurez la même racine documentaire pour les trois
domaines :

```text
/home/VOTRE_COMPTE/chemin-du-projet/backend/public
```

Le fichier `backend/public/.htaccess` distribue ensuite les requêtes :

- le domaine API vers `index.php` ;
- le domaine applicatif vers `public/app` ;
- le domaine principal et les sous-domaines créateurs vers `public/landing` ;
- les routes SEO vers Laravel.

Ajoutez également un sous-domaine générique `*.vanda-studio.org` si les sites des
créateurs utilisent des sous-domaines. Son document root doit être le même.

Activez les certificats SSL AutoSSL pour le domaine principal, `app`, `api` et le
wildcard. Ne passez à la suite qu'après avoir obtenu HTTPS sur les trois URLs.

## 2. Prérequis o2switch

Dans **Sélectionner une version de PHP**, choisissez PHP 8.3 et activez au minimum :

```text
bcmath, ctype, curl, dom, fileinfo, gd, intl, mbstring,
openssl, pdo_mysql, tokenizer, xml, zip
```

Vérifiez par SSH :

```bash
php -v
composer --version
node --version
```

Node n'est pas nécessaire sur le serveur lorsque GitHub Actions construit le
frontend. Composer doit en revanche être disponible pour installer les dépendances
Laravel après chaque mise à jour.

## 3. Sauvegarde avant mise à jour

Dans cPanel :

1. ouvrez **Assistant de sauvegarde** et téléchargez une sauvegarde de la base MySQL ;
2. archivez le fichier `backend/.env` sans le placer dans un dossier public ;
3. archivez `backend/storage/app/public` si les médias ne sont pas sauvegardés ailleurs ;
4. notez le SHA du commit actuellement en production :

```bash
cd /home/VOTRE_COMPTE/chemin-du-projet
git rev-parse HEAD 2>/dev/null || true
```

N'exécutez pas `migrate:rollback` comme premier moyen de retour arrière : la migration
du cycle annuel supprime des colonnes lors de son `down`. Préférez restaurer le code
précédent tout en gardant les nouvelles colonnes compatibles.

## 4. Variables de production Laravel

Conservez impérativement la valeur existante de `APP_KEY`. Dans
`backend/.env`, vérifiez ou ajoutez les valeurs suivantes :

```dotenv
APP_NAME="VANDA STUDIO"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.vanda-studio.org

LOG_CHANNEL=stack
LOG_LEVEL=warning

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=VOTRE_BASE
DB_USERNAME=VOTRE_UTILISATEUR
DB_PASSWORD=VOTRE_MOT_DE_PASSE

FILESYSTEM_DISK=public
QUEUE_CONNECTION=database
CACHE_STORE=database
SESSION_DRIVER=database
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax

SANCTUM_STATEFUL_DOMAINS=vanda-studio.org,www.vanda-studio.org,app.vanda-studio.org,api.vanda-studio.org
SANCTUM_EXPIRATION=1440
FRONTEND_URL=https://app.vanda-studio.org

MAKETOU_BASE_URL=https://api.maketou.net
MAKETOU_API_KEY=VOTRE_NOUVELLE_CLE_SECRETE
SUBSCRIPTION_TRIAL_DAYS=30

SUPERADMIN_EMAIL=VOTRE_EMAIL_ADMIN
SUPERADMIN_PASSWORD=UN_MOT_DE_PASSE_UNIQUE
```

Ne copiez pas `backend/.env.example` par-dessus le `.env` de production et ne lancez
jamais `php artisan key:generate` sur une production existante. Cela invaliderait les
données chiffrées et les sessions.

Important : la liste `SANCTUM_STATEFUL_DOMAINS` ne doit contenir aucun espace après
les virgules. L'erreur `Encountered unexpected whitespace` empêche Laravel, Composer,
les migrations et les routes médias de démarrer. Corrigez la ligne avant toute autre
commande :

```dotenv
SANCTUM_STATEFUL_DOMAINS=vanda-studio.org,www.vanda-studio.org,app.vanda-studio.org,api.vanda-studio.org
```

La clé Maketou communiquée précédemment dans la conversation doit être considérée
comme exposée : révoquez-la et créez-en une nouvelle avant la mise en ligne.

## 5. Configuration Maketou

Dans le tableau de bord Maketou, configurez le Pulse actif avec :

```text
https://api.vanda-studio.org/api/payment/maketou/webhook
```

Événement : **Vente réussie**. Configurez les six offres pour STARTER, PRO et STUDIO
en versions mensuelles et annuelles dans la même boutique que la clé API. Le catalogue,
les prix et les six identifiants actuellement configurés sont synchronisés par la
migration
`2026_08_25_000000_sync_public_subscription_plans.php`.

## 6. Configuration GitHub Actions

Dans **GitHub > Settings > Secrets and variables > Actions**, ajoutez :

| Secret | Valeur attendue |
| --- | --- |
| `SSH_HOST` | hôte SSH o2switch |
| `SSH_USER` | utilisateur cPanel/SSH |
| `SSH_PRIVATE_KEY` | clé privée autorisée sur le compte |
| `REMOTE_PATH` | chemin absolu du projet, sans `/backend` final |

Le port SSH utilisé par le workflow est `2222`.

Le workflow de déploiement :

1. attend que la pipeline CI soit réussie sur `main` ;
2. construit les bundles avec `https://api.vanda-studio.org/api` ;
3. refuse le déploiement si un bundle contient encore `localhost:8000` ;
4. copie le site public dans `backend/public/landing` et l'admin dans
   `backend/public/app` ;
5. transfère le projet par SSH ;
6. installe les dépendances Composer, exécute les migrations et reconstruit les caches.

## 7. Déploiement automatique recommandé

Sur la machine locale :

```bash
git status
git pull --ff-only origin main
cd frontend
npm ci
npx eslint vite.config.ts src/services/api.ts
npx tsc --noEmit -p tsconfig.app.json
npm run build
cd ../backend
php artisan test
```

Le test backend exige l'extension SQLite locale (`pdo_sqlite`). Si elle manque, le
résultat local n'est pas exploitable ; la pipeline GitHub possède cette extension et
reste la validation de référence.

Le lint global du frontend contient encore des erreurs historiques dans des composants
non concernés par cette livraison. Elles sont documentées comme dette technique ; le
type-check, le build complet et les fichiers de configuration modifiés doivent en
revanche tous passer avant le déploiement.

Commitez ensuite les changements validés et poussez vers `main` :

```bash
git add .
git commit -m "chore: prepare o2switch production deployment"
git push origin main
```

Sur GitHub, attendez successivement :

1. **CI/CD Pipeline** en vert ;
2. **Deploy to o2switch** en vert.

Un échec CI empêche désormais automatiquement le déploiement.

## 8. Mise à jour manuelle de secours

Si GitHub Actions n'est pas disponible, construisez localement avec des variables
explicites :

```bash
cd frontend
npm ci
VITE_API_URL=https://api.vanda-studio.org/api \
VITE_ADMIN_URL=https://app.vanda-studio.org \
VITE_PUBLIC_DOMAIN=vanda-studio.org \
npm run build
npm run sync:public:backend
npm run sync:admin:backend
```

Avant l'envoi, contrôlez qu'aucun bundle ne contient l'adresse locale :

```bash
grep -R "localhost:8000" dist-public dist-admin
```

Cette commande ne doit rien retourner. Transférez ensuite le dépôt par SFTP/rsync en
excluant au minimum `.git`, `.github`, `node_modules`, `.env` et les logs. Ne supprimez
pas `backend/storage/app/public`.

Puis, par SSH :

```bash
cd /home/VOTRE_COMPTE/chemin-du-projet/backend
php artisan down --retry=60
composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader
php artisan migrate --force
php artisan storage:link
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan up
```

Si `storage:link` répond que le lien existe déjà, continuez. Vérifiez toutefois que
`backend/public/storage` pointe bien vers `backend/storage/app/public`.

## 9. Tâches planifiées et file d'attente

Dans **cPanel > Tâches Cron**, ajoutez le scheduler Laravel :

```cron
* * * * * cd /home/VOTRE_COMPTE/chemin-du-projet/backend && php artisan schedule:run >> /dev/null 2>&1
```

Si des emails ou traitements utilisent la queue, créez également un cron borné :

```cron
* * * * * cd /home/VOTRE_COMPTE/chemin-du-projet/backend && php artisan queue:work --stop-when-empty --tries=3 --timeout=90 >> /dev/null 2>&1
```

## 10. Contrôles obligatoires après déploiement

Exécutez par SSH :

```bash
cd /home/VOTRE_COMPTE/chemin-du-projet/backend
php artisan about --only=environment
php artisan migrate:status
php artisan route:list --path=api/payment/maketou/webhook
php artisan route:list --path=api/admin/galleries
```

Dans un navigateur privé, vérifiez :

1. `https://vanda-studio.org` charge sans erreur console ;
2. `https://app.vanda-studio.org` permet connexion et déconnexion ;
3. l'onglet Réseau appelle `https://api.vanda-studio.org/api`, jamais
   `localhost:8000` ;
4. une galerie existante s'ouvre dans l'admin sans demander son PIN ;
5. le lien client demande le PIN, puis affiche les médias ;
6. un like sur une galerie protégée fonctionne après saisie du PIN ;
7. les plans mensuels et annuels affichent les bons prix ;
8. un checkout Maketou de test crée un seul panier ;
9. le Pulse Maketou reçoit une réponse HTTP 2xx ;
10. `storage/logs/laravel.log` ne contient aucune nouvelle erreur critique.

Tests HTTP rapides :

```bash
curl -I https://vanda-studio.org
curl -I https://app.vanda-studio.org
curl -sS https://api.vanda-studio.org/ | head
curl -I https://vanda-studio.org/robots.txt
curl -I https://vanda-studio.org/sitemap.xml
```

## 11. Retour arrière

En cas d'incident :

1. exécutez `php artisan down` ;
2. remettez le commit précédent ou l'archive de code sauvegardée ;
3. exécutez `composer install --no-dev --optimize-autoloader` ;
4. exécutez `php artisan optimize:clear`, puis reconstruisez les caches ;
5. ne supprimez pas les colonnes de facturation annuelle sans sauvegarde et validation ;
6. exécutez `php artisan up` ;
7. contrôlez les trois domaines et les logs.

Si la migration a partiellement échoué, ne relancez pas des commandes SQL manuelles à
l'aveugle : restaurez la sauvegarde ou corrigez la migration après inspection de
`php artisan migrate:status`.

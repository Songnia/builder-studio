# Mise en ligne manuelle de VANDA STUDIO sur o2switch

Version vérifiée : 27 août 2026.

Ce guide décrit une mise à jour manuelle avec le Gestionnaire de fichiers cPanel
(ou FileZilla/SFTP) et le terminal o2switch. Il couvre le backend Laravel, le site
public, les sites créateurs, les galeries et l'application d'administration.

## 1. Repérer les dossiers

Dans ce guide, remplacez :

```text
/home/VOTRE_COMPTE/VOTRE_PROJET
```

par le chemin réel du projet sur o2switch.

Les trois domaines doivent avoir comme racine documentaire :

```text
/home/VOTRE_COMPTE/VOTRE_PROJET/backend/public
```

Correspondances des builds :

```text
frontend/dist-public/*  → backend/public/landing/
frontend/dist-admin/*   → backend/public/app/
```

Il faut copier le **contenu** de chaque dossier `dist-*`, pas le dossier parent
lui-même.

## 2. Faire une sauvegarde

Avant tout remplacement :

1. exportez la base MySQL depuis phpMyAdmin ;
2. téléchargez une copie de `backend/.env` ;
3. sauvegardez `backend/storage/app/public` ;
4. archivez les dossiers actuellement en ligne :

```text
backend/public/app
backend/public/landing
```

Ne remplacez jamais le `.env` de production par `.env.example` et ne supprimez
jamais `storage/app/public`.

## 3. Générer les archives prêtes à téléverser

Depuis la racine du projet local :

```bash
chmod +x scripts/prepare-o2switch-release.sh
./scripts/prepare-o2switch-release.sh
```

Le script reconstruit les deux SPA, refuse les URL locales et crée exactement :

```text
releases/o2switch-manual/01-backend.zip
releases/o2switch-manual/02-public.zip
releases/o2switch-manual/03-admin.zip
```

- `01-backend.zip` s'extrait à la racine de `backend/` ;
- `02-public.zip` s'extrait dans `backend/public/landing/` ;
- `03-admin.zip` s'extrait dans `backend/public/app/`.

L'archive backend exclut volontairement `.env`, `vendor`, les caches, les logs et
`storage/app/public`. Elle ne peut donc pas remplacer les secrets ou les médias de
production.

### Construction manuelle de secours

Si vous ne souhaitez pas utiliser le script, construisez depuis `frontend` :

Depuis le dossier `frontend` de la machine locale :

```bash
npm ci
VITE_API_URL=https://api.vanda-studio.org/api \
VITE_ADMIN_URL=https://app.vanda-studio.org \
VITE_PUBLIC_DOMAIN=vanda-studio.org \
npm run build
```

Vérifiez les sorties :

```bash
test -f dist-public/index.html
test -f dist-public/index-public.html
test -f dist-public/sw.js
test -f dist-public/.htaccess
test -f dist-admin/index.html
test -f dist-admin/index-admin.html
test -f dist-admin/sw.js
test -f dist-admin/.htaccess
grep -R "localhost:8000" dist-public dist-admin
```

La dernière commande ne doit retourner aucun résultat.

## 4. Fichiers backend réellement inclus

`01-backend.zip` contient les chemins suivants, relatifs au dossier `backend` :

```text
app/
bootstrap/ (sans cache généré)
config/
database/
resources/
routes/
artisan
composer.json
composer.lock
public/.htaccess
public/.user.ini
public/favicon.ico
public/index.php
public/robots.txt
```

Les fichiers cachés `.htaccess` sont inclus automatiquement.

Le fichier suivant doit absolument être présent avant l'exécution des migrations :

```text
backend/database/migrations/2026_08_25_000000_sync_public_subscription_plans.php
```

## 5. Mettre Laravel en maintenance

Dans le terminal cPanel ou en SSH :

```bash
cd /home/VOTRE_COMPTE/VOTRE_PROJET/backend
php artisan down --retry=60
```

Si cette commande échoue à cause du `.env`, corrigez d'abord sa syntaxe. La ligne
Sanctum doit notamment rester sur une seule ligne, sans espace :

```dotenv
SANCTUM_STATEFUL_DOMAINS=vanda-studio.org,www.vanda-studio.org,app.vanda-studio.org,api.vanda-studio.org
```

Avant l'upload, vérifiez également dans `backend/.env` les valeurs de production
suivantes. Gardez la valeur actuelle de `APP_KEY` et remplacez les marqueurs
`CHANGE_ME` par les secrets du compte o2switch :

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.vanda-studio.org
LOG_LEVEL=warning

FILESYSTEM_DISK=public
QUEUE_CONNECTION=database
CACHE_STORE=database
SESSION_DRIVER=database

FRONTEND_URL=https://app.vanda-studio.org
SANCTUM_STATEFUL_DOMAINS=vanda-studio.org,www.vanda-studio.org,app.vanda-studio.org,api.vanda-studio.org

MAIL_MAILER=smtp
MAIL_SCHEME=smtps
MAIL_HOST=mail.vanda-studio.org
MAIL_PORT=465
MAIL_USERNAME=assistant@vanda-studio.org
MAIL_PASSWORD=CHANGE_ME
MAIL_EHLO_DOMAIN=vanda-studio.org
MAIL_FROM_ADDRESS=assistant@vanda-studio.org
MAIL_FROM_NAME="Assistant VANDA STUDIO"

MAKETOU_BASE_URL=https://api.maketou.net
MAKETOU_API_KEY=CHANGE_ME
```

Ne placez jamais de crochets Markdown ni de lien cliquable dans une valeur `.env`.

## 6. Envoyer et extraire le backend

Avec le Gestionnaire de fichiers cPanel :

1. ouvrez `/home/VOTRE_COMPTE/VOTRE_PROJET/backend` ;
2. téléversez `01-backend.zip` ;
3. extrayez l'archive **dans ce dossier** en autorisant le remplacement ;
4. supprimez uniquement le ZIP du serveur après extraction.

Ne remplacez ou ne supprimez pas :

```text
backend/.env
backend/storage/app/public
backend/public/storage
```

Le dossier `vendor` n'a pas besoin d'être envoyé : Composer le mettra à jour sur le
serveur.

## 7. Remplacer le site public

Dans cPanel :

1. ouvrez `backend/public/landing` ;
2. après sauvegarde, videz le contenu de ce dossier pour retirer les anciens assets
   et anciens fichiers Workbox, sans supprimer le dossier `landing` lui-même ;
3. envoyez `02-public.zip` ;
4. extrayez son contenu directement dans `landing` ;
5. vérifiez que `.htaccess`, `index.html`, `index-public.html`, `sw.js`,
   `registerSW.js` et le nouveau dossier `assets` sont présents.

La structure finale doit ressembler à :

```text
backend/public/landing/
├── .htaccess
├── index.html
├── index-public.html
├── sw.js
├── workbox-*.js
├── registerSW.js
├── manifest.webmanifest
└── assets/
```

## 8. Remplacer l'administration

Dans cPanel :

1. ouvrez `backend/public/app` ;
2. après sauvegarde, videz le contenu de ce dossier pour retirer les anciens assets
   et anciens fichiers Workbox, sans supprimer le dossier `app` lui-même ;
3. envoyez `03-admin.zip` ;
4. extrayez son contenu directement dans `app` ;
5. vérifiez la présence de `.htaccess`, `index.html`, `index-admin.html`, `sw.js`,
   `registerSW.js` et `assets`.

La structure finale doit ressembler à :

```text
backend/public/app/
├── .htaccess
├── index.html
├── index-admin.html
├── sw.js
├── workbox-*.js
├── registerSW.js
├── manifest.webmanifest
└── assets/
```

## 9. Installer le backend et appliquer les migrations

Toujours depuis `backend` :

```bash
composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader
php artisan optimize:clear
php artisan migrate --force
php artisan storage:link || true
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Le message indiquant que le lien `public/storage` existe déjà n'est pas bloquant.

Contrôlez que la migration des forfaits est exécutée :

```bash
php artisan migrate:status | grep 2026_08_25_000000
```

La ligne doit être marquée `Ran`.

Contrôlez également les tables nécessaires aux emails d'onboarding :

```bash
php artisan migrate:status | grep 2026_08_25_100000
```

### Scheduler et file d'attente

Dans **cPanel > Tâches Cron**, configurez une seule fois :

```cron
* * * * * cd /home/VOTRE_COMPTE/VOTRE_PROJET/backend && php artisan schedule:run >> /dev/null 2>&1
```

Comme `QUEUE_CONNECTION=database`, ajoutez aussi :

```cron
* * * * * cd /home/VOTRE_COMPTE/VOTRE_PROJET/backend && php artisan queue:work --stop-when-empty --tries=3 --timeout=90 >> /dev/null 2>&1
```

## 10. Remettre le site en ligne

```bash
php artisan up
```

Vérifiez ensuite :

```bash
curl -I https://vanda-studio.org
curl -I https://app.vanda-studio.org
curl -I https://api.vanda-studio.org
```

## 11. Tester dans le navigateur

Utilisez d'abord une fenêtre privée, puis contrôlez :

1. `https://vanda-studio.org` ;
2. `https://app.vanda-studio.org` ;
3. un site créateur, par exemple `https://clown-event-2.vanda-studio.org/` ;
4. une galerie via `https://nom-du-studio.vanda-studio.org/g/UUID` ;
5. la page `/admin/subscription` ;
6. un checkout Maketou de test.

Dans l'onglet Réseau du navigateur, les appels doivent partir vers :

```text
https://api.vanda-studio.org/api
```

Si l'erreur Workbox `non-precached-url` persiste, ouvrez les outils de développement,
puis **Application → Service Workers → Unregister**, effacez les données du site et
rechargez avec `Ctrl+Shift+R`.

## 12. Interpréter les 404 des sites et galeries

Un build réussi ne rend pas automatiquement un abonnement actif.

```json
{"message":"Site non trouvé ou non publié"}
```

signifie que le site n'est pas publié ou que son propriétaire n'a pas d'abonnement
actif.

```json
{"message":"Galerie indisponible"}
```

signifie que la galerie existe, mais que l'abonnement de son propriétaire n'accorde
actuellement plus l'accès public.

Un abonnement valide doit respecter :

```text
status = active
starts_at <= maintenant
ends_at > maintenant, ou ends_at = NULL
```

La migration du catalogue crée les forfaits STARTER, PRO et STUDIO. Elle ne crée pas
d'abonnement pour les utilisateurs existants. Leur paiement Maketou doit avoir été
confirmé par le webhook, ou leur abonnement doit être régularisé depuis
l'administration.

## 13. Contrôler les logs en cas d'échec

```bash
cd /home/VOTRE_COMPTE/VOTRE_PROJET/backend
tail -n 100 storage/logs/laravel.log
php artisan route:list --path=api/payment/maketou/webhook
php artisan route:list --path=api/sites
php artisan route:list --path=api/client/gallery
```

Ne laissez pas `APP_DEBUG=true` en production.

<p align="center">
  <img src="logo.png" alt="VANDA STUDIO" width="220" />
</p>

<h1 align="center">VANDA STUDIO</h1>

<p align="center">
  <strong>La plateforme web qui permet à chaque photographe de créer, gérer et monétiser son propre studio en ligne.</strong>
</p>

<p align="center">
  <img alt="PHP" src="https://img.shields.io/badge/PHP-8.3-777BB4" />
  <img alt="Laravel" src="https://img.shields.io/badge/Laravel-12-F9324C" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-6-646CFF" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## Sommaire

- [Présentation](#présentation)
- [Architecture](#architecture)
- [Fonctionnalités](#fonctionnalités)
- [Démarrage rapide](#démarrage-rapide)
- [Structure du dépôt](#structure-du-dépôt)
- [Déploiement](#déploiement)
- [Environnement](#environnement)
- [Tests](#tests)
- [Licence](#licence)

---

## Présentation

**VANDA STUDIO** est une plateforme SaaS destinée aux photographes professionnels. Chaque photographe dispose de son propre espace pour gérer ses **galeries photos**, facturer ses clients, créer son **site vitrine** via un builder intuitif, et proposer ses services à la **vente en ligne** (paiement par carte via Maketou).

Trois expériences distinctes sont proposées :

| Expérience | URL | Description |
| :--- | :--- | :--- |
| **Site public** | `vanda-studio.org` | Vitrine de la plateforme + inscription des photographes. |
| **Application** | `app.vanda-studio.org` | Espace photographe : galeries, factures, builder de site, abonnements. |
| **API** | `api.vanda-studio.org` | API REST (Laravel + Sanctum) alimentant les deux applications. |

---

## Architecture

Le projet est un monorepo à **deux composants** :

- **`backend/`** — API REST Laravel 12 (PHP 8.3, MySQL, Sanctum, Spatie Media Library, intégration de paiement Maketou).
- **`frontend/`** — Applications React 19 + TypeScript + Vite, construites en **deux bundles** (public et admin) et packagées en PWA (VitePWA).

Le frontend utilise **Vite en mode conditionnel** : la variable `VITE_APP_MODE` (public ou admin) détermine le point d'entrée (`index-public.html` ou `index-admin.html`) et le répertoire de sortie (`dist-public` ou `dist-admin`).

```
┌─────────────────────────────┐      ┌──────────────────────────────┐
│  vanda-studio.org           │      │  app.vanda-studio.org        │
│  (React, dist-public)       │      │  (React, dist-admin + PWA)   │
└─────────────┬───────────────┘      └──────────────┬───────────────┘
              │  HTTPS / REST + Sanctum             │
              └────────────────────┬────────────────┘
                                   ▼
                       ┌──────────────────────┐
                       │  api.vanda-studio.org│
                       │  Laravel 12 + MySQL  │
                       │  + Maketou payments  │
                       └──────────────────────┘
```

---

## Fonctionnalités

### Côté photographe (application admin)
- **Gestion des galeries** — création, upload par lots, photos privées/protégées par code PIN.
- **Facturation** — génération de devis et factures, export PDF, partage par lien.
- **Builder de site** — création guidée (10 étapes) du site vitrine : identité visuelle, hero, portfolio, services, tarifs, témoignages, contact, puis publication en un clic.
- **Souscription & paiement** — plans d'abonnement, abonnement actif, paiement en ligne via **Maketou**.

### Côté client
- **Galerie client** — consultation des photos sélectionnées par le photographe, téléchargement après identification.
- **Like** des photos.

### Côté administrateur (super-admin)
- **Tableau de bord super-admin** — vue d'ensemble de la plateforme.
- **Gestion des photographes** — activation/désactivation des comptes.
- **Gestion des plans d'abonnement** — création, modification, tarification.

---

## Démarrage rapide

### Prérequis
- PHP 8.3+, Composer 2.x, MySQL 8+
- Node.js 22+, npm 10+

### 1. Backend

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
# configurer la base de données dans .env (DB_DATABASE, DB_USERNAME, DB_PASSWORD)
php artisan migrate --seed
php artisan serve
```

Le serveur répond sur `http://localhost:8000` et l'API sur `http://localhost:8000/api`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev            # site public (http://localhost:5173)
VITE_APP_MODE=admin npm run dev   # application admin (http://localhost:5174)
```

### 3. Builds de production

```bash
cd frontend
npm run build                 # génère dist-public (site public)
VITE_APP_MODE=admin npm run build   # génère dist-admin (application)
```

---

## Structure du dépôt

```
.
├── backend/                 # API Laravel 12
│   ├── app/
│   │   ├── Http/Controllers/Api/   # Auth, Admin, Client, SuperAdmin, Payment...
│   │   ├── Models/
│   │   ├── Services/               # MaketouService (paiement)
│   │   └── ...
│   ├── database/migrations/
│   ├── database/seeders/
│   ├── routes/api.php
│   └── public/              # builds statiques commités (servis par l'API)
├── frontend/                # React 19 + TypeScript + Vite
│   ├── index-public.html    # entrée du site public
│   ├── index-admin.html     # entrée de l'application admin
│   ├── src/
│   │   ├── pages/           # admin, client, superadmin
│   │   ├── components/
│   │   ├── builder/         # builder de site en 10 étapes
│   │   └── template/        # site vitrine généré
│   └── deploy/              # configs nginx / .htaccess
├── docs/                    # documentation et guides
└── .github/workflows/       # CI/CD (ci-cd.yml, deploy.yml)
```

---

## Déploiement

Le déploiement de production est automatisé via GitHub Actions (`.github/workflows/deploy.yml`) : le workflow construit le frontend, rsync le dépôt vers le serveur **o2switch** (SSH, port 2222) et exécute les migrations.

**Secrets GitHub requis :** `SSH_HOST`, `SSH_USER`, `REMOTE_PATH`, `SSH_PRIVATE_KEY`.

Le pipeline de validation (`ci-cd.yml`) exécute sur chaque push vers `main` : lint PHP, tests Laravel, type-check et builds frontend (public + admin).

---

## Environnement

Fichiers de variables d'environnement (jamais commités) :

| Fichier | Rôle |
| :--- | :--- |
| `backend/.env` | Configuration Laravel (DB, MAIL, Maketou...). Modèle : `backend/.env.example`. |
| `frontend/.env` | Variables Vite du frontend. Modèle : `frontend/.env.example`. |

---

## Tests

```bash
# Backend (tests PHPUnit)
cd backend
php artisan test

# Frontend (type-check)
cd frontend
npx tsc --noEmit -p tsconfig.app.json
```

---

## Licence

Distribué sous licence **MIT**. Voir [LICENSE](LICENSE).

---

*© 2026 VANDA Studio. Projet développé pour Songnia Wilfried Tresor.*
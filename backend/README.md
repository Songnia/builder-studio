# VANDA STUDIO — Backend (API Laravel)

API REST Laravel 12 qui alimente le site public, l'application admin et les galeries clientes de VANDA STUDIO.

## Stack
- PHP 8.3, Laravel 12, MySQL
- Authentification : Laravel Sanctum (tokens / stateful)
- Médias : Spatie Media Library
- Paiement : intégration **Maketou** (`MAKETOU_BASE_URL`, `MAKETOU_API_KEY` dans `.env`)

## Points d'entrée principaux
| Route | Description |
| :--- | :--- |
| `/api/auth/*` | Inscription, connexion, profil |
| `/api/galleries/*` | Galeries (admin & client) |
| `/api/invoices/*` | Facturation |
| `/api/plans`, `/api/subscriptions` | Plans et abonnements |
| `/api/payment/*` | Paiements Maketou |
| `/api/superadmin/*` | Administration de la plateforme |
| `/api/site-config` | Config du builder de site |

## Démarrage
```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

## Tests
```bash
php artisan test
```

Voir le [README racine](../README.md) pour la documentation complète du projet.
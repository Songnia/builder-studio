# CONTEXT.md - VANDA STUDIO

Ce document récapitule le contexte technique, fonctionnel et l'état actuel du projet **VANDA STUDIO** afin d'assurer une collaboration fluide entre agents IA et développeurs.

---

## 1. Présentation du Projet

**VANDA STUDIO** est une plateforme SaaS complète destinée aux photographes professionnels et créatifs. Elle leur permet de :
- Créer et livrer des galeries photos sécurisées à leurs clients (avec protection PIN, sélection de photos, téléchargement ZIP).
- Gérer leurs abonnements SaaS, devis et facturation.
- Créer et publier des sites vitrines / portfolios personnalisés via un builder intégré.

### Stack Technique
- **Frontend** : React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router DOM.
- **Backend** : Laravel 11, Sanctum (Auth API), MySQL, Spatie / Local Storage pour les médias.
- **Paiements** : Intégration Maketou (Mobile Money & Cartes bancaires).
- **Architecture de déploiement** :
  - Frontend scindé en deux builds SPA : `dist-public` (Landing / Vitrines) et `dist-admin` (Dashboard Photographe & SuperAdmin).
  - Déploiement cible : hébergement Apache / o2switch (`app.vanda-studio.org` et `api.vanda-studio.org`).

---

## 2. État Actuel & Réalisations Récents

### A. Politique Tarifaire & Quotas (Entitlements)
- **Grille Tarifaire (3 Plans)** :
  1. **Starter** : 5 000 FCFA / mois (50 000 FCFA / an) — Promo 6 mois : **2 500 FCFA**
  2. **Pro** : 11 000 FCFA / mois (100 000 FCFA / an) — Promo 6 mois : **5 000 FCFA**
  3. **Studio** : 25 000 FCFA / mois (250 000 FCFA / an) — Promo 6 mois : **15 000 FCFA**
- **Gestion des Quotas Backend** (`SubscriptionEntitlementService`) :
  - Limitation des galeries actives par mois.
  - Limitation des photos de portfolio et des factures mensuelles.
  - Verrouillage de la publication de site via `PaywallModal` frontend et middleware backend.

### B. Correctifs Majeurs Appliqués
1. **Accès Galeries Admin (Correction 403 Forbidden)** :
   - *Problème* : L'interface admin appelait l'endpoint client public (`/api/client/gallery/{uuid}`) protégé par PIN.
   - *Fix* : Ajout de la méthode `getAdminGalleryByUUID` dans `galleryService.ts` pointant vers `/api/admin/galleries/{uuid}`. L'admin a désormais un accès permanent et illimité à ses galeries sans PIN.
2. **Affichage des Médias en Dev (`/media/{path}`)** :
   - *Problème* : La route `/media/{path}` dans `backend/routes/web.php` était restreinte à `api.vanda-studio.org`, causant des erreurs 404 / connection reset sur `localhost:8000`.
   - *Fix* : Exposition globale de la route `/media/{path}` dans `web.php` et vidage du cache des routes (`php artisan route:clear`).
3. **Sites Vitrines (404 Config)** :
   - Seuls les sites avec `is_published = true` et un abonnement photographe actif sont accessibles via `/api/sites/{slug}/config`.

---

## 3. Architecture des API & Routes

### Distinctions Majeures des Routes API (`backend/routes/api.php`)
- **Admin** (`/api/admin/...`) : Nécessite un token Sanctum (`auth:sanctum`). Permet aux photographes de gérer leurs galeries, clients, factures et paramètres.
- **Client Public** (`/api/client/...`) : Accessible publiquement ou restreint par code PIN pour la consultation / sélection par les clients finaux.
- **SuperAdmin** (`/api/superadmin/...`) : Gestion globale de la plateforme (photographes, abonnements, métriques).
- **Public Sites** (`/api/sites/...`) : Configuration publique des portfolios générés.

---

## 4. Tâches En Cours & Prochaines Étapes

1. **Page d'Abonnement Admin (`/admin/subscription`)** :
   - Finaliser la vue dynamique affichant l'abonnement actuel du photographe, l'état de renouvellement et la grille des offres d'upgrade.
2. **Tunnel de Paiement Maketou** :
   - Vérifier la bonne redirection depuis la grille tarifaire vers le checkout Maketou.
3. **Préparation du Déploiement Production (o2switch)** :
   - Configuration de `.env.production` avec `VITE_API_URL=https://api.vanda-studio.org/api`.
   - Mise en place des fichiers `.htaccess` pour le routage SPA frontend.

---

## 5. Directives pour les Agents IA

- **Respect de la Séparation Admin / Client** : Ne jamais réutiliser les endpoints `/api/client/` dans le dashboard `/admin/`.
- **Règles de Code** :
  - Maintain Clean Architecture & Strong Typing (TypeScript).
  - Ne pas supprimer la signature temporaire des médias signés pour les galeries protégées par PIN.
  - Toujours valider les modifications avec `npm run build:admin` et tests Laravel.

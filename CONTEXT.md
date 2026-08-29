# CONTEXT.md — VANDA STUDIO

> État observé le **28 août 2026** dans le workspace local, sur la branche `main`.
> Le code et les tests restent les sources de vérité lorsqu'ils contredisent ce document.

Ce document résume le contexte fonctionnel, l'architecture technique, les invariants à préserver et les travaux encore ouverts afin de faciliter la collaboration entre développeurs et agents IA.

---

## 1. Présentation du produit

**VANDA STUDIO** est une plateforme SaaS destinée aux photographes professionnels et aux studios créatifs. Elle permet notamment de :

- créer et livrer des galeries sécurisées avec code PIN, sélection de photos et téléchargement ZIP ;
- créer des devis et factures en FCFA et enregistrer leurs règlements ;
- gérer des abonnements SaaS et des paiements Maketou ;
- construire et publier des sites vitrines et portfolios personnalisés ;
- administrer les photographes, forfaits et paramètres depuis un espace SuperAdmin.

### Stack technique actuelle

- **Frontend** : React 19, TypeScript 5.9, Vite 7, Tailwind CSS 3, Material UI 7, Lucide Icons, React Router DOM 7.
- **Backend** : PHP 8.2+, Laravel 12, Laravel Sanctum 4, Spatie Media Library 11.
- **Données** : MySQL en environnement cible ; SQLite est également utilisé par les tests hermétiques.
- **Paiements** : Maketou pour Mobile Money et cartes bancaires.
- **Déploiement cible** : Apache / o2switch, notamment sur `app.vanda-studio.org` et `api.vanda-studio.org`.

### Builds frontend

Le frontend produit deux SPA séparées :

- `dist-public` : landing page et expérience publique ;
- `dist-admin` : dashboard Photographe et SuperAdmin.

Les scripts se trouvent dans `frontend/package.json`. Les configurations Apache existent dans `frontend/deploy/public.htaccess` et `frontend/deploy/admin.htaccess`.

---

## 2. Architecture et sources de vérité

### Abonnements et entitlements

- `backend/config/subscriptions.php` définit le catalogue de référence, l'essai gratuit et les capacités/quota de chaque plan.
- La table et le modèle `SubscriptionPlan` fournissent les prix et l'état actif utilisés par le checkout.
- `SubscriptionEntitlementService` résout le plan effectif d'un utilisateur et applique les capacités backend.
- `GET /api/subscription/entitlements` expose au frontend la politique effective et l'usage courant.
- L'essai gratuit actuel correspond au plan **Starter pendant 30 jours**, sauf configuration contraire par `SUBSCRIPTION_TRIAL_DAYS`.

### Grille tarifaire actuelle

1. **Starter** : 5 000 FCFA/mois ou 50 000 FCFA/an — promotion : 2 500 FCFA/mois pendant 6 mois.
2. **Pro** : 11 000 FCFA/mois ou 100 000 FCFA/an — promotion : 5 000 FCFA/mois pendant 6 mois.
3. **Studio** : 25 000 FCFA/mois ou 250 000 FCFA/an — promotion : 15 000 FCFA/mois pendant 6 mois.

### Quotas effectivement appliqués

- **Starter** : 20 photos de portfolio et 4 galeries actives créées par mois.
- **Pro** : 500 photos de portfolio et 20 galeries actives créées par mois.
- **Studio** : photos de portfolio et galeries actives illimitées.
- La facturation est une capacité incluse ou non dans le plan ; aucun quota mensuel numérique de factures n'est actuellement appliqué.

Les contrôles backend sont réalisés dans les contrôleurs via `SubscriptionEntitlementService::authorize()`, `limit()` et `quotaExceeded()`. Il ne faut pas les présenter comme un middleware d'entitlements.

---

## 3. Routes et frontières de sécurité

### API authentifiée

Le groupe protégé par `auth:sanctum` et le middleware `active` contient notamment :

- `/api/admin/...` : galeries, photos, ZIP, factures et médias du builder ;
- `/api/site-configs/...` : gestion et publication des configurations de sites ;
- `/api/plans`, `/api/subscription/entitlements` et `/api/payment/...` : catalogue, abonnement et checkout ;
- `/api/superadmin/...` : utilisateurs, forfaits, métriques et paramètres, avec contrôle `superadmin` supplémentaire.

### API et pages publiques

- `/api/client/gallery/{uuid}` : consultation d'une galerie, éventuellement protégée par PIN ;
- `/api/client/gallery/{uuid}/like` : sélection d'une photo par le client ;
- `/api/sites/{slug}/config` : site publié dont le propriétaire possède un abonnement ou essai actif ;
- `/api/payment/maketou/webhook` : webhook Maketou avec throttling ;
- `/g/{uuid}` : partage de galerie avec métadonnées Open Graph générées par Laravel ;
- `/media/{path}` : diffusion globale des médias en local et en production.

### Invariants à préserver

- Le dashboard `/admin/` doit uniquement utiliser `/api/admin/` pour gérer les galeries, jamais l'endpoint client protégé par PIN.
- Toute opération authentifiée sur une ressource d'un photographe doit filtrer explicitement par propriétaire, par exemple avec `ownedByCurrentUser()` ou `user_id`.
- Les médias d'une galerie protégée par PIN doivent conserver leurs URL signées temporaires. `PublicMediaController` refuse ces médias lorsque la signature est absente ou invalide.
- Un site public doit être publié et rattaché à un utilisateur disposant d'un abonnement ou essai actif.
- Les quotas critiques doivent être vérifiés côté backend dans une transaction avec verrouillage lorsque des requêtes concurrentes pourraient dépasser une limite.

---

## 4. Fonctionnalités et correctifs déjà présents

### Galeries administrateur

- `galleryService.getAdminGalleryByUUID()` appelle `/api/admin/galleries/{uuid}`.
- Le contrôleur accepte l'identifiant numérique ou l'UUID et filtre par propriétaire.
- L'administrateur n'a pas à fournir le PIN client pour consulter sa galerie.

### Médias et sites vitrines

- La route `/media/{path}` est disponible globalement, y compris en développement local.
- Les chemins sont normalisés par `PublicMedia` et les médias protégés exigent une signature valide.
- La publication d'un site est soumise à la capacité `publish_site`.
- L'accès public renvoie volontairement 404 si le site n'est pas publié ou si l'abonnement du propriétaire est inactif.

### Onboarding, SEO et partage

- `OnboardingLifecycleService` enregistre notamment la première galerie, le premier partage, la première facture et la publication du site.
- Le dashboard contient une checklist d'activation et des emails lifecycle sont présents.
- Laravel expose les sitemaps, `robots.txt` et plusieurs familles de pages SEO programmatiques.
- Les galeries partagées disposent d'une route serveur pour enrichir les aperçus sociaux avant le chargement de React.

---

## 5. Travaux ouverts et priorités

### P0 — Réparer et tester le tunnel tarifaire vers Maketou

Le parcours n'est pas cohérent de bout en bout :

- les pages tarifaires transmettent `plan`, `billing_cycle` et parfois `checkout=true`, tout en enregistrant le choix dans `localStorage` ;
- après inscription, `SignUp.tsx` supprime `selectedPlan` et redirige directement vers `/admin/dashboard` ;
- `Subscription.tsx` ne lance un checkout automatique qu'avec `auto_checkout`, paramètre absent du parcours actuel.

Résultat attendu : préserver le plan et le cycle pendant l'inscription, rediriger l'utilisateur authentifié vers `/admin/subscription`, puis lancer explicitement le checkout approprié sans double création de panier.

### P1 — Finaliser `/admin/subscription`

La page affiche déjà les offres dynamiques, le choix mensuel/annuel et le checkout. Il reste à :

- charger `/api/subscription/entitlements` ;
- afficher le plan courant, sa source (`trial`, `subscription` ou `superadmin`) et sa date de fin ;
- distinguer souscription, upgrade et renouvellement ;
- traiter clairement les retours succès, annulation et échec du prestataire.

### P1 — Valider le déploiement o2switch

Les fichiers `.env.production` et `.htaccess` existent déjà. Il reste à vérifier :

- `VITE_API_URL=https://api.vanda-studio.org/api` lors des deux builds ;
- les fallbacks SPA, CORS, cookies Sanctum et domaines autorisés ;
- l'accès aux médias signés et aux galeries partagées ;
- la livraison et la vérification des webhooks Maketou ;
- les permissions du stockage en production.

---

## 6. Directives pour les agents IA

- Lire les manifestes et le code avant de se fier aux versions ou statuts indiqués ici.
- Préserver la séparation Admin / Client et l'isolation entre photographes.
- Ne jamais supprimer ou contourner la validation des signatures temporaires.
- Ne pas modifier directement les bundles dans `backend/public/app` ou `backend/public/landing` ; modifier les sources puis reconstruire.
- Ne pas inventer de quota ou de règle commerciale absente de `subscriptions.php` et des modèles.
- Maintenir le typage TypeScript et éviter de nouveaux `any` non justifiés.
- Ajouter des tests de régression pour tout correctif d'autorisation, paiement, quota ou isolation multi-utilisateur.

### Validation minimale après modification du code

Depuis la racine du dépôt :

```bash
cd frontend && npm run lint
cd frontend && npm run build
cd backend && composer test
```

Pour une modification strictement documentaire, relire le diff suffit.

---

## 7. Maintenance du document

Lorsqu'une tâche est terminée ou qu'une dépendance majeure évolue :

1. mettre à jour la date en tête ;
2. déplacer les éléments terminés dans la section des fonctionnalités présentes ;
3. vérifier les versions dans `frontend/package.json` et `backend/composer.json` ;
4. vérifier les règles commerciales dans `backend/config/subscriptions.php` ;
5. signaler explicitement les comportements partiels ou non testés.

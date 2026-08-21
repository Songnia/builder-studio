# Politique d’abonnement serveur

Cette politique traduit le contrat affiché dans `frontend/src/pages/PricingPage.tsx`. Le serveur est la source d’autorité; `localStorage.selectedPlan` ne confère aucun droit.

## Cycle de vie

- Tout nouveau compte actif reçoit un essai Starter de 30 jours à partir de `users.created_at`, sans carte bancaire.
- Un abonnement payant accorde ses droits lorsque `status = active`, que `starts_at` est atteint et que `ends_at` est absent ou futur.
- L’abonnement payant actif le plus récent prévaut sur l’essai.
- À l’expiration, aucune période de grâce n’est appliquée, car le frontend n’en annonce pas.
- Les données existantes restent consultables et modifiables dans l’espace privé. Les nouvelles ressources payantes et la remise en ligne sont bloquées.
- Un site ou une galerie client n’est plus servi publiquement lorsque le propriétaire n’a plus de droit actif.
- Un super-administrateur actif reçoit les capacités Studio pour ses opérations internes.

## Matrice des droits

| Droit | Starter | Pro | Studio |
|---|---:|---:|---:|
| Photos portfolio | 20 | 500 | Illimité |
| Galeries actives créées dans le mois | 4 | 20 | Illimité |
| Builder et sous-domaine Vanda | Oui | Oui | Oui |
| Publication du site | Oui, pendant la période active | Oui | Oui |
| Livraison sécurisée des galeries | Oui | Oui | Oui |
| Facturation et devis | Oui | Oui | Oui |
| Paiement en ligne et acomptes | Non | Oui | Oui |
| Domaine personnalisé | Non | Oui | Oui |
| Suppression de la marque Vanda | Non | Oui | Oui |
| API, webhooks, statistiques avancées et export | Non | Non | Oui |

Une galerie archivée et une galerie créée pendant un mois précédent ne consomment pas le quota du mois courant. Dépasser un quota n’efface ni ne désactive les ressources existantes; seule une nouvelle création ou une augmentation du nombre de photos est refusée.

## Contrat API

`GET /api/subscription/entitlements` renvoie la source du droit (`trial`, `subscription`, `superadmin` ou `none`), le plan effectif, les dates, la matrice machine et l’usage courant.

Les refus utilisent les codes applicatifs suivants :

- `subscription_required`, HTTP 402 : essai ou abonnement absent/expiré;
- `plan_upgrade_required`, HTTP 403 : capacité absente du plan;
- `quota_exceeded`, HTTP 403 : quota numérique atteint.

La durée de l’essai est configurable avec `SUBSCRIPTION_TRIAL_DAYS`, dont la valeur sûre par défaut est 30.

## Limites actuelles d’implémentation

La matrice décrit aussi les domaines personnalisés, paiements clients, webhooks, statistiques et exports. Ces modules ne disposent pas tous encore d’un endpoint métier dans la codebase; leurs droits sont exposés dès maintenant et devront être appliqués au point d’entrée serveur lors de leur implémentation. La durée mensuelle ou annuelle reste déterminée par `user_subscriptions.ends_at`; aucune durée n’est déduite du navigateur.

## Produits Maketou

Chaque niveau d’accès conserve les mêmes droits quel que soit le cycle. Le checkout choisit le produit Maketou à partir du cycle demandé côté serveur et enregistre ce cycle sur l’abonnement.

| Plan | Produit mensuel | Produit annuel | Prix annuel |
|---|---|---|---:|
| Starter | `0125f2a3-f95b-4298-9d5b-e053c84de9cb` | `f019d0e4-fb8d-434a-bc3e-758d5db46d90` | 50 000 F CFA |
| Pro | `c84a9886-ec7a-405a-a00e-2efb45035e6f` | `e1121214-39e8-4188-9b2d-c201b8999d42` | 100 000 F CFA |
| Studio | `31d7c6d1-62b2-4cfb-a979-f98e6d0e04de` | `bf278046-0097-489e-9f7f-395f0ed9bcfa` | 250 000 F CFA |

Le champ historique `subscription_plans.maketou_product_id` représente le produit mensuel. Le produit annuel est stocké dans `maketou_yearly_product_id`. Une souscription `monthly` reçoit une échéance d’un mois après confirmation ; une souscription `yearly` reçoit une échéance d’un an.

# VANDA STUDIO — Plan d'implémentation de l'onboarding (Mode D : Architecture + Handoff)

> Source de vérité : `onboarding-architecture.json`. Artefacts dérivés : `onboarding-events.json`, `persona-journeys.json`, `onboarding-friction-map.json`, `email-lifecycle-map.json`, `onboarding-analytics.json`.

## 1. Constat du codebase

- **Frontend** : React 18/19 + TS + Vite, build public (`dist-public`) et admin (`dist-admin`). Auth localStorage (`auth_token`, `user`). Le seul signal d'onboarding est `has_site` renvoyé par le login.
- **Backend** : Laravel 11/12 + Sanctum. Pas d'état d'onboarding, pas d'email (aucun Mailable/job), pas d'analytics. Le code contient déjà un « AHA MOMENT » commenté (auto-publication du site après 1er paiement Maketou).
- **Produit** : photographes professionnels. Core = builder de site (10 étapes) + galeries de livraison + facturation + abonnement Maketou (FCFA).

## 2. Modèle d'activation

| Persona | Première valeur | Wow moment | Critère d'activation |
| --- | --- | --- | --- |
| Photographe nouveau | Site vitrine publié | `site_published` (site en ligne) | site_published |
| Photographe actif | Première galerie livrée | `first_gallery_viewed_by_client` | 1ère galerie créée + partagée |
| Photographe Pro/Studio | Première facture payée | `first_invoice_paid` | première facture créée |
| Client final | Galerie déverrouillée | `gallery_pin_unlocked` | PIN débloqué |

Chemin de valeur : `inscription → builder (10 min) → sauvegarde config → publication → site en ligne (WOW)`.

## 3. Frictions bloquantes (Tier 1)

| # | Friction | Fichiers | Fix |
| --- | --- | --- | --- |
| 1 | Redirect post-signup incohérent (dashboard vide au lieu du builder) | `pages/SignUp.tsx` vs `pages/Login.tsx` | rediriger vers builder OU dashboard + welcome |
| 2 | `/admin/subscription` et `/admin/profile` absents de `AppAdmin.tsx` → 404 | `AppAdmin.tsx`, `UpgradeDialog.tsx` | ajouter les routes |
| 3 | Dashboard vide sans CTA ni checklist | `AdminDashboard.tsx`, `ui/empty.tsx` (inutilisé) | état vide + checklist de capacités |
| 4 | Aucun mécanisme d'onboarding ni analytics | global | welcome modal + instrumentation |
| 5 | TOTAL_STEPS=9 vs 10 étapes du builder | `hooks/useBuilder.ts` | corriger le compteur |
| 6 | Publish gated par UpgradeDialog, limites cosmétiques | `PreviewStep.tsx`, `usePlanLimits.ts` | **décision produit requise** |
| 7 | `selectedPlan` supprimé à l'inscription | `SignUp.tsx` | conserver l'intention d'abonnement |

## 4. Composants à créer

- `WelcomeModal` — orientation + choix d'objectif (une fois, dismissible). État : colonnes `users.onboarding_welcome_seen` + `onboarding_goal` (migration).
- `OnboardingChecklist` — « Créer mon site », « Livrer ma première galerie », « Créer ma première facture » (CTAs, cochés via compteurs backend).
- `DashboardEmptyState` — remplace « Aucune livraison trouvée. » avec CTA primaire.
- `PublishSuccessView` — URL publique + « Voir mon site » + prochaine étape.

## 5. Backend

- `GET /api/onboarding/state` → `{ has_site, has_published, gallery_count, invoice_count, subscription_active, has_seen_welcome, goal }`.
- `POST /api/onboarding/goal`, `POST /api/onboarding/welcome-seen`.
- `POST /api/events` (ou SDK PostHog) pour l'instrumentation.
- Migrations : colonnes onboarding sur `users`, table `onboarding_events`, (option) `phone/bio/avatar`.

## 6. Emails (Phase 3)

Behavior-driven, avec `send_if`/`suppress_if` (cf. `email-lifecycle-map.json`) :
welcome immédiat → builder rescue 24h/72h → publish confirmation → first delivery nudge (3j) → checkout rescue (24h) → inactivity recovery (14j).

Backend : 7 Mailables + commandes planifiées (scheduler hourly). Configurer `MAIL_MAILER` (SMTP/Resend/Mailgun), `QUEUE_CONNECTION=database` (déjà en place).

## 7. Analytics

- SDK (PostHog) ou endpoint `POST /api/events`.
- Événements minimaux Phase 1 : `account_created`, `site_builder_started`, `site_builder_step_viewed`, `site_config_saved`, `site_published`, `login_return`.
- Métriques clés : **Activation Rate** (site_published ≤ 7j), **Time to First Value**, **Journey Completion**, **Step Drop-off**, **First Delivery Rate**, **Checkout Completion**.

## 8. Rollout

1. **Phase 1** — fixes bloquants + activation + analytics.
2. **Phase 2** — welcome modal, politique de publication clarifiée, succès de publication.
3. **Phase 3** — emails de cycle de vie.
4. **Phase 4** — adoption avancée (tour facturation, profil enrichi, fix galerie client / panier, statut galerie).

## 9. Décisions produit requises (ne pas inventer)

1. **Publication** : gratuite pendant le trial 30 jours, ou payante ? (impacte UpgradeDialog + auto-publish backend).
2. **selectedPlan** : conserver l'intention d'abonnement après inscription ?
3. **Limites de plans** : appliquer réellement (20 photos / 4 galeries Starter) ou laisser Infinity ?

## 10. Tests à écrire

- Redirect post-signup (frontend).
- Routes subscription/profile présentes dans AppAdmin (frontend).
- `GET /api/onboarding/state` correct selon seed (backend).
- Suppression email (send_if/suppress_if) (backend).
- Welcome modal : une seule fois, dismissible, goal persisté (frontend).
- Checklist : cochée selon compteurs, CTA fonctionnels (frontend).
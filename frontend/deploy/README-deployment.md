# Déploiement VANDA STUDIO

La procédure o2switch de référence se trouve dans
[`docs/guide-mise-a-jour-production-o2switch.md`](../../docs/guide-mise-a-jour-production-o2switch.md).

L'architecture de production sert les deux builds depuis Laravel :

- `dist-public` est synchronisé vers `backend/public/landing` ;
- `dist-admin` est synchronisé vers `backend/public/app` ;
- `vanda-studio.org`, `app.vanda-studio.org` et `api.vanda-studio.org`
  doivent partager la racine documentaire `backend/public`.

Ne déployez pas les dossiers `dist-*` comme racines indépendantes sur o2switch :
cela contournerait les routes Laravel, les pages SEO et la répartition multi-domaines
définie dans `backend/public/.htaccess`.

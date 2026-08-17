# VANDA STUDIO — Frontend (React + TypeScript + Vite)

Applications React 19 (site public + application admin) de VANDA STUDIO, construites en deux bundles distincts via la variable `VITE_APP_MODE`.

## Structure
- `index-public.html` → site public (vanda-studio.org) → `dist-public/`
- `index-admin.html` → application admin (app.vanda-studio.org) + PWA → `dist-admin/`

## Stack
- React 19, TypeScript 5, Vite 6
- UI : MUI (Material UI), Radix, Tailwind CSS
- PWA : vite-plugin-pwa (Workbox, auto-update)

## Démarrage
```bash
cp .env.example .env
npm install
npm run dev                     # site public
VITE_APP_MODE=admin npm run dev # application admin
```

## Builds
```bash
npm run build                          # dist-public
VITE_APP_MODE=admin npm run build      # dist-admin
```

Voir le [README racine](../README.md) pour la documentation complète du projet.
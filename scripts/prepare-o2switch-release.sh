#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="${ROOT_DIR}/frontend"
BACKEND_DIR="${ROOT_DIR}/backend"
RELEASE_DIR="${ROOT_DIR}/releases/o2switch-manual"
STAGING_DIR="$(mktemp -d)"

cleanup() {
    rm -rf "${STAGING_DIR}"
}
trap cleanup EXIT

command -v npm >/dev/null 2>&1 || { echo "npm est requis" >&2; exit 1; }
command -v zip >/dev/null 2>&1 || { echo "zip est requis" >&2; exit 1; }

echo "[1/5] Construction des deux applications frontend"
cd "${FRONTEND_DIR}"
npm run build

echo "[2/5] Validation des bundles de production"
test -f dist-public/index.html
test -f dist-public/index-public.html
test -f dist-public/.htaccess
test -f dist-admin/index.html
test -f dist-admin/index-admin.html
test -f dist-admin/.htaccess

if grep -R -n -E 'localhost:(5173|8000)|127\.0\.0\.1:(5173|8000)' dist-public dist-admin; then
    echo "Une URL locale subsiste dans les bundles. Publication refusée." >&2
    exit 1
fi

grep -R -q 'api.vanda-studio.org/api' dist-public/assets dist-admin/assets || {
    echo "L'URL de l'API de production est absente des bundles." >&2
    exit 1
}

echo "[3/5] Préparation du code Laravel sans secrets ni données persistantes"
mkdir -p "${STAGING_DIR}/backend/public" "${RELEASE_DIR}"

cp -a \
    "${BACKEND_DIR}/app" \
    "${BACKEND_DIR}/bootstrap" \
    "${BACKEND_DIR}/config" \
    "${BACKEND_DIR}/database" \
    "${BACKEND_DIR}/resources" \
    "${BACKEND_DIR}/routes" \
    "${STAGING_DIR}/backend/"

cp -a \
    "${BACKEND_DIR}/artisan" \
    "${BACKEND_DIR}/composer.json" \
    "${BACKEND_DIR}/composer.lock" \
    "${STAGING_DIR}/backend/"

for public_file in .htaccess .user.ini favicon.ico index.php robots.txt; do
    if [[ -f "${BACKEND_DIR}/public/${public_file}" ]]; then
        cp -a "${BACKEND_DIR}/public/${public_file}" "${STAGING_DIR}/backend/public/"
    fi
done

# Les caches locaux ne doivent jamais être livrés à la production.
find "${STAGING_DIR}/backend/bootstrap/cache" -type f ! -name '.gitignore' -delete

echo "[4/5] Création des trois archives pour cPanel"
rm -f \
    "${RELEASE_DIR}/01-backend.zip" \
    "${RELEASE_DIR}/02-public.zip" \
    "${RELEASE_DIR}/03-admin.zip"

(
    cd "${STAGING_DIR}/backend"
    zip -qr "${RELEASE_DIR}/01-backend.zip" .
)
(
    cd "${FRONTEND_DIR}/dist-public"
    zip -qr "${RELEASE_DIR}/02-public.zip" .
)
(
    cd "${FRONTEND_DIR}/dist-admin"
    zip -qr "${RELEASE_DIR}/03-admin.zip" .
)

echo "[5/5] Contrôle du contenu sensible"
if unzip -Z1 "${RELEASE_DIR}/01-backend.zip" | grep -E '(^|/)(\.env|vendor|storage/app/public)(/|$)'; then
    echo "L'archive backend contient un fichier interdit." >&2
    exit 1
fi

printf '\nArchives prêtes dans %s :\n' "${RELEASE_DIR}"
du -h "${RELEASE_DIR}"/*.zip

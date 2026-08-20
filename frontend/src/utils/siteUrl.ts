/**
 * Returns the correct URL for a photographer's site based on the current environment.
 *
 * - In development (VITE_PUBLIC_DOMAIN is empty):
 *   → /${slug}  (local React Router route)
 *
 * - In production (VITE_PUBLIC_DOMAIN = "vanda-studio.org"):
 *   → https://${slug}.vanda-studio.org
 */
export function getSiteUrl(slug: string): string {
    const domain = import.meta.env.VITE_PUBLIC_DOMAIN;

    if (domain) {
        // Production: subdomain URL
        return `https://${slug}.${domain}`;
    }

    // Local: relative path handled by React Router (AppPublic)
    return `/${slug}`;
}

/**
 * Returns the target attribute for the site link.
 * In production, open in a new tab since it's an external domain.
 */
export function getSiteTarget(_slug: string): '_blank' | '_self' {
    const domain = import.meta.env.VITE_PUBLIC_DOMAIN;
    return domain ? '_blank' : '_self';
}

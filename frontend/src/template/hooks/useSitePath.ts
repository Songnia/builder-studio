import { useParams } from 'react-router-dom';
import { getSubdomainInfo } from '@/utils/subdomain';

function normalizePath(path: string) {
  if (!path || path === '/') {
    return '/';
  }

  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Builds internal photographer-site routes correctly in both modes:
 * - local / main domain: /:slug/about
 * - production photographer subdomain: /about
 */
export function useSitePath(explicitSlug?: string) {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const { type } = getSubdomainInfo();
  const slug = explicitSlug || routeSlug || null;

  const getPath = (path: string = '/') => {
    const normalizedPath = normalizePath(path);

    if (type === 'photographer') {
      return normalizedPath;
    }

    if (!slug) {
      return normalizedPath;
    }

    return normalizedPath === '/' ? `/${slug}` : `/${slug}${normalizedPath}`;
  };

  return {
    getPath,
    slug,
    subdomainType: type,
  };
}

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { siteConfigService } from '@/services/siteConfigService';
import type { SiteConfig } from '@/types/builder';
import { defaultSiteConfig } from '@/types/builder';

// ============================================
// INTERFACES
// ============================================

interface SiteConfigContextType {
    config: SiteConfig | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

interface SiteConfigProviderProps {
    children: React.ReactNode;
    initialConfig?: SiteConfig; // Mode preview: config fournie directement
    slug?: string; // Slug explicite (ex: pour la vue galerie)
}

// ============================================
// CONTEXT
// ============================================

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

export function SiteConfigProvider({ children, initialConfig, slug: explicitSlug }: SiteConfigProviderProps) {
    const { slug: urlSlug } = useParams<{ slug: string }>();
    const slug = explicitSlug || urlSlug;
    const [config, setConfig] = useState<SiteConfig | null>(initialConfig || null);
    const [loading, setLoading] = useState(!initialConfig && !!slug); // Loading seulement si on doit fetch
    const [error, setError] = useState<string | null>(null);

    const fetchConfig = async () => {
        // Si initialConfig fourni, on est en mode preview (pas d'appel API)
        if (initialConfig) {
            setConfig(initialConfig);
            setLoading(false);
            return;
        }

        // Sinon, on charge depuis l'API
        if (!slug) {
            setError('Slug non fourni');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Appel API pour récupérer la config du site
            const response = await siteConfigService.getPublicSite(slug);

            // Merge avec defaultSiteConfig pour garantir tous les champs
            const fullConfig: SiteConfig = {
                ...defaultSiteConfig,
                ...response.config_data,
                siteName: response.site_name || defaultSiteConfig.siteName,
                // Note: On peut ajouter d'autres mappings si nécessaire
                // ex: email: response.photographer.email
            };

            setConfig(fullConfig);
        } catch (err: any) {
            console.error('Erreur chargement config:', err);

            if (!err.response) {
                setError("Impossible de joindre l'API du site. Vérifiez la configuration CORS ou l'accès au domaine API.");
            } else {
                setError(err.response?.data?.message || 'Site non trouvé ou non publié');
            }

            setConfig(null);
        } finally {
            setLoading(false);
        }
    };

    // Charger la config au montage ou quand le slug change
    useEffect(() => {
        // Si initialConfig fourni, pas besoin de fetch
        if (initialConfig) {
            setConfig(initialConfig);
            setLoading(false);
            return;
        }

        fetchConfig();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]); // On ne met pas initialConfig dans les dépendances

    // Mettre à jour la config si initialConfig change (mode preview)
    useEffect(() => {
        if (initialConfig) {
            setConfig(initialConfig);
        }
    }, [initialConfig]);

    return (
        <SiteConfigContext.Provider value={{ config, loading, error, refetch: fetchConfig }}>
            {children}
        </SiteConfigContext.Provider>
    );
}

// ============================================
// HOOK
// ============================================

export function useSiteConfig() {
    const context = useContext(SiteConfigContext);
    if (!context) {
        throw new Error('useSiteConfig must be used within a SiteConfigProvider');
    }
    return context;
}

import React from 'react';
import { Box, ThemeProvider, CssBaseline, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { SiteConfigProvider, useSiteConfig } from '@/context/SiteConfigContext';
import { CartProvider } from '@/template/context/CartContext';
import { createThemeFromConfig } from '@/template/theme/theme';
import i18nInstance from '@/template/i18n';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
    slug?: string; // Slug explicite (mode sous-domaine wildcard)
}

/**
 * Composant interne qui utilise le context de configuration
 */
const LayoutContent: React.FC = () => {
    const { config, loading, error } = useSiteConfig();

    // Hooks must run in the same order on loading, error and loaded renders.
    React.useEffect(() => {
        if (!config) return;

        const loadFont = (font: string) => {
            if (!font) return;
            const fontUrlName = font.trim().replace(/"/g, '').replace(/'/g, '').replace(/ /g, '+');
            const linkId = `gfont-site-${fontUrlName.toLowerCase()}`;
            if (document.getElementById(linkId)) return;

            const link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${fontUrlName}:wght@300;400;500;600;700;800;900&display=swap`;
            document.head.appendChild(link);
        };

        if (config.primaryFont) loadFont(config.primaryFont);
        if (config.secondaryFont) loadFont(config.secondaryFont);
    }, [config]);

    // État de chargement
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#f8f8f5] w-full">
                <div className="relative w-14 h-14">
                    <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-green-500 rounded-full animate-spin"></div>
                </div>
                <h6 className="text-slate-500 font-medium text-lg animate-pulse">Chargement de votre site...</h6>
            </div>
        );
    }

    // État d'erreur
    if (error || !config) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    gap: 2,
                    textAlign: 'center',
                    px: 3,
                    bgcolor: '#f8f8f5',
                }}
            >
                <Typography variant="h3" sx={{ color: '#ef4444', fontWeight: 'bold' }}>
                    Oups !
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {error || "Ce site n'existe pas ou n'est pas encore publié."}
                </Typography>
            </Box>
        );
    }

    // Création du thème dynamique
    const dynamicTheme = createThemeFromConfig(config);

    const isSecondaryDark = (color: string) => {
        if (!color) return false;
        const clean = color.replace('#', '');
        if (clean.length !== 6 && clean.length !== 3) return false;
        const r = parseInt(clean.length === 3 ? clean[0] + clean[0] : clean.substring(0, 2), 16);
        const g = parseInt(clean.length === 3 ? clean[1] + clean[1] : clean.substring(2, 4), 16);
        const b = parseInt(clean.length === 3 ? clean[2] + clean[2] : clean.substring(4, 6), 16);
        return ((r * 299) + (g * 587) + (b * 114)) / 1000 < 128;
    };

    return (
        <ThemeProvider theme={dynamicTheme}>
            <CssBaseline />
            <CartProvider>
                <Box
                    className="template-wrapper"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100vh',
                        width: '100%',
                        m: 0,
                        p: 0,
                        // Injection des CSS variables pour Tailwind/utilitaires
                        '--primary-color': dynamicTheme.palette.primary.main,
                        '--secondary-color': dynamicTheme.palette.secondary.main,
                        '--accent-color': config.accentColor,
                        '--background-color': dynamicTheme.palette.background.default,
                        '--text-color': dynamicTheme.palette.text.primary,
                        '--subtitle-color': dynamicTheme.palette.text.secondary,
                        '--text-alt-color': dynamicTheme.palette.secondary.contrastText,
                        '--subtitle-alt-color': isSecondaryDark(dynamicTheme.palette.secondary.main) ? '#a1a1aa' : '#79747e',
                        '--primary-font': config.primaryFont ? `"${config.primaryFont}", serif` : '"Playfair Display", serif',
                        '--secondary-font': config.secondaryFont ? `"${config.secondaryFont}", sans-serif` : '"Inter", sans-serif',
                    } as React.CSSProperties}
                >
                    <Navbar />
                    <Box component="main" sx={{ flexGrow: 1, width: '100%', m: 0, p: 0 }}>
                        <Outlet />
                    </Box>
                    <Footer />
                </Box>
            </CartProvider>
        </ThemeProvider>
    );
};

/**
 * Layout principal pour les sites publics
 * Wrapper avec SiteConfigProvider pour charger la config via API
 * 
 * - Mode route (/:slug) : le slug vient de useParams automatiquement
 * - Mode sous-domaine (slug.vanda-studio.org) : le slug est passé en prop
 */
const Layout: React.FC<LayoutProps> = ({ slug }) => {
    return (
        <I18nextProvider i18n={i18nInstance}>
            <SiteConfigProvider slug={slug}>
                <LayoutContent />
            </SiteConfigProvider>
        </I18nextProvider>
    );
};

export default Layout;

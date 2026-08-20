import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    AppBar,
    Toolbar,
    Button,
    IconButton,
    Badge,
    Snackbar,
    Alert,
    Container,
    CircularProgress,
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Download as DownloadIcon,
    Send as SendIcon,
    GetApp as GetAppIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { galleryService } from '../../services/galleryService';
import Navbar from '../../template/components/Layout/Navbar';
import Footer from '../../template/components/Layout/Footer';
import { SiteConfigProvider, useSiteConfig } from '@/context/SiteConfigContext';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import type { Gallery } from '../../types/gallery';

const GalleryContent: React.FC<{ gallery: Gallery; onUpdateGallery: (g: Gallery) => void }> = ({ gallery, onUpdateGallery }) => {
    const { uuid } = useParams<{ uuid: string }>();
    const { config } = useSiteConfig();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleToggleLike = async (imageId: string) => {
        if (uuid) {
            galleryService.toggleImageLike(uuid, imageId);
            // Refresh gallery
            const result = await galleryService.getGalleryByUUID(uuid);
            if (result.gallery) {
                onUpdateGallery(result.gallery);
            }
        }
    };

    const handleDownloadSingle = (imageUrl: string, filename: string) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = filename;
        link.click();
    };

    const handleDownloadAll = () => {
        if (gallery?.zipFileUrl && gallery.zipFileUrl !== '#') {
            const link = document.createElement('a');
            link.href = gallery.zipFileUrl;
            link.download = `${gallery.title}.zip`;
            link.click();
        } else {
            setSnackbarMessage('Aucun fichier ZIP disponible');
            setSnackbarOpen(true);
        }
    };

    const handleSendSelection = () => {
        setSnackbarMessage('Sélection envoyée avec succès!');
        setSnackbarOpen(true);
    };

    const selectedCount = gallery.images.filter(img => img.isLiked).length;
    const heroImage = gallery.images[0]?.url || '';

    // Create dynamic theme based on photographer's branding
    const photographerTheme = createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: config?.primaryColor || '#4caf50',
                contrastText: '#ffffff',
            },
            secondary: {
                main: config?.secondaryColor || '#ffffff',
                contrastText: config?.textColor || '#000000',
            },
            background: {
                default: config?.backgroundColor || '#ffffff',
                paper: '#ffffff',
            },
            text: {
                primary: config?.textColor || '#000000',
                secondary: '#666666',
            },
        },
        typography: {
            fontFamily: '"Inter", "sans-serif"',
            h1: {
                fontFamily: '"Playfair Display", "serif"',
            },
        },
    });

    return (
        <ThemeProvider theme={photographerTheme}>
            <Box>
                <Navbar basePath={gallery.photographerSlug} />
                {/* Hero Section */}
                <Box
                    sx={{
                        height: '70vh',
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), ${alpha(photographerTheme.palette.primary.main, 0.2)}), url("${heroImage}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center', // Centered vertically but we'll adjust with padding/margin
                        alignItems: 'flex-start',
                        p: { xs: 3, md: 6 },
                        position: 'relative',
                    }}
                >
                    <Box sx={{ mb: 8, maxWidth: '800px' }}> {/* Push text up slightly */}
                        <Typography
                            variant="h1"
                            sx={{
                                color: 'secondary.main',
                                textShadow: `2px 2px 8px ${alpha(photographerTheme.palette.primary.main, 0.5)}`,
                                fontSize: { xs: '3rem', md: '4.5rem' }, // Larger font
                                mb: 2,
                                fontFamily: '"Playfair Display", serif', // Ensure serif font
                            }}
                        >
                            {gallery.title}
                        </Typography>

                        {gallery.description && (
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'secondary.main',
                                    textShadow: `1px 1px 4px ${alpha(photographerTheme.palette.primary.main, 0.5)}`,
                                    mb: 1,
                                    fontWeight: 300,
                                }}
                            >
                                {config?.siteName || 'VANDA STUDIO'}
                            </Typography>
                        )}

                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: 'rgba(255,255,255,0.8)', // White discreet
                                textShadow: '1px 1px 4px primary.transparent',
                                fontWeight: 400, // Not bold
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                fontSize: '0.85rem',
                            }}
                        >
                        </Typography>
                    </Box>

                    {/* Download Button - Bottom Left */}
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<GetAppIcon />}
                        onClick={handleDownloadAll}
                        sx={{
                            position: 'absolute',
                            bottom: { xs: 24, md: 48 },
                            right: { xs: 24, md: 48 }, // Moved to right
                            fontWeight: 'bold',
                            color: 'secondary',
                            px: 3,
                            py: 1.5,
                            fontSize: '1rem',
                            boxShadow: `0 4px 12px ${alpha(photographerTheme.palette.primary.main, 0.3)}`,
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            }
                        }}
                    >
                        Tout télécharger
                    </Button>
                </Box>

                {/* Sticky Action Bar */}
                <AppBar
                    position="sticky"
                    color="default"
                    elevation={2}
                    sx={{
                        top: 0,
                        backgroundColor: 'rgba(255,255,255,0.98)',
                        backdropFilter: 'blur(8px)',
                    }}
                >
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', letterSpacing: 1, color: 'secondary.main' }}>
                                MA GALERIE
                            </Typography>
                            <Box sx={{ width: '1px', height: '20px', bgcolor: 'divider' }} />
                            <Typography variant="body2" color="text.secondary">
                                {gallery.images.length} photos
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            {selectedCount > 0 && (
                                <Badge badgeContent={selectedCount} color="primary">
                                    <Typography variant="body2" sx={{ mr: 1 }}>
                                        choisies
                                    </Typography>
                                </Badge>
                            )}

                            {/* Download button moved to Hero */}

                            {selectedCount > 0 && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SendIcon />}
                                    onClick={handleSendSelection}
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    Envoyer
                                </Button>
                            )}
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Masonry Gallery */}
                <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
                    <ResponsiveMasonry
                        columnsCountBreakPoints={{
                            350: 2, // 2 columns on mobile
                            750: 2,
                            900: 3,
                            1200: 4
                        }}
                    >
                        <Masonry gutter="16px">
                            {gallery.images.map((image) => (
                                <Box
                                    key={image.id}
                                    sx={{
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderRadius: '4px',
                                        '&:hover .overlay': {
                                            opacity: 1,
                                        },
                                    }}
                                >
                                    <img
                                        src={image.url}
                                        alt={image.filename}
                                        style={{ width: '100%', display: 'block' }}
                                    />

                                    {/* Overlay on hover */}
                                    <Box
                                        className="overlay"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: alpha(photographerTheme.palette.primary.main, 0.8),
                                            opacity: 0,
                                            transition: 'opacity 0.3s',
                                            display: 'flex',
                                            gap: 2,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <IconButton
                                            onClick={() => handleToggleLike(image.id)}
                                            sx={{
                                                backgroundColor: 'rgba(255,255,255,0.2)',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255,0.3)',
                                                },
                                            }}
                                        >
                                            {image.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                        </IconButton>

                                        <IconButton
                                            onClick={() => handleDownloadSingle(image.url, image.filename)}
                                            sx={{
                                                backgroundColor: 'rgba(255,255,255,0.2)',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255,0.3)',
                                                },
                                            }}
                                        >
                                            <DownloadIcon />
                                        </IconButton>
                                    </Box>

                                    {/* Like indicator */}
                                    {image.isLiked && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                backgroundColor: 'primary.main',
                                                borderRadius: '50%',
                                                p: 0.5,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <FavoriteIcon sx={{ fontSize: 20, color: 'text.primary' }} />
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </Masonry>
                    </ResponsiveMasonry>
                </Container>

                {/* Snackbar */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity="success" variant="filled">
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
                <Footer />
            </Box>
        </ThemeProvider>
    );
};

const ClientGalleryView: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const [gallery, setGallery] = useState<Gallery | null>(null);
    const [loading, setLoading] = useState(true);
    const [requiresPin, setRequiresPin] = useState(false);
    const [pinInput, setPinInput] = useState('');
    const [pinError, setPinError] = useState('');
    const [activePin, setActivePin] = useState<string | undefined>();

    const fetchGallery = async (pinToTry?: string) => {
        if (!uuid) return;
        setLoading(true);
        setPinError('');
        try {
            const res = await galleryService.getGalleryByUUID(uuid, pinToTry);
            if (res.requiresPin) {
                setRequiresPin(true);
                if (res.errorMsg) {
                    setPinError(res.errorMsg);
                }
            } else if (res.gallery) {
                setGallery(res.gallery);
                setRequiresPin(false);
                if (pinToTry) {
                    setActivePin(pinToTry);
                }
            }
        } catch (error) {
            console.error("Failed to fetch gallery", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, [uuid]);

    const handlePinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pinInput.trim()) {
            setPinError('Veuillez saisir votre code PIN.');
            return;
        }
        fetchGallery(pinInput.trim());
    };

    if (loading && !requiresPin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4 w-full">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-green-500 rounded-full animate-spin"></div>
                </div>
                <p className="text-slate-400 font-medium animate-pulse">Votre galerie est en cours de chargement...</p>
            </div>
        );
    }

    if (requiresPin && !gallery) {
        return (
            <Box
                sx={{
                    minHeight: '80vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    color: 'white',
                }}
            >
                <Container maxWidth="xs">
                    <Box
                        component="form"
                        onSubmit={handlePinSubmit}
                        sx={{
                            backgroundColor: 'rgba(30, 41, 59, 0.7)',
                            backdropFilter: 'blur(16px)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            p: 4,
                            textAlign: 'center',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        }}
                    >
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                                color: '#818cf8',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 3,
                            }}
                        >
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 002-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </Box>

                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                            Galerie Protégée
                        </Typography>
                        
                        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
                            Cette galerie est privée. Veuillez saisir le code PIN fourni par votre studio / créateur pour accéder aux fichiers.
                        </Typography>

                        {pinError && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
                                {pinError}
                            </Alert>
                        )}

                        <input
                            type="password"
                            maxLength={10}
                            placeholder="Code PIN"
                            value={pinInput}
                            onChange={(e) => setPinInput(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 rounded-lg text-white text-center text-xl tracking-widest focus:outline-none focus:border-indigo-500 transition mb-4 placeholder:text-slate-600 placeholder:text-base placeholder:tracking-normal"
                            autoFocus
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                py: 1.5,
                                borderRadius: '8px',
                                background: 'linear-gradient(to right, #6366f1, #4f46e5)',
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(to right, #4f46e5, #4338ca)',
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Accéder aux photos'}
                        </Button>
                    </Box>
                </Container>
            </Box>
        );
    }

    if (!gallery) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h4" color="text.secondary">
                    Galerie introuvable
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    Vérifiez le lien ou contactez le studio / créateur
                </Typography>
            </Container>
        );
    }

    return (
        <SiteConfigProvider slug={gallery.photographerSlug}>
            <GalleryContent 
                gallery={gallery} 
                onUpdateGallery={async () => {
                    const { gallery: updated } = await galleryService.getGalleryByUUID(uuid!, activePin);
                    if (updated) setGallery(updated);
                }} 
            />
        </SiteConfigProvider>
    );
};

export default ClientGalleryView;

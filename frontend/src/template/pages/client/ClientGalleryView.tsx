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
import type { Gallery } from '../../types/gallery';

import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';

const ClientGalleryView: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const [gallery, setGallery] = useState<Gallery | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const fetchGallery = async () => {
            if (uuid) {
                try {
                    const g = await galleryService.getGalleryByUUID(uuid);
                    setGallery(g);
                } catch (error) {
                    console.error("Failed to fetch gallery", error);
                }
            }
        };
        fetchGallery();
    }, [uuid]);

    const handleToggleLike = async (imageId: string) => {
        if (uuid) {
            galleryService.toggleImageLike(uuid, imageId);
            // Refresh gallery
            const updatedGallery = await galleryService.getGalleryByUUID(uuid);
            setGallery(updatedGallery);
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

    if (!gallery) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center', flexGrow: 1 }}>
                    <Typography variant="h4" color="text.secondary">
                        Galerie introuvable
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                        Vérifiez le lien ou contactez le studio / créateur
                    </Typography>
                </Container>
                <Footer />
            </Box>
        );
    }

    const selectedCount = gallery.images.filter(img => img.isLiked).length;
    const heroImage = gallery.images[0]?.url || '';

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <Box component="main" sx={{ flexGrow: 1 }}>
                {/* Hero Section */}
                <Box
                    sx={{
                        height: '70vh',
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${heroImage})`,
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
                                color: 'white',
                                textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
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
                                    color: 'white',
                                    textShadow: '1px 1px 4px rgba(0,0,0,0.7)',
                                    mb: 1,
                                    fontWeight: 300,
                                }}
                            >
                                {gallery.description}
                            </Typography>
                        )}

                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: 'rgba(255,255,255,0.8)', // White discreet
                                textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
                                fontWeight: 400, // Not bold
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                fontSize: '0.85rem',
                            }}
                        >
                            ULTIMA STUDIOS
                        </Typography>
                    </Box>

                    {/* Download Button - Bottom Left */}
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<GetAppIcon />}
                        onClick={handleDownloadAll}
                        sx={{
                            position: 'absolute',
                            bottom: { xs: 24, md: 48 },
                            right: { xs: 24, md: 48 }, // Moved to right
                            color: 'black', // Black text
                            fontWeight: 'bold',
                            px: 3,
                            py: 1.5,
                            fontSize: '1rem',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
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
                        zIndex: 1100, // Ensure it sits below Navbar if Navbar is fixed, but typical AppBars are 1100.
                        // However, Navbar is sticky too. If Navbar is position: sticky, then this one will stick below it if configured right.
                        // Or if Navbar is the top sticky element, this one will stick below it. 
                        // Let's assume standard behavior for now.
                    }}
                >
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                {gallery.images.length} photos
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            {selectedCount > 0 && (
                                <Badge badgeContent={selectedCount} color="primary">
                                    <Typography variant="body2" sx={{ mr: 1 }}>
                                        Sélectionnées
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
                                            background: 'rgba(0,0,0,0.5)',
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
            </Box>

            <Footer />

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
        </Box>
    );
};

export default ClientGalleryView;

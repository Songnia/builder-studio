import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Chip, useTheme, useMediaQuery, IconButton, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack as BackIcon, Favorite as FavoriteIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { galleryService } from '../../services/galleryService';
import type { Gallery } from '../../types/gallery';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

const GalleryManagement: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [gallery, setGallery] = useState<Gallery | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchGallery = async () => {
        if (uuid) {
            try {
                const g = await galleryService.getAdminGalleryByUUID(uuid);
                setGallery(g);
            } catch (error) {
                console.error("Failed to fetch gallery", error);
            }
        }
    };

    useEffect(() => {
        fetchGallery();
    }, [uuid]);

    const handleAddPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !uuid) return;

        setLoading(true);
        try {
            const files = Array.from(e.target.files);
            await galleryService.addPhotosToGallery(uuid, files);
            await fetchGallery();
        } catch (error) {
            console.error("Failed to add photos", error);
            alert("Erreur lors de l'ajout des photos.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePhoto = async (photoId: string) => {
        if (!uuid || !window.confirm('Supprimer cette photo ?')) return;

        try {
            await galleryService.deletePhotoFromGallery(uuid, photoId);
            await fetchGallery();
        } catch (error) {
            console.error("Failed to delete photo", error);
            alert("Erreur lors de la suppression de la photo.");
        }
    };

    // Export function removed for cleanup

    if (!gallery) {
        return (
            <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
                <Typography variant="h5" color="text.secondary">
                    Galerie introuvable
                </Typography>
            </Container>
        );
    }

    const selectedCount = gallery.images.filter(img => img.isLiked).length;

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Button
                    startIcon={<BackIcon />}
                    onClick={() => navigate('/admin/dashboard')}
                    sx={{ mb: 2 }}
                >
                    Retour au dashboard
                </Button>

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2,
                    mb: 2
                }}>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
                            {gallery.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {gallery.description}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth={isMobile}
                            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                            disabled={loading}
                            sx={{
                                backgroundColor: 'primary.main',
                                color: 'black',
                                fontWeight: 'bold',
                                py: 1.5,
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                }
                            }}
                        >
                            Ajouter des photos
                            <input
                                type="file"
                                hidden
                                multiple
                                accept="image/*"
                                onChange={handleAddPhotos}
                            />
                        </Button>

                        {/* {selectedCount > 0 && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<DownloadIcon />}
                                onClick={handleExportSelections}
                                sx={{ fontWeight: 'bold' }}
                            >
                                Exporter
                            </Button>
                        )} */}
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Chip
                        label={`${gallery.images.length} photos`}
                        sx={{ borderRadius: '8px' }}
                    />
                    <Chip
                        icon={<FavoriteIcon />}
                        label={`${selectedCount} sélectionnées`}
                        color="primary"
                        sx={{ borderRadius: '8px' }}
                    />
                </Box>
            </Box>

            {/* Images Grid */}
            <ResponsiveMasonry
                columnsCountBreakPoints={{
                    350: 1,
                    750: 2,
                    900: 3
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
                                border: image.isLiked ? '3px solid' : 'none',
                                borderColor: image.isLiked ? 'primary.main' : 'transparent',
                                '&:hover .delete-btn': { opacity: 1 }
                            }}
                        >
                            <img
                                src={image.url}
                                alt={image.filename}
                                style={{ width: '100%', display: 'block' }}
                            />

                            {/* Delete Button */}
                            <IconButton
                                className="delete-btn"
                                onClick={() => handleDeletePhoto(image.id)}
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    left: 8,
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    opacity: 0,
                                    transition: 'opacity 0.2s',
                                    '&:hover': { backgroundColor: 'white', color: 'error.main' }
                                }}
                                size="small"
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>

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
    );
};

export default GalleryManagement;

import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack as BackIcon, Favorite as FavoriteIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { IconButton, CircularProgress } from '@mui/material';
import { toast } from 'sonner';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { galleryService } from '../../services/galleryService';
import type { Gallery } from '../../types/gallery';

const GalleryManagement: React.FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const navigate = useNavigate();
    const [gallery, setGallery] = useState<Gallery | null>(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const fetchGallery = async () => {
        if (uuid) {
            setPageLoading(true);
            try {
                const g = await galleryService.getGalleryByUUID(uuid);
                setGallery(g.gallery);
            } catch (error) {
                console.error("Failed to fetch gallery", error);
            } finally {
                setPageLoading(false);
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
            toast.success("Photos ajoutées avec succès !");
        } catch (error) {
            console.error("Failed to add photos", error);
            toast.error("Erreur lors de l'ajout des photos.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePhoto = async (photoId: string) => {
        if (!uuid || !window.confirm('Supprimer cette photo ?')) return;

        try {
            await galleryService.deletePhotoFromGallery(uuid, photoId);
            await fetchGallery();
            toast.success("Photo supprimée.");
        } catch (error) {
            console.error("Failed to delete photo", error);
            toast.error("Erreur lors de la suppression de la photo.");
        }
    };

    // const handleExportSelections = () => {
    //     if (!gallery) return;
    //
    //     const selectedImages = gallery.images.filter(img => img.isLiked);
    //     const csvContent = 'Filename\n' + selectedImages.map(img => img.filename).join('\n');
    //
    //     const blob = new Blob([csvContent], { type: 'text/csv' });
    //     const url = URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = `selections-${gallery.title}.csv`;
    //     link.click();
    //     URL.revokeObjectURL(url);
    // };

    if (pageLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 w-full">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-green-500 rounded-full animate-spin"></div>
                </div>
                <p className="text-slate-400 font-medium animate-pulse">Chargement de la galerie...</p>
            </div>
        );
    }

    if (!gallery) {
        return (
            <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
                <Typography variant="h5" color="text.secondary">
                    Galerie introuvable
                </Typography>
                <Button 
                    variant="text" 
                    onClick={() => navigate('/admin/dashboard')}
                    sx={{ mt: 2 }}
                >
                    Retour au dashboard
                </Button>
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
                    sx={{ 
                        mb: 2,
                        color: 'text.secondary',
                        '&:hover': { color: 'green.600' }
                    }}
                >
                    Retour au dashboard
                </Button>

                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'stretch', md: 'flex-start' }, 
                    gap: 3,
                    mb: 3 
                }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography 
                            variant="h3" 
                            sx={{ 
                                fontWeight: 'black', 
                                mb: 1,
                                fontSize: { xs: '1.75rem', md: '3rem' },
                                letterSpacing: '-0.02em',
                                color: 'slate.900'
                            }}
                        >
                            {gallery.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.7 }}>
                            {gallery.description}
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        component="label"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                        disabled={loading}
                        sx={{
                            backgroundColor: '#22c55e', // Green-500
                            color: 'white',
                            fontWeight: 'bold',
                            py: 1.5,
                            px: 3,
                            borderRadius: '12px',
                            textTransform: 'none',
                            boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.39)',
                            '&:hover': {
                                backgroundColor: '#16a34a', // Green-600
                                boxShadow: '0 6px 20px rgba(34, 197, 94, 0.23)',
                            }
                        }}
                    >
                        {loading ? "Chargement..." : "Ajouter des photos"}
                        <input
                            type="file"
                            hidden
                            multiple
                            accept="image/*"
                            onChange={handleAddPhotos}
                        />
                    </Button>
                </Box>

                <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap',
                    gap: 1.5, 
                    mt: 2 
                }}>
                    <Chip
                        label={`${gallery.images.length} photos`}
                        sx={{ 
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            backgroundColor: 'slate.100',
                            border: 'none'
                        }}
                    />
                    <Chip
                        icon={<FavoriteIcon sx={{ fontSize: '14px !important', color: 'white !important' }} />}
                        label={`${selectedCount} sélectionnées`}
                        sx={{ 
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            backgroundColor: '#22c55e',
                            color: 'white',
                            '& .MuiChip-icon': { color: 'white' }
                        }}
                    />
                </Box>
            </Box>

            {/* Images Grid */}
            <ResponsiveMasonry
                columnsCountBreakPoints={{
                    300: 1,
                    600: 2,
                    1000: 3,
                    1400: 4
                }}
            >
                <Masonry gutter="12px">
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

                            {
                                image.isLiked && (
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
                                )
                            }
                        </Box>
                    ))}
                </Masonry>
            </ResponsiveMasonry>
        </Container >
    );
};

export default GalleryManagement;

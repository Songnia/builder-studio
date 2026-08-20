import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack as BackIcon, Save as SaveIcon } from '@mui/icons-material';
import { toast } from 'sonner';
import DualUploadZone from '../../components/Delivery/DualUploadZone';
import ShareDialog from '../../components/Delivery/ShareDialog';
import { galleryService } from '../../services/galleryService';

const NewDelivery: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [createdUuid, setCreatedUuid] = useState('');

    const [imagesUploading, setImagesUploading] = useState(false);
    const [imagesProgress, setImagesProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleImagesSelected = (files: File[]) => {
        const MAX_SIZE = 5 * 1024 * 1024; // 5Mo
        const validFiles = files.filter(file => file.size <= MAX_SIZE);
        const rejectedFiles = files.filter(file => file.size > MAX_SIZE);

        if (rejectedFiles.length > 0) {
            toast.warning(`${rejectedFiles.length} image(s) ignorée(s) car elles dépassent la limite de 5Mo.`);
        }

        setImages(validFiles);
        // Simulate upload progress
        setImagesUploading(true);
        setImagesProgress(0);
        const interval = setInterval(() => {
            setImagesProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setImagesUploading(false);
                    return 100;
                }
                return prev + 10;
            });
        }, 150);
    };

    const BATCH_SIZE = 10; // Upload 10 images at a time to stay under server limits

    const handleSave = async () => {
        if (!title.trim()) {
            toast.error('Veuillez entrer un titre');
            return;
        }

        if (images.length === 0) {
            toast.error('Veuillez ajouter au moins une image');
            return;
        }

        setUploading(true);
        setUploadStatus('Création de la galerie...');

        try {
            // Step 1: Create gallery with no photos (just metadata)
            const newGallery = await galleryService.createGallery({
                title,
                description,
                clientPhone: clientPhone.trim() || undefined,
                images: [],
                files: [],
                zipFileUrl: '#',
                zipFileSize: '0',
                pin: '1234'
            });

            const galleryUuid = newGallery.uuid;
            const failedFiles: string[] = [];

            // Step 2: Upload images in batches
            const totalBatches = Math.ceil(images.length / BATCH_SIZE);
            for (let i = 0; i < images.length; i += BATCH_SIZE) {
                const batch = images.slice(i, i + BATCH_SIZE);
                const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
                setUploadStatus(`Upload photos: lot ${batchNumber}/${totalBatches} (${Math.min(i + BATCH_SIZE, images.length)}/${images.length})...`);
                setImagesProgress(Math.round((batchNumber / totalBatches) * 100));
                
                try {
                    await galleryService.addPhotosToGallery(galleryUuid, batch);
                } catch (batchError) {
                    console.error(`Batch ${batchNumber} failed:`, batchError);
                    // If batch fails, we record the names of the files in this batch
                    batch.forEach(file => failedFiles.push(file.name));
                }
            }
            setImagesProgress(100);

            setCreatedUuid(galleryUuid);
            setUploading(false);
            setUploadStatus('');

            if (failedFiles.length > 0) {
                const successCount = images.length - (failedFiles.filter(f => !f.startsWith('Fichier ZIP')).length);
                toast.warning(`Galerie créée ! ${successCount}/${images.length} photos envoyées. Échecs : ${failedFiles.join(', ')}`);
            } else {
                toast.success('Galerie créée avec succès !');
            }

            setShareDialogOpen(true);
        } catch (error) {
            console.error("Failed to create gallery", error);
            toast.error('Erreur lors de la création de la galerie');
            setUploading(false);
            setUploadStatus('');
        }
    };

    const handleDialogClose = () => {
        setShareDialogOpen(false);
        navigate('/admin/dashboard');
    };

    return (
        <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Button
                    startIcon={<BackIcon />}
                    onClick={() => navigate('/admin/dashboard')}
                    sx={{ mb: 2 }}
                >
                    Retour
                </Button>

                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Nouvelle Livraison
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Créez une galerie photo pour partager avec vos clients
                </Typography>
            </Box>

            {/* Form */}
            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <Stack spacing={3}>
                    {/* Title */}
                    <TextField
                        fullWidth
                        label="Titre de l'événement"
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Mariage Alice & Bob"
                        required
                    />

                    {/* Description */}
                    <TextField
                        fullWidth
                        label="Description"
                        variant="outlined"
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Une brève description de l'événement..."
                    />

                    {/* Téléphone client */}
                    <TextField
                        fullWidth
                        label="Numéro WhatsApp du client"
                        variant="outlined"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="Ex: +33612345678 ou +2250710000000"
                        helperText="Avec indicatif pays, sans espaces ni tirets. Utilisé pour le partage WhatsApp direct."
                        inputProps={{ type: 'tel' }}
                    />

                    {/* Upload Zone A - Images */}
                    <Box>
                        <DualUploadZone
                            title="Zone A: Images JPG"
                            subtitle="Glissez vos photos ici ou cliquez pour sélectionner (format JPG, PNG)"
                            acceptedTypes="image/jpeg,image/jpg,image/png"
                            multiple={true}
                            onFilesSelected={handleImagesSelected}
                            uploading={imagesUploading}
                            uploadProgress={imagesProgress}
                        />
                        {images.length > 0 && !imagesUploading && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                {images.length} image(s) sélectionnée(s)
                            </Typography>
                        )}
                    </Box>

                    {/* Upload Zone B - ZIP */}
                    {/*<Box>
                        <DualUploadZone
                            title="Zone B: Fichier ZIP (optionnel)"
                            subtitle="Package haute résolution pour téléchargement (format ZIP)"
                            acceptedTypes=".zip"
                            multiple={false}
                            onFilesSelected={handleZipSelected}
                            uploading={zipUploading}
                            uploadProgress={zipProgress}
                        />
                        {zipFile && !zipUploading && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                {zipFile.name} ({(zipFile.size / (1024 * 1024)).toFixed(2)} MB)
                            </Typography>
                        )}
                    </Box>*/}

                    {/* Actions */}
                    <Box sx={{ 
                        mt: 4, 
                        pt: 4, 
                        borderTop: '1px solid', 
                        borderColor: 'divider',
                        display: 'flex', 
                        flexDirection: { xs: 'column-reverse', sm: 'row' }, 
                        justifyContent: 'flex-end', 
                        gap: 2 
                    }}>
                        {uploading && uploadStatus && (
                            <Typography variant="caption" color="text.secondary" sx={{ alignSelf: { xs: 'center', sm: 'flex-start' }, mb: { xs: 1, sm: 0 } }}>
                                {uploadStatus}
                            </Typography>
                        )}
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/admin/dashboard')}
                            disabled={uploading}
                            sx={{ h: 56, width: { xs: '100%', sm: 'auto' } }}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={!uploading && <SaveIcon />}
                            disabled={uploading}
                            sx={{ fontWeight: 'bold', h: 56, backgroundColor: '#10b981', width: { xs: '100%', sm: 'auto' }, '&:hover': { backgroundColor: '#059669' } }}
                        >
                            {uploading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CircularProgress size={20} color="inherit" />
                                    {`En cours... (${imagesProgress}%)`}
                                </Box>
                            ) : 'Enregistrer & Partager'}
                        </Button>
                    </Box>
                </Stack>
            </Box>

            {/* Share Dialog */}
            <ShareDialog
                open={shareDialogOpen}
                onClose={handleDialogClose}
                uuid={createdUuid}
                clientPhone={clientPhone.trim() || undefined}
            />

        </Container>
    );
};

export default NewDelivery;

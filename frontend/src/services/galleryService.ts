import { api } from './api';
import type { Gallery, GalleryImage, CreateGalleryData } from '../types/gallery';

// Helper to map backend response to frontend type
const mapGalleryFromApi = (data: any): Gallery => {
    return {
        uuid: data.uuid,
        title: data.title,
        description: data.description,
        createdAt: data.created_at,
        images: data.photos.map((photo: any) => ({
            id: photo.id.toString(),
            filename: photo.file_path.split('/').pop() || `image-${photo.id}.jpg`,
            url: photo.url,
            isLiked: photo.is_liked,
        })),
        zipFileUrl: data.zip_url || '#',
        zipFileSize: 'Unknown',
        pin: data.pin_code,
        photographerSlug: data.photographer_slug,
        clientPhone: data.client_phone || undefined,
    };
};

export const galleryService = {
    // Get all galleries (Admin only - requires auth)
    getAllGalleries: async (): Promise<Gallery[]> => {
        const response = await api.get('/admin/galleries');
        return response.data.data.map(mapGalleryFromApi);
    },

    // Get gallery by UUID (Public, supports PIN)
    getGalleryByUUID: async (uuid: string, pin?: string): Promise<{ gallery: Gallery | null; requiresPin?: boolean; errorMsg?: string }> => {
        try {
            const headers = pin ? { 'X-Gallery-PIN': pin } : {};
            const response = await api.get(`/client/gallery/${uuid}`, { headers });
            return { gallery: mapGalleryFromApi(response.data) };
        } catch (error: any) {
            if (error?.response?.status === 403 && error?.response?.data?.requires_pin) {
                return { gallery: null, requiresPin: true, errorMsg: pin ? 'Code PIN incorrect' : undefined };
            }
            console.error('Failed to fetch gallery', error);
            return { gallery: null };
        }
    },

    // Create new gallery (Admin)
    createGallery: async (data: CreateGalleryData): Promise<Gallery> => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        if (data.pin) formData.append('pin_code', data.pin);
        if (data.clientPhone) formData.append('client_phone', data.clientPhone);

        // Append photos
        if (data.files && data.files.length > 0) {
            data.files.forEach((file) => {
                formData.append('photos[]', file);
            });
        }

        // Append ZIP file
        if (data.zipFileBlob) {
            formData.append('zip_file', data.zipFileBlob);
        }

        const response = await api.post('/admin/galleries', formData);
        return mapGalleryFromApi(response.data);
    },

    // Delete gallery (Admin)
    deleteGallery: async (id: string): Promise<void> => {
        await api.delete(`/admin/galleries/${id}`);
    },

    // Add photos to existing gallery (Admin)
    addPhotosToGallery: async (id: string, files: File[]): Promise<Gallery> => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('photos[]', file);
        });

        const response = await api.post(`/admin/galleries/${id}/photos`, formData);
        return mapGalleryFromApi(response.data);
    },

    // Upload ZIP to existing gallery (Admin)
    uploadZipToGallery: async (id: string, zipFile: File): Promise<void> => {
        const formData = new FormData();
        formData.append('zip_file', zipFile);
        await api.post(`/admin/galleries/${id}/zip`, formData);
    },

    // Delete photo from gallery (Admin)
    deletePhotoFromGallery: async (galleryId: string, photoId: string): Promise<void> => {
        await api.delete(`/admin/galleries/${galleryId}/photos/${photoId}`);
    },

    // Toggle image like (Public)
    toggleImageLike: async (uuid: string, imageId: string): Promise<void> => {
        await api.post(`/client/gallery/${uuid}/like`, { photo_id: imageId });
    },

    // Get selected (liked) images
    getSelectedImages: async (uuid: string): Promise<GalleryImage[]> => {
        const { gallery } = await galleryService.getGalleryByUUID(uuid);
        return gallery ? gallery.images.filter(img => img.isLiked) : [];
    },

    // Get stats for a gallery
    getGalleryStats: async (uuid: string): Promise<{ totalImages: number; likedCount: number }> => {
        const { gallery } = await galleryService.getGalleryByUUID(uuid);
        if (!gallery) return { totalImages: 0, likedCount: 0 };

        return {
            totalImages: gallery.images.length,
            likedCount: gallery.images.filter(img => img.isLiked).length,
        };
    },
};

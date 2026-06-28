import { api } from './api';
import { optimizeImageFile } from '@/utils/imageOptimization';

export type BuilderMediaContext =
  | 'hero'
  | 'logo'
  | 'portfolio'
  | 'services'
  | 'promoter'
  | 'banner';

interface UploadMediaResponse {
  url: string;
  path: string;
}

export const mediaService = {
  async upload(file: Blob, context: BuilderMediaContext, filename = 'asset.webp'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file, filename);
    formData.append('context', context);

    const response = await api.post<UploadMediaResponse>('/admin/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url;
  },
};

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  return response.blob();
}

function getOptimizationOptions(context: BuilderMediaContext) {
  switch (context) {
    case 'hero':
      return { maxWidth: 1920, maxHeight: 1920, quality: 0.78 };
    case 'logo':
      return { maxWidth: 800, maxHeight: 800, quality: 0.82 };
    case 'portfolio':
      return { maxWidth: 1600, maxHeight: 1600, quality: 0.78 };
    case 'services':
      return { maxWidth: 1200, maxHeight: 1200, quality: 0.8 };
    case 'promoter':
      return { maxWidth: 1000, maxHeight: 1000, quality: 0.82 };
    case 'banner':
      return { maxWidth: 1600, maxHeight: 900, quality: 0.78 };
    default:
      return { maxWidth: 1600, maxHeight: 1600, quality: 0.8 };
  }
}

export async function uploadBuilderMedia(file: File, context: BuilderMediaContext): Promise<string> {
  const optimizedDataUrl = await optimizeImageFile(file, getOptimizationOptions(context));
  const optimizedBlob = await dataUrlToBlob(optimizedDataUrl);
  const extension = optimizedBlob.type === 'image/jpeg' ? 'jpg' : (optimizedBlob.type.split('/')[1] || 'webp');

  return mediaService.upload(optimizedBlob, context, `asset.${extension}`);
}

export async function uploadBuilderMediaBatch(files: File[], context: BuilderMediaContext): Promise<string[]> {
  const urls: string[] = [];

  for (const file of files) {
    urls.push(await uploadBuilderMedia(file, context));
  }

  return urls;
}

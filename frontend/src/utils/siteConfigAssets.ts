import { mediaService, type BuilderMediaContext } from '@/services/mediaService';
import type { Photo, Service, SiteConfig } from '@/types/builder';

function isDataUrl(value?: string): value is string {
  return typeof value === 'string' && value.startsWith('data:');
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  return response.blob();
}

function getFileExtensionFromMimeType(type: string) {
  if (type === 'image/jpeg') return 'jpg';
  if (type === 'image/png') return 'png';
  if (type === 'image/webp') return 'webp';
  if (type === 'image/gif') return 'gif';
  if (type === 'image/svg+xml') return 'svg';
  return 'bin';
}

async function uploadAssetIfNeeded(
  value: string | undefined,
  context: BuilderMediaContext,
  filenameBase: string,
  cache: Map<string, string>,
): Promise<string | undefined> {
  if (!value || !isDataUrl(value)) {
    return value;
  }

  const cached = cache.get(value);
  if (cached) {
    return cached;
  }

  const blob = await dataUrlToBlob(value);
  const extension = getFileExtensionFromMimeType(blob.type);
  const filename = `${filenameBase}.${extension}`;
  const uploadedUrl = await mediaService.upload(blob, context, filename);

  cache.set(value, uploadedUrl);
  return uploadedUrl;
}

async function persistHeroImages(heroImages: string[], cache: Map<string, string>) {
  const persisted: string[] = [];

  for (const [index, image] of heroImages.entries()) {
    const url = await uploadAssetIfNeeded(image, 'hero', `hero-${index}`, cache);
    if (url) {
      persisted.push(url);
    }
  }

  return persisted;
}

async function persistPortfolioPhotos(photos: Photo[], cache: Map<string, string>) {
  const persisted: Photo[] = [];

  for (const [index, photo] of photos.entries()) {
    const url = await uploadAssetIfNeeded(photo.url, 'portfolio', `portfolio-${index}`, cache);
    persisted.push({
      ...photo,
      url: url || photo.url,
    });
  }

  return persisted;
}

async function persistServices(services: Service[], cache: Map<string, string>) {
  const persisted: Service[] = [];

  for (const [index, service] of services.entries()) {
    const image = await uploadAssetIfNeeded(service.image, 'services', `service-${index}`, cache);
    persisted.push({
      ...service,
      image,
    });
  }

  return persisted;
}

export async function persistSiteConfigAssets(config: SiteConfig): Promise<SiteConfig> {
  const cache = new Map<string, string>();

  const [
    logo,
    promoterPhoto,
    flashInfoBackgroundImage,
    heroImages,
    photos,
    services,
  ] = await Promise.all([
    uploadAssetIfNeeded(config.logo, 'logo', 'logo', cache),
    uploadAssetIfNeeded(config.promoterPhoto, 'promoter', 'promoter-photo', cache),
    uploadAssetIfNeeded(config.flashInfo.backgroundImage, 'banner', 'flash-info-banner', cache),
    persistHeroImages(config.heroImages, cache),
    persistPortfolioPhotos(config.photos, cache),
    persistServices(config.services, cache),
  ]);

  return {
    ...config,
    logo,
    promoterPhoto,
    heroImages,
    photos,
    services,
    flashInfo: {
      ...config.flashInfo,
      backgroundImage: flashInfoBackgroundImage,
    },
  };
}

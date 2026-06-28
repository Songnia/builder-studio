export interface OptimizeImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
  backgroundColor?: string;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = (error) => {
      URL.revokeObjectURL(objectUrl);
      reject(error);
    };

    image.src = objectUrl;
  });
}

function getScaledDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
) {
  const scale = Math.min(1, maxWidth / width, maxHeight / height);

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export async function optimizeImageFile(
  file: File,
  {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.8,
    mimeType = 'image/webp',
    backgroundColor,
  }: OptimizeImageOptions = {},
): Promise<string> {
  // SVGs are already compact and don't benefit from canvas conversion.
  if (file.type === 'image/svg+xml') {
    return readFileAsDataUrl(file);
  }

  try {
    const image = await loadImageFromFile(file);
    const { width, height } = getScaledDimensions(
      image.naturalWidth || image.width,
      image.naturalHeight || image.height,
      maxWidth,
      maxHeight,
    );

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      return readFileAsDataUrl(file);
    }

    if (backgroundColor) {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, width, height);
    }

    context.drawImage(image, 0, 0, width, height);

    return canvas.toDataURL(mimeType, quality);
  } catch (error) {
    console.error('Image optimization failed, using original file', error);
    return readFileAsDataUrl(file);
  }
}

export async function optimizeImageFiles(
  files: File[],
  options?: OptimizeImageOptions,
): Promise<string[]> {
  return Promise.all(files.map((file) => optimizeImageFile(file, options)));
}

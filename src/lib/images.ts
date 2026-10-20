export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const IMAGE_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export const CONTENT_TYPES: Record<string, string> = Object.fromEntries(
  Object.entries(IMAGE_TYPES).map(([type, ext]) => [ext, type]),
);

export const UPLOAD_FILE_PATTERN = /^[a-z0-9-]+\.(png|jpg|webp|gif)$/;

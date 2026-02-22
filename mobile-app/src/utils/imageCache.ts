import * as FileSystem from 'expo-file-system/legacy';

const CACHE_DIR = FileSystem.cacheDirectory || FileSystem.documentDirectory || '';
const IMAGES_DIR = `${CACHE_DIR}images/`;

// Keep file names filesystem-safe (no slashes/colons).
const normalizeFileName = (url: string) => url.replace(/[^a-zA-Z0-9._-]/g, '_');

const ensureImagesDir = async () => {
  if (!IMAGES_DIR) return;
  const info = await FileSystem.getInfoAsync(IMAGES_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(IMAGES_DIR, { intermediates: true });
  }
};

export const getCachedImageUri = async (remoteUri: string): Promise<string> => {
  if (!remoteUri) return '';

  await ensureImagesDir();

  const fileUri = `${IMAGES_DIR}${normalizeFileName(remoteUri)}`;
  try {
    const info = await FileSystem.getInfoAsync(fileUri);
    if (info.exists) {
      return fileUri;
    }
    const downloadResumable = FileSystem.createDownloadResumable(remoteUri, fileUri);
    const result = await downloadResumable.downloadAsync();
    return result?.uri ?? remoteUri;
  } catch (error) {
    console.warn('Image cache error', error);
    return remoteUri;
  }
};

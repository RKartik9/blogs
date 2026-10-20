import { useCallback, useState } from 'react';
import { request } from './api';

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File): Promise<string | null> => {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const { url } = await request<{ url: string }>('/api/upload', { method: 'POST', body: form });
      return url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  return { upload, uploading, error };
}

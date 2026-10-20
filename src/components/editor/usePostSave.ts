import { useCallback, useState } from 'react';
import type { Post, PostInput } from '@/lib/types';
import { request } from './api';

type Status = 'idle' | 'saving' | 'deleting';

const jsonHeaders = { 'Content-Type': 'application/json' };

export function usePostSave(slug?: string) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (next: Status, action: () => Promise<void>) => {
    setStatus(next);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('idle');
    }
  }, []);

  const save = useCallback(
    (input: PostInput) =>
      run('saving', async () => {
        const post = await request<Post>(slug ? `/api/posts/${slug}` : '/api/posts', {
          method: slug ? 'PUT' : 'POST',
          headers: jsonHeaders,
          body: JSON.stringify(input),
        });
        window.location.href = `/blog/${post.slug}`;
      }),
    [run, slug],
  );

  const remove = useCallback(
    () =>
      run('deleting', async () => {
        if (!slug) return;
        await request<null>(`/api/posts/${slug}`, { method: 'DELETE' });
        window.location.href = '/';
      }),
    [run, slug],
  );

  return { save, remove, status, error };
}

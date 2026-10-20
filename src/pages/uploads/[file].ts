import fs from 'node:fs/promises';
import path from 'node:path';
import type { APIRoute } from 'astro';
import { CONTENT_TYPES, UPLOAD_FILE_PATTERN } from '@/lib/images';
import { UPLOADS_DIR } from '@/lib/paths';

export const GET: APIRoute = async ({ params }) => {
  const file = params.file ?? '';
  if (!UPLOAD_FILE_PATTERN.test(file)) return new Response('Not found', { status: 404 });

  try {
    const data = await fs.readFile(path.join(UPLOADS_DIR, file));
    return new Response(data, {
      headers: {
        'Content-Type': CONTENT_TYPES[path.extname(file).slice(1)],
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
};

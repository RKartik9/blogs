import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { APIRoute } from 'astro';
import { errorResponse, json } from '@/lib/http';
import { IMAGE_TYPES, MAX_IMAGE_BYTES } from '@/lib/images';
import { UPLOADS_DIR } from '@/lib/paths';

export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.formData();
    const file = form.get('file');

    if (!(file instanceof File)) return json({ error: 'No file provided' }, 400);

    const ext = IMAGE_TYPES[file.type];
    if (!ext) return json({ error: 'Only PNG, JPG, WebP and GIF images are allowed' }, 415);
    if (file.size > MAX_IMAGE_BYTES) return json({ error: 'Image must be 5MB or smaller' }, 413);

    const name = `${randomUUID()}.${ext}`;
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOADS_DIR, name), Buffer.from(await file.arrayBuffer()));

    return json({ url: `/uploads/${name}` }, 201);
  } catch (error) {
    return errorResponse(error);
  }
};

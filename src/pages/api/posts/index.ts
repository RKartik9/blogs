import type { APIRoute } from 'astro';
import { errorResponse, json } from '@/lib/http';
import { createPost, listPosts } from '@/lib/posts';
import { parsePostInput } from '@/lib/validate';

export const GET: APIRoute = async () => json(await listPosts());

export const POST: APIRoute = async ({ request }) => {
  try {
    const post = await createPost(parsePostInput(await request.json()));
    return json(post, 201);
  } catch (error) {
    return errorResponse(error);
  }
};

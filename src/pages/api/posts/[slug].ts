import type { APIRoute } from 'astro';
import { errorResponse, json } from '@/lib/http';
import { deletePost, getPost, updatePost } from '@/lib/posts';
import { parsePostInput } from '@/lib/validate';

const notFound = () => json({ error: 'Post not found' }, 404);

export const GET: APIRoute = async ({ params }) => {
  const post = await getPost(params.slug ?? '');
  return post ? json(post) : notFound();
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const post = await updatePost(params.slug ?? '', parsePostInput(await request.json()));
    return post ? json(post) : notFound();
  } catch (error) {
    return errorResponse(error);
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    return (await deletePost(params.slug ?? '')) ? new Response(null, { status: 204 }) : notFound();
  } catch (error) {
    return errorResponse(error);
  }
};

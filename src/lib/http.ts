import { ValidationError } from './validate';

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function errorResponse(error: unknown): Response {
  if (error instanceof ValidationError) return json({ error: error.message }, 400);
  if (error instanceof SyntaxError) return json({ error: 'Malformed JSON' }, 400);
  console.error(error);
  return json({ error: 'Something went wrong' }, 500);
}

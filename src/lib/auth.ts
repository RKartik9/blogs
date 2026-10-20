import { createHmac, timingSafeEqual } from 'node:crypto';
import { ADMIN_PASSWORD } from 'astro:env/server';

export const SESSION_COOKIE = 'session';

const password = () => ADMIN_PASSWORD ?? '';

// ponytail: token is derived from the password, so changing ADMIN_PASSWORD logs every session out
const token = (secret: string) => createHmac('sha256', secret).update('blog-admin').digest('hex');

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkPassword(input: string): boolean {
  const secret = password();
  return Boolean(secret) && safeEqual(token(input), token(secret));
}

export function sessionToken(): string {
  return token(password());
}

export function isAdmin(cookie: string | undefined): boolean {
  const secret = password();
  return Boolean(secret && cookie) && safeEqual(cookie!, token(secret));
}

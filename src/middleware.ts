import { defineMiddleware } from 'astro:middleware';
import { isAdmin, SESSION_COOKIE } from '@/lib/auth';

const SAFE_METHODS = new Set(['GET', 'HEAD']);

export const onRequest = defineMiddleware((ctx, next) => {
  const { pathname } = ctx.url;
  ctx.locals.isAdmin = isAdmin(ctx.cookies.get(SESSION_COOKIE)?.value);
  if (ctx.locals.isAdmin || pathname === '/login') return next();

  // Visitors can only read: no API, no writes, no editor.
  if (/^\/+api(\/|$)/i.test(pathname) || !SAFE_METHODS.has(ctx.request.method)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (/^\/+editor(\/|$)/i.test(pathname)) return ctx.redirect('/login');
  return next();
});

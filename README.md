# rohitkartik-blog

My personal blog. Readers get a fast, server-rendered site; I get a private rich-text editor behind a password for writing and editing posts. No database: every post is a JSON file in `data/posts/`.

Built with Astro (Node adapter), Tailwind CSS v4 and a Tiptap editor.

## Running it

Requires Node 22.9 or newer.

```sh
npm install
cp .env.example .env    # then set ADMIN_PASSWORD
npm run dev             # http://localhost:4321
```

For production:

```sh
npm run build
npm start               # reads .env, serves on PORT (default 4321)
```

`npm run check` runs the type checker.

## Writing

Go to `/login` and enter `ADMIN_PASSWORD`. The page isn't linked anywhere. Once signed in, the header shows **New post**, and every post gets an **Edit** button.

The editor handles headings, lists, quotes, code blocks, links and images. An image followed immediately by an italic paragraph renders that paragraph as its caption.

Visitors can only read. The editor, the API and image uploads all require the session cookie, and nobody can sign in if `ADMIN_PASSWORD` is unset.

## Where things live

| Path | What |
| --- | --- |
| `data/posts/*.json` | Posts: title, excerpt, tags, sanitized HTML, timestamps |
| `data/uploads/` | Uploaded images (PNG, JPG, WebP, GIF, max 5 MB) |
| `src/lib/site.ts` | Name, description, portfolio link |
| `src/components/ui/Logo.astro` | The `rk.` mark; `public/favicon.svg` is the same mark |
| `src/styles/global.css` | Theme tokens, header and reading-progress animations |
| `src/middleware.ts`, `src/lib/auth.ts` | Access control |

## Deploying

It's a plain Node server (`dist/server/entry.mjs`), so anything that runs Node and has a persistent disk works: a VPS, Railway, Fly.io with a volume, and so on. Serverless hosts without a writable disk won't, since posts and images are saved to `data/`.

**Vercel:** the build switches to the Vercel adapter automatically and bundles `data/` into the function. Vercel has no writable disk, so the live site is read-only: write posts locally with `npm run dev`, then commit `data/` and push to publish.

Behind a reverse proxy, serve over HTTPS: the session cookie is marked `Secure` in production builds.

## Notes

- Login has a one-second delay after a wrong password and no other rate limiting. Use a long password.
- The header collapses into the logo as you scroll, and a thin bar tracks reading progress. Both use CSS scroll-driven animations. In browsers without support, the header simply scrolls away and the progress bar is hidden.

import fs from 'node:fs/promises';
import path from 'node:path';
import { POSTS_DIR } from './paths';
import { sanitizePostHtml, toPlainText } from './sanitize';
import { isValidSlug, slugify } from './slug';
import type { Post, PostInput } from './types';

function filePath(slug: string): string {
  if (!isValidSlug(slug)) throw new Error(`Invalid slug: ${slug}`);
  return path.join(POSTS_DIR, `${slug}.json`);
}

async function exists(slug: string): Promise<boolean> {
  try {
    await fs.access(filePath(slug));
    return true;
  } catch {
    return false;
  }
}

async function writePost(post: Post): Promise<void> {
  await fs.mkdir(POSTS_DIR, { recursive: true });
  const target = filePath(post.slug);
  const temp = `${target}.tmp`;
  await fs.writeFile(temp, JSON.stringify(post, null, 2), 'utf8');
  await fs.rename(temp, target);
}

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title) || 'post';
  let slug = base;
  for (let i = 2; await exists(slug); i++) slug = `${base}-${i}`;
  return slug;
}

function prepare(input: PostInput): PostInput {
  const html = sanitizePostHtml(input.html);
  const excerpt = input.excerpt || toPlainText(html).slice(0, 180);
  return { ...input, html, excerpt };
}

export async function listPosts(): Promise<Post[]> {
  let files: string[];
  try {
    files = await fs.readdir(POSTS_DIR);
  } catch {
    return [];
  }
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith('.json'))
      .map((file) => getPost(file.slice(0, -'.json'.length))),
  );
  return posts
    .filter((post): post is Post => post !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!isValidSlug(slug)) return null;
  try {
    return JSON.parse(await fs.readFile(filePath(slug), 'utf8')) as Post;
  } catch {
    return null;
  }
}

export async function createPost(input: PostInput): Promise<Post> {
  const now = new Date().toISOString();
  const post: Post = {
    ...prepare(input),
    slug: await uniqueSlug(input.title),
    createdAt: now,
    updatedAt: now,
  };
  await writePost(post);
  return post;
}

export async function updatePost(slug: string, input: PostInput): Promise<Post | null> {
  const existing = await getPost(slug);
  if (!existing) return null;
  const post: Post = {
    ...existing,
    ...prepare(input),
    updatedAt: new Date().toISOString(),
  };
  await writePost(post);
  return post;
}

export async function deletePost(slug: string): Promise<boolean> {
  if (!(await exists(slug))) return false;
  await fs.unlink(filePath(slug));
  return true;
}

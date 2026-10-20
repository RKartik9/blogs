import type { PostInput } from './types';

const UPLOAD_PATH = /^\/uploads\/[a-z0-9-]+\.(png|jpe?g|webp|gif)$/i;

export class ValidationError extends Error {}

function readString(value: unknown, field: string, max: number): string {
  if (typeof value !== 'string') throw new ValidationError(`${field} must be a string`);
  const trimmed = value.trim();
  if (trimmed.length > max) throw new ValidationError(`${field} is too long`);
  return trimmed;
}

function readTags(value: unknown): string[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new ValidationError('tags must be an array');
  const tags = value
    .filter((tag): tag is string => typeof tag === 'string')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
  return [...new Set(tags)].slice(0, 8);
}

function readCover(value: unknown): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string' || !UPLOAD_PATH.test(value)) {
    throw new ValidationError('coverImage must be an uploaded image');
  }
  return value;
}

export function parsePostInput(body: unknown): PostInput {
  if (!body || typeof body !== 'object') throw new ValidationError('Invalid request body');
  const data = body as Record<string, unknown>;

  const title = readString(data.title, 'title', 160);
  if (!title) throw new ValidationError('title is required');

  return {
    title,
    excerpt: readString(data.excerpt ?? '', 'excerpt', 300),
    html: readString(data.html ?? '', 'html', 500_000),
    tags: readTags(data.tags),
    coverImage: readCover(data.coverImage),
  };
}

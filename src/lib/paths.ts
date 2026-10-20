import path from 'node:path';

const DATA_DIR = path.resolve(process.cwd(), 'data');

export const POSTS_DIR = path.join(DATA_DIR, 'posts');
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

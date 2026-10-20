export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  html: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type PostInput = Pick<Post, 'title' | 'excerpt' | 'coverImage' | 'html' | 'tags'>;

import { EditorContent, useEditor } from '@tiptap/react';
import { useState } from 'react';
import type { Post } from '@/lib/types';
import { EditorActions } from './EditorActions';
import { extensions } from './extensions';
import { MetaFields, type Meta } from './MetaFields';
import { Toolbar } from './Toolbar';
import { usePostSave } from './usePostSave';

type Props = {
  post?: Post;
};

function parseTags(tags: string): string[] {
  return tags.split(',').map((tag) => tag.trim()).filter(Boolean);
}

export default function Editor({ post }: Props) {
  const [meta, setMeta] = useState<Meta>({
    title: post?.title ?? '',
    excerpt: post?.excerpt ?? '',
    tags: post?.tags.join(', ') ?? '',
    coverImage: post?.coverImage,
  });
  const { save, remove, status, error } = usePostSave(post?.slug);

  const editor = useEditor({
    extensions,
    content: post?.html ?? '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'tiptap prose prose-zinc prose-lg max-w-none font-serif dark:prose-invert prose-headings:font-serif prose-headings:font-medium prose-headings:tracking-tight prose-a:text-accent-600 prose-img:rounded-xl',
      },
    },
  });

  if (!editor) return null;

  const publish = () =>
    save({
      title: meta.title,
      excerpt: meta.excerpt,
      tags: parseTags(meta.tags),
      coverImage: meta.coverImage,
      html: editor.getHTML(),
    });

  return (
    <div className="flex flex-col gap-8">
      <MetaFields meta={meta} onChange={(patch) => setMeta((prev) => ({ ...prev, ...patch }))} />
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <EditorActions
        isEditing={Boolean(post)}
        status={status}
        canPublish={meta.title.trim().length > 0}
        error={error}
        onPublish={publish}
        onDelete={remove}
      />
    </div>
  );
}

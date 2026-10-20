export type Meta = {
  title: string;
  excerpt: string;
  tags: string;
  coverImage?: string;
};

type Props = {
  meta: Meta;
  onChange: (patch: Partial<Meta>) => void;
};

const inputBase =
  'w-full resize-none overflow-hidden bg-transparent outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700';

export function MetaFields({ meta, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={meta.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Post title"
        rows={1}
        maxLength={160}
        aria-label="Title"
        className={`${inputBase} field-sizing-content font-serif text-4xl font-medium tracking-tight sm:text-5xl`}
      />
      <textarea
        value={meta.excerpt}
        onChange={(e) => onChange({ excerpt: e.target.value })}
        placeholder="A short summary (optional)"
        rows={1}
        maxLength={300}
        aria-label="Excerpt"
        className={`${inputBase} field-sizing-content text-xl text-zinc-600 dark:text-zinc-400`}
      />
      <input
        value={meta.tags}
        onChange={(e) => onChange({ tags: e.target.value })}
        placeholder="Tags, separated by commas"
        aria-label="Tags"
        className={`${inputBase} text-sm text-zinc-500`}
      />
    </div>
  );
}

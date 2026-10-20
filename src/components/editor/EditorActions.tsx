type Props = {
  isEditing: boolean;
  status: 'idle' | 'saving' | 'deleting';
  canPublish: boolean;
  error: string | null;
  onPublish: () => void;
  onDelete: () => void;
};

export function EditorActions({ isEditing, status, canPublish, error, onPublish, onDelete }: Props) {
  const busy = status !== 'idle';

  return (
    <div className="sticky bottom-6 z-10 ml-auto flex flex-wrap items-center justify-end gap-3 rounded-full border border-zinc-200 bg-white/90 p-1.5 pl-4 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
      {error && <p className="mr-auto pl-1 text-sm text-red-500">{error}</p>}
      {isEditing && (
        <button
          type="button"
          disabled={busy}
          onClick={() => window.confirm('Delete this post permanently?') && onDelete()}
          className="rounded-full px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-500/10"
        >
          {status === 'deleting' ? 'Deleting…' : 'Delete'}
        </button>
      )}
      <button
        type="button"
        disabled={busy || !canPublish}
        onClick={onPublish}
        className="rounded-full bg-white px-5 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500"
      >
        {status === 'saving' ? 'Saving…' : isEditing ? 'Update' : 'Publish'}
      </button>
    </div>
  );
}

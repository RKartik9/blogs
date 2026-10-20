import type { Editor } from '@tiptap/react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { useRef } from 'react';
import { ToolbarButton } from './ToolbarButton';
import { useImageUpload } from './useImageUpload';

export function ImageUploadButton({ editor }: { editor: Editor }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, error } = useImageUpload();

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const url = await upload(file);
    if (url) editor.chain().focus().setImage({ src: url, alt: file.name }).run();
  }

  return (
    <>
      <ToolbarButton
        icon={uploading ? Loader2 : ImagePlus}
        label="Insert image"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleChange}
      />
      {error && <span className="px-2 text-xs text-red-500">{error}</span>}
    </>
  );
}

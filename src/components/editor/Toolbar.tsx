import { useEditorState, type Editor } from '@tiptap/react';
import {
  Bold,
  Code2,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from 'lucide-react';
import { ImageUploadButton } from './ImageUploadButton';
import { ToolbarButton } from './ToolbarButton';

function Divider() {
  return <span className="mx-1 h-5 w-px bg-zinc-200 dark:bg-zinc-800" aria-hidden="true" />;
}

function toggleLink(editor: Editor) {
  if (editor.isActive('link')) {
    editor.chain().focus().unsetLink().run();
    return;
  }
  const url = window.prompt('Link URL', 'https://');
  if (url && url !== 'https://') {
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }
}

export function Toolbar({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bulletList: e.isActive('bulletList'),
      orderedList: e.isActive('orderedList'),
      blockquote: e.isActive('blockquote'),
      codeBlock: e.isActive('codeBlock'),
      link: e.isActive('link'),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="sticky top-4 z-10 flex flex-wrap items-center gap-0.5 rounded-xl border border-zinc-200 bg-white/90 p-1 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90"
    >
      <ToolbarButton icon={Bold} label="Bold" active={state.bold} onClick={() => chain().toggleBold().run()} />
      <ToolbarButton icon={Italic} label="Italic" active={state.italic} onClick={() => chain().toggleItalic().run()} />
      <ToolbarButton icon={Underline} label="Underline" active={state.underline} onClick={() => chain().toggleUnderline().run()} />
      <ToolbarButton icon={Strikethrough} label="Strikethrough" active={state.strike} onClick={() => chain().toggleStrike().run()} />
      <Divider />
      <ToolbarButton icon={Heading2} label="Heading" active={state.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()} />
      <ToolbarButton icon={Heading3} label="Subheading" active={state.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()} />
      <Divider />
      <ToolbarButton icon={List} label="Bullet list" active={state.bulletList} onClick={() => chain().toggleBulletList().run()} />
      <ToolbarButton icon={ListOrdered} label="Numbered list" active={state.orderedList} onClick={() => chain().toggleOrderedList().run()} />
      <ToolbarButton icon={Quote} label="Quote" active={state.blockquote} onClick={() => chain().toggleBlockquote().run()} />
      <ToolbarButton icon={Code2} label="Code block" active={state.codeBlock} onClick={() => chain().toggleCodeBlock().run()} />
      <ToolbarButton icon={Minus} label="Divider" onClick={() => chain().setHorizontalRule().run()} />
      <Divider />
      <ToolbarButton icon={Link2} label={state.link ? 'Remove link' : 'Add link'} active={state.link} onClick={() => toggleLink(editor)} />
      <ImageUploadButton editor={editor} />
      <Divider />
      <ToolbarButton icon={Undo2} label="Undo" disabled={!state.canUndo} onClick={() => chain().undo().run()} />
      <ToolbarButton icon={Redo2} label="Redo" disabled={!state.canRedo} onClick={() => chain().redo().run()} />
    </div>
  );
}

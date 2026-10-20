import Image from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';

export const extensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
  }),
  Image,
  Placeholder.configure({ placeholder: 'Tell your story…' }),
];

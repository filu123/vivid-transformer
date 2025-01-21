import { Editor } from '@tiptap/react';

interface EditorToolbarProps {
  editor: Editor | null;
}

export const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  if (!editor) return null;

  return (
    <div className="flex space-x-2 mb-2">
      <button
        type="button"
        onClick={() => editor?.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
      >
        <em>I</em>
      </button>
      <button
        type="button"
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
        className={`px-2 py-1 rounded ${editor?.isActive('underline') ? 'bg-gray-200' : ''}`}
      >
        <u>U</u>
      </button>
      <button
        type="button"
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded ${editor?.isActive('bulletList') ? 'bg-gray-200' : ''}`}
      >
        • List
      </button>
      <button
        type="button"
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 rounded ${editor?.isActive('orderedList') ? 'bg-gray-200' : ''}`}
      >
        1. List
      </button>
    </div>
  );
};
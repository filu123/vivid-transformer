import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface NoteFormTitleProps {
  initialTitle: string;
  onTitleChange: (title: string) => void;
}

export const NoteFormTitle = ({ initialTitle, onTitleChange }: NoteFormTitleProps) => {
  const titleEditor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, bold: false, italic: false }),
      Placeholder.configure({
        placeholder: 'Title (max 50 characters)',
      }),
    ],
    content: initialTitle,
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      if (text.length <= 50) {
        onTitleChange(text);
      } else {
        editor.commands.setContent(text.substring(0, 50));
      }
    },
  });

  return (
    <div className="text-2xl font-semibold focus:outline-none px-0 relative h-10 editable-title">
      <EditorContent editor={titleEditor} />
    </div>
  );
};
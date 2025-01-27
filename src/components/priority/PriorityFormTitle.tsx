import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface PriorityFormTitleProps {
  initialTitle: string;
  onTitleChange: (title: string) => void;
}

export const PriorityFormTitle = ({ initialTitle, onTitleChange }: PriorityFormTitleProps) => {
  const titleEditor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, bold: false, italic: false }),
      Placeholder.configure({
        placeholder: 'Priority Name (max 70 characters)',
      }),
    ],
    content: initialTitle, // Initializes with the default title
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      if (text.length <= 70) {
        onTitleChange(text);
      } else {
        editor.commands.setContent(text.substring(0, 70));
      }
    },
  });

  return (
    <div className="text-2xl font-semibold focus:outline-none px-0 relative h-fit editable-title">
      <EditorContent editor={titleEditor} />
    </div>
  );
};
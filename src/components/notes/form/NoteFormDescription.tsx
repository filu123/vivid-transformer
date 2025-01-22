import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorToolbar } from './EditorToolbar';

interface NoteFormDescriptionProps {
  initialDescription: string;
  onDescriptionChange: (description: string) => void;
}

export const NoteFormDescription = ({ initialDescription, onDescriptionChange }: NoteFormDescriptionProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      Placeholder.configure({
        placeholder: 'Write something...',
      }),
    ],
    content: initialDescription,
    onUpdate: ({ editor }) => {
      onDescriptionChange(editor.getHTML());
    },
  });

  return (
    <>
      <div className="min-h-[100px] resize-none px-0 relative border-none editable-description rounded p-2">
        <EditorContent className="border-none" editor={editor} />
      </div>
      <EditorToolbar editor={editor} />
    </>
  );
};
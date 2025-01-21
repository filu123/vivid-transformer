import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Placeholder from '@tiptap/extension-placeholder';
import { ColorPicker } from "./ColorPicker";
import { EditorToolbar } from "./EditorToolbar";

interface NoteFormProps {
  onSubmit: (formData: {
    title: string;
    description: string;
    date?: Date;
    image?: File;
    selectedColor: string;
  }) => Promise<void>;
  initialData?: {
    title: string;
    description?: string;
    date?: string;
    image_url?: string;
    background_color?: string;
  };
  onClose: () => void;
}

export const NoteForm = ({ onSubmit, initialData, onClose }: NoteFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [date, setDate] = useState<Date | undefined>(
    initialData?.date ? new Date(initialData.date) : undefined
  );
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(initialData?.background_color || '#ff9b74');

  const titleEditor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, bold: false, italic: false }),
      Placeholder.configure({
        placeholder: 'Title (max 50 characters)',
      }),
    ],
    content: initialData?.title || '',
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      if (text.length <= 50) {
        setTitle(text);
      } else {
        editor.commands.setContent(text.substring(0, 50));
      }
    },
  });

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
    content: initialData?.description || '',
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size must be less than 4MB",
          variant: "destructive",
        });
        return;
      }
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      await onSubmit({
        title,
        description,
        date,
        image: image || undefined,
        selectedColor,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-2xl font-semibold focus:outline-none px-0 relative h-10 editable-title">
        <EditorContent editor={titleEditor} />
      </div>

      <div className="min-h-[100px] resize-none px-0 relative border-none editable-description rounded p-2">
        <EditorContent className="border-none" editor={editor} />
      </div>

      <EditorToolbar editor={editor} />

      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "pl-0 text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Add date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <Button
            variant="ghost"
            className="pl-0"
            onClick={() => document.getElementById('image-upload')?.click()}
            type="button"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            {imageUrl ? "Change image" : "Add image"}
          </Button>
        </div>
      </div>

      <ColorPicker selectedColor={selectedColor} onColorChange={setSelectedColor} />

      {imageUrl && (
        <div className="mt-2">
          <img
            src={imageUrl}
            alt="Preview"
            className="max-h-48 rounded-md object-cover"
          />
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isUploading}>
          {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update" : "Add"} Note
        </Button>
      </div>
    </form>
  );
};
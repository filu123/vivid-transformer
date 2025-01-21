import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, ImageIcon, CheckSquare } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Drawer } from "vaul";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Placeholder from '@tiptap/extension-placeholder';


interface NoteFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNoteAdded: () => void;
  editNote?: {
    id: string;
    title: string;
    description?: string;
    date?: string;
    image_url?: string;
    background_color?: string;
  };
}

const COLORS = ['#ff9b74', '#fdc971', '#ebc49a', '#322a2f', '#c15626', '#ebe3d6', '#a2a8a5'];

export const NoteFormDrawer = ({
  isOpen,
  onClose,
  onNoteAdded,
  editNote,
}: NoteFormDrawerProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#ff9b74');
  const { toast } = useToast();

  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const titleEditor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, bold: false, italic: false }),
      Placeholder.configure({
        placeholder: 'Title',
      }),
    ],
    content: editNote?.title || '',
    onUpdate: ({ editor }) => {
      setTitle(editor.getText());
    },
  });


  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable default list extensions to use custom ones
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Underline,
      BulletList,
      OrderedList,
      ListItem,
  
      // Add other extensions like Blockquote, Link, etc., if needed
    ],
    content: editNote?.description || '',
    onUpdate: ({ editor }) => {
      setDescription(editor.getHTML());
    },
  });


  useEffect(() => {
    if (editNote && editor) {
      editor.commands.setContent(editNote.description || '');
    } else if (editor) {
      editor.commands.setContent('');
    }
  }, [editNote, editor]);

  // Initialize fields when editNote changes
  useEffect(() => {
    if (editNote) {
      setTitle(editNote.title);
      setDescription(editNote.description || "");
      setDate(editNote.date ? new Date(editNote.date) : undefined);
      setImageUrl(editNote.image_url || null);
      setSelectedColor(editNote.background_color || '#ff9b74');

      if (titleRef.current) {
        titleRef.current.textContent = editNote.title;
      }
      if (descriptionRef.current) {
        descriptionRef.current.textContent = editNote.description || "";
      }
    } else {
      setTitle("");
      setDescription("");
      setDate(undefined);
      setImageUrl(null);
      setSelectedColor('#ff9b74');

      if (titleRef.current) {
        titleRef.current.textContent = "";
      }
      if (descriptionRef.current) {
        descriptionRef.current.textContent = "";
      }
    }
  }, [editNote]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const { error: uploadError, data } = await supabase.storage
      .from('note_images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('note_images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No user found");
      }

      let finalImageUrl = imageUrl;
      if (image) {
        finalImageUrl = await uploadImage(image);
      }

      if (editNote) {
        const { error } = await supabase
          .from("notes")
          .update({
            title,
            description: description || null,
            date: date?.toISOString().split('T')[0] || null,
            image_url: finalImageUrl,
            background_color: selectedColor,
          })
          .eq('id', editNote.id);

        if (error) throw error;

        toast({
          title: "Note updated successfully",
          description: "Your note has been updated.",
        });
      } else {
        const { error } = await supabase.from("notes").insert({
          title,
          description: description || null,
          date: date?.toISOString().split('T')[0] || null,
          image_url: finalImageUrl,
          background_color: selectedColor,
          user_id: user.id,
        });

        if (error) throw error;

        toast({
          title: "Note added successfully",
          description: "Your new note has been created.",
        });
      }

      onNoteAdded();
      onClose();
      setTitle("");
      setDescription("");
      setDate(undefined);
      setImage(null);
      setImageUrl(null);
      setSelectedColor('#ff9b74');
    } catch (error) {
      toast({
        title: editNote ? "Error updating note" : "Error adding note",
        description: "There was an error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] md:w-[70vw] mx-auto mt-24 fixed bottom-0 left-0 right-0 h-[85vh]">
          <div className="p-4 bg-background rounded-t-[10px] flex-1 h-full overflow-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Inline Editable Title */}
                <div
                  className="text-2xl font-semibold focus:outline-none px-0 relative h-10 editable-title"
                >
                  <EditorContent editor={titleEditor} />
                </div>

                {/* Inline Editable Description */}
                {/* <div
                  contentEditable
                  suppressContentEditableWarning
                  className="min-h-[100px] resize-none  focus:outline-none px-0 relative editable-description"
                  onInput={(e) => setDescription(e.currentTarget.textContent?.trim() || "")}
                  ref={descriptionRef}
                  data-placeholder="Write something..."
                  aria-label="Note Description"
                ></div> */}
                {/* Rich Text Editor for Description */}
                <div className="min-h-[100px] resize-none  px-0 relative border-none editable-description  rounded p-2">
                  <EditorContent className="border-none" editor={editor} />
                </div>

                {/* Toolbar for Text Styling */}
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
              
                  {/* Add more styling buttons as needed */}
                </div>

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

                <div className="flex items-center gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-6 h-6 rounded-full transition-transform",
                        selectedColor === color ? "scale-110 ring-2 ring-offset-2 ring-black" : ""
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

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
                    {editNote ? "Update" : "Add"} Note
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
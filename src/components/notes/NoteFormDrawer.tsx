import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Drawer } from "vaul";

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
  };
}

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
  const { toast } = useToast();

  useEffect(() => {
    if (editNote) {
      setTitle(editNote.title);
      setDescription(editNote.description || "");
      setDate(editNote.date ? new Date(editNote.date) : undefined);
      setImageUrl(editNote.image_url || null);
    } else {
      setTitle("");
      setDescription("");
      setDate(undefined);
      setImageUrl(null);
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
    <Drawer.Root  open={isOpen} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0  bg-black/40" />
        <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0 h-[85vh]">
          <div className="p-4 bg-background rounded-t-[10px] flex-1 h-full overflow-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={70}
                  required
                  placeholder="Title"
                  className="text-2xl font-semibold border-none shadow-none focus-visible:ring-0 px-0 placeholder:text-muted-foreground/50"
                />
                
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write something..."
                  className="min-h-[150px] resize-none border-none shadow-none focus-visible:ring-0 px-0 placeholder:text-muted-foreground/50"
                />

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
                    <Input
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

                {imageUrl && (
                  <div className="mt-2">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="max-h-48 rounded-md object-cover"
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4 border-t">
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
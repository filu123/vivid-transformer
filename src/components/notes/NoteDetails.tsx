import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { RichTextEditor } from "@/components/RichTextEditor";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";

interface NoteDetailsProps {
  id: string;
  title: string;
  description?: string;
  date?: string;
  onNoteUpdated: () => void;
}

export const NoteDetails = ({ id, title, description, date, onNoteUpdated }: NoteDetailsProps) => {
  const { toast } = useToast();
  const [content, setContent] = useState(description || "");
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Update content when note changes
  useEffect(() => {
    setContent(description || "");
  }, [id, description]);

  const handleDescriptionChange = async (newDescription: string) => {
    setContent(newDescription);

    // Clear existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    // Set new timeout for auto-save
    const timeout = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from("notes")
          .update({ description: newDescription })
          .eq('id', id);

        if (error) throw error;

        onNoteUpdated();
      } catch (error) {
        toast({
          title: "Error updating note",
          description: "Failed to save your changes. Please try again.",
          variant: "destructive",
        });
      }
    }, 1000); // Save after 1 second of no typing

    setSaveTimeout(timeout);
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        {date && (
          <div className="flex items-center gap-2 text-muted-foreground mb-6">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(date), "MMM d, yyyy")}</span>
          </div>
        )}
        <RichTextEditor
          value={content}
          onChange={handleDescriptionChange}
          className="h-full"
        />
      </div>
    </div>
  );
};
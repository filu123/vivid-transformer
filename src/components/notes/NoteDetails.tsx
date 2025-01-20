import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { RichTextEditor } from "@/components/RichTextEditor";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface NoteDetailsProps {
  id: string;
  title: string;
  description?: string;
  date?: string;
  onNoteUpdated: () => void;
}

export const NoteDetails = ({ id, title, description, date, onNoteUpdated }: NoteDetailsProps) => {
  const { toast } = useToast();

  const handleDescriptionChange = async (newDescription: string) => {
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
          value={description || ""}
          onChange={handleDescriptionChange}
          className="h-full"
        />
      </div>
      <div className="p-8 flex justify-center">
        <img
          src="/lovable-uploads/1a8e758d-1e9d-46ff-b73d-4c1711306b91.png"
          alt="Note taking illustration"
          className="max-w-[400px] w-full opacity-50"
        />
      </div>
    </div>
  );
};
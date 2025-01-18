import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface NoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNoteAdded: () => void;
  editNote?: {
    id: string;
    title: string;
    description?: string;
    date?: string;
  };
}

export const NoteFormModal = ({
  isOpen,
  onClose,
  onNoteAdded,
  editNote,
}: NoteFormModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (editNote) {
      setTitle(editNote.title);
      setDescription(editNote.description || "");
      setDate(editNote.date ? new Date(editNote.date) : undefined);
    } else {
      setTitle("");
      setDescription("");
      setDate(undefined);
    }
  }, [editNote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      if (editNote) {
        const { error } = await supabase
          .from("notes")
          .update({
            title,
            description: description || null,
            date: date?.toISOString().split('T')[0] || null,
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
    } catch (error) {
      toast({
        title: editNote ? "Error updating note" : "Error adding note",
        description: "There was an error. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{editNote ? "Edit Note" : "Add New Note"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={70}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label>Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" onClick={(e) => e.stopPropagation()}>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editNote ? "Update" : "Add"} Note
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
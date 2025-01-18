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
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface DayItem {
  id: string;
  title: string;
  type: "task" | "habit" | "reminder" | "note";
  startTime?: string;
  endTime?: string;
  duration?: string;
  note?: string;
  isDone?: boolean;
}

interface PriorityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onPriorityAdded: () => void;
  editItem?: DayItem | null;
}

export const PriorityFormModal = ({
  isOpen,
  onClose,
  selectedDate,
  onPriorityAdded,
  editItem,
}: PriorityFormModalProps) => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [note, setNote] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title);
      setStartTime(editItem.startTime ? format(new Date(`2000-01-01T${editItem.startTime}`), "HH:mm") : "");
      setEndTime(editItem.endTime ? format(new Date(`2000-01-01T${editItem.endTime}`), "HH:mm") : "");
      setNote(editItem.note || "");
    } else {
      setTitle("");
      setStartTime("");
      setEndTime("");
      setNote("");
    }
  }, [editItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      if (editItem) {
        const { error } = await supabase
          .from("priorities")
          .update({
            title,
            start_time: startTime || null,
            end_time: endTime || null,
            note: note || null,
            date: format(selectedDate, "yyyy-MM-dd"),
          })
          .eq('id', editItem.id);

        if (error) throw error;

        toast({
          title: "Priority updated successfully",
          description: "Your priority has been updated.",
        });
      } else {
        const { error } = await supabase.from("priorities").insert({
          title,
          start_time: startTime || null,
          end_time: endTime || null,
          note: note || null,
          date: format(selectedDate, "yyyy-MM-dd"),
          user_id: user.id,
        });

        if (error) throw error;

        toast({
          title: "Priority added successfully",
          description: "Your new priority has been created.",
        });
      }

      onPriorityAdded();
      onClose();
      setTitle("");
      setStartTime("");
      setEndTime("");
      setNote("");
    } catch (error) {
      toast({
        title: editItem ? "Error updating priority" : "Error adding priority",
        description: "There was an error. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editItem ? "Edit Priority" : "Add Priority"} for {format(selectedDate, "MMMM d, yyyy")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Name *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={70}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={100}
              className="resize-none"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editItem ? "Update" : "Add"} Priority
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useState, useEffect } from "react";

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

interface PriorityFormProps {
  selectedDate: Date;
  onPriorityAdded: () => void;
  onClose: () => void;
  editItem?: DayItem | null;
}

export const PriorityForm = ({
  selectedDate,
  onPriorityAdded,
  onClose,
  editItem,
}: PriorityFormProps) => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [note, setNote] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title);
      setStartTime(editItem.startTime?.slice(0, 5) || "");
      setEndTime(editItem.endTime?.slice(0, 5) || "");
      setNote(editItem.note || "");
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
    } catch (error) {
      toast({
        title: editItem ? "Error updating priority" : "Error adding priority",
        description: "There was an error. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
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
  );
};
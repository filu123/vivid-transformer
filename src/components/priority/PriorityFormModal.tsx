import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Drawer } from "vaul";
import { PriorityColorPicker } from "./form/PriorityColorPicker";
import { PriorityTimeInputs } from "./form/PriorityTimeInputs";

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
  const [selectedColor, setSelectedColor] = useState('#F2FCE2');
  const { toast } = useToast();

  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title);
      setStartTime(editItem.startTime?.slice(0, 5) || "");
      setEndTime(editItem.endTime?.slice(0, 5) || "");
      setNote(editItem.note || "");
    } else {
      setTitle("");
      setStartTime("");
      setEndTime("");
      setNote("");
      setSelectedColor('#F2FCE2');
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
            background_color: selectedColor,
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
          background_color: selectedColor,
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
    <Drawer.Root open={isOpen} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0 max-h-[96%] max-w-lg mx-auto">
          <div className="p-4 bg-background rounded-t-[10px] overflow-y-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
            <div className="mb-4">
              <h3 className="text-lg font-semibold">
                {editItem ? "Edit Priority" : "Add Priority"} for {format(selectedDate, "MMMM d, yyyy")}
              </h3>
            </div>
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
              
              <PriorityTimeInputs
                startTime={startTime}
                endTime={endTime}
                onStartTimeChange={setStartTime}
                onEndTimeChange={setEndTime}
              />

              <PriorityColorPicker
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
              />

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

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editItem ? "Update" : "Add"} Priority
                </Button>
              </div>
            </form>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { PriorityColorPicker } from "./priority/form/PriorityColorPicker";
import { PriorityTimeInputs } from "./priority/form/PriorityTimeInputs";
import { Drawer } from "vaul";
import { PriorityFormTitle } from "./priority/PriorityFormTitle";
import { PriorityStartTime } from "./priority/PriorityFormStartTime";
import { ToggleableInput } from "@/components/ui/ToggleableInput";
import { ClockIcon, NotebookIcon } from "lucide-react";

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
  const [title, setTitle] = useState("New Priority");
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
      setSelectedColor('#F2FCE2');
    } else {
      setTitle("New Priority");
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
        <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 h-[85vh] mt-24">
          <div className={`p-4 bg-background rounded-t-[10px] flex-1`}>
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
            <div className="p-4 bg-background rounded-t-[10px] overflow-y-auto max-w-3xl mx-auto">
              <div className="mb-4 ">
                <h3 className="text-xl font-semibold mb-10">
                  {editItem ? "Edit Priority" : "Add Priority"} for {format(selectedDate, "MMMM d, yyyy")}
                </h3>
              </div>
              <form onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }} onSubmit={handleSubmit} className="space-y-4 ">
                <PriorityFormTitle initialTitle={title} onTitleChange={setTitle} />

                <div className="space-y-5">
                  {/* Toggleable Note Input */}
                  <ToggleableInput Icon={NotebookIcon} label="Add Note">
                    <div className="space-y-2">
                      <Textarea
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        maxLength={100}
                        className="resize-none w-[50%] min-h-[100px]"
                      />
                    </div>
                  </ToggleableInput>

                  {/* Toggleable Time Input */}
                  <ToggleableInput Icon={ClockIcon} label="Add Time">
                    <PriorityTimeInputs
                      startTime={startTime}
                      endTime={endTime}
                      onStartTimeChange={setStartTime}
                      onEndTimeChange={setEndTime}
                    />
                  </ToggleableInput>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" type="button" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editItem ? "Update" : "Add"} Priority
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
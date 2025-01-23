import { useState, useRef } from "react";
import { Drawer } from "vaul";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ReminderDateTime } from "./ReminderDateTime";
import { ReminderListSelect } from "./ReminderListSelect";
import { Label } from "@/components/ui/label";

interface ReminderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

const COLORS = [
  "#F2FCE2",
  "#FEF7CD",
  "#FEC6A1",
  "#E5DEFF",
  "#FFDEE2",
  "#FDE1D3",
  "#D3E4FD",
  "#D6BCFA",
];

export const ReminderFormModal = ({
  isOpen,
  onClose,
  triggerRef,
}: ReminderFormModalProps) => {
  const [title, setTitle] = useState("");
  const [listId, setListId] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState(COLORS[0]);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to create reminders");
        return;
      }

      let dueDate: Date | null = null;
      if (date) {
        dueDate = new Date(date);
        if (time) {
          const [hours, minutes] = time.split(':').map(Number);
          dueDate.setHours(hours, minutes);
        }
      }

      let category: "all" | "today" | "scheduled" = "all";
      if (date) {
        const today = new Date();
        const isToday = date.getDate() === today.getDate() &&
                       date.getMonth() === today.getMonth() &&
                       date.getFullYear() === today.getFullYear();
        category = isToday ? "today" : "scheduled";
      }

      const { error } = await supabase.from("reminders").insert({
        title,
        list_id: listId || null,
        due_date: dueDate?.toISOString(),
        user_id: user.id,
        category,
        background_color: backgroundColor,
      });

      if (error) throw error;

      toast.success("Reminder created successfully");
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      onClose();
      setTitle("");
      setListId("");
      setDate(undefined);
      setTime("");
      setBackgroundColor(COLORS[0]);
    } catch (error) {
      console.error("Error creating reminder:", error);
      toast.error("Failed to create reminder");
    }
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content 
          className="bg-background flex flex-col rounded-t-[10px] fixed max-w-lg w-full mx-auto left-1/2 -translate-x-1/2 top-[10%] h-auto rounded-b-[10px] shadow-lg"
        >
          <div className="p-4 bg-background rounded-[10px]">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  placeholder="Reminder title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg border-none bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
                  required
                />
              </div>
              
              <div className="space-y-4 rounded-lg bg-muted/50 p-4">
                <ReminderListSelect 
                  value={listId} 
                  onChange={setListId}
                  className="border-none bg-background focus-visible:ring-0"
                />
                <ReminderDateTime
                  date={date}
                  time={time}
                  onDateChange={setDate}
                  onTimeChange={setTime}
                />
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                          backgroundColor === color ? "ring-2 ring-offset-2 ring-black" : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setBackgroundColor(color)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={onClose}
                  className="hover:bg-muted/50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-primary hover:bg-primary/90"
                >
                  Add Reminder
                </Button>
              </div>
            </form>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
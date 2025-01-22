import { useState, useRef } from "react";
import { Drawer } from "vaul";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ReminderDateTime } from "./ReminderDateTime";
import { ReminderListSelect } from "./ReminderListSelect";

interface ReminderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

export const ReminderFormModal = ({
  isOpen,
  onClose,
  triggerRef,
}: ReminderFormModalProps) => {
  const [title, setTitle] = useState("");
  const [listId, setListId] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create reminders",
          variant: "destructive",
        });
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
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reminder created successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      onClose();
      setTitle("");
      setListId("");
      setDate(undefined);
      setTime("");
    } catch (error) {
      console.error("Error creating reminder:", error);
      toast({
        title: "Error",
        description: "Failed to create reminder",
        variant: "destructive",
      });
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
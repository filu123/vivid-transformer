import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface ReminderDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  reminder: {
    id: string;
    title: string;
    due_date?: string;
    is_completed: boolean;
    category: string;
    background_color?: string;
  };
  onUpdate: () => void;
}

export const ReminderDetailsDrawer = ({ open, onClose, reminder, onUpdate }: ReminderDetailsDrawerProps) => {
  const [title, setTitle] = useState(reminder.title);
  const [dueDate, setDueDate] = useState(
    reminder.due_date ? format(new Date(reminder.due_date), "yyyy-MM-dd'T'HH:mm") : ""
  );
  const [backgroundColor, setBackgroundColor] = useState(reminder.background_color || "#F2FCE2");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("reminders")
        .update({
          title,
          due_date: dueDate || null,
          background_color: backgroundColor,
        })
        .eq("id", reminder.id);

      if (error) throw error;

      toast.success("Reminder updated successfully");
      onUpdate();
      onClose();
    } catch (error) {
      toast.error("Failed to update reminder");
    }
  };

  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-[50%] translate-x-[-50%] w-[90%] max-w-[500px] h-[85vh]">
          <div className="p-4 bg-background rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    {["#F2FCE2", "#FEC6A1", "#E5DEFF", "#FFDEE2", "#FDE1D3", "#D3E4FD", "#D6BCFA"].map((color) => (
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

                <div className="flex justify-end gap-2">
                  <Button variant="outline" type="button" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Reminder</Button>
                </div>
              </form>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
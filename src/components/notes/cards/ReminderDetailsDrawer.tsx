import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

const COLORS = ["#ff9b74", "#fdc971", "#ebc49a", "#322a2f", "#c15626", "#ebe3d6", "#a2a8a5"];

export const ReminderDetailsDrawer = ({ open, onClose, reminder, onUpdate }: ReminderDetailsDrawerProps) => {
  const [title, setTitle] = useState(reminder.title);
  const [dueDate, setDueDate] = useState<string>(reminder.due_date || '');
  const [backgroundColor, setBackgroundColor] = useState(reminder.background_color || COLORS[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from("reminders")
        .update({
          title,
          due_date: dueDate,
          background_color: backgroundColor,
          user_id: user.id
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
        <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0 h-[85vh]">
          <div className="p-4 bg-background rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
            <div className="max-w-3xl mx-auto">
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
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="datetime-local"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="border-none bg-background focus-visible:ring-0"
                    />
                  </div>

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
                    Update Reminder
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
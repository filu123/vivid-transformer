import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface Reminder {
  id: string;
  title: string;
  due_date: string;
  is_completed: boolean;
  background_color?: string;
}

interface DayRemindersProps {
  reminders: Reminder[];
  onUpdate?: () => void;
}

export const DayReminders = ({ reminders, onUpdate }: DayRemindersProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (id: string, currentState: boolean) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("reminders")
        .update({ 
          is_completed: !currentState,
          user_id: user.id 
        })
        .eq("id", id);

      if (error) throw error;
      onUpdate?.();
      toast.success("Reminder updated successfully");
    } catch (error) {
      console.error("Error updating reminder:", error);
      toast.error("Failed to update reminder");
    } finally {
      setIsLoading(false);
    }
  };

  if (!reminders.length) return null;

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-lg font-semibold">Reminders</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {reminders.map((reminder) => (
          <Card 
            key={reminder.id} 
            className="p-4 flex flex-col justify-between"
            style={{ backgroundColor: reminder.background_color || "#ff9b74" }}
          >
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id={`reminder-${reminder.id}`}
                  checked={reminder.is_completed}
                  onCheckedChange={() => handleToggle(reminder.id, reminder.is_completed)}
                  disabled={isLoading}
                  className="mt-1"
                />
                <label 
                  htmlFor={`reminder-${reminder.id}`}
                  className={`flex-1 ${reminder.is_completed ? "line-through text-muted-foreground" : ""}`}
                >
                  {reminder.title}
                </label>
              </div>
              {reminder.due_date && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {format(new Date(reminder.due_date), "h:mm a")}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
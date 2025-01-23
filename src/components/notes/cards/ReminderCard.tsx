import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useState } from "react";
import { ReminderDetailsDrawer } from "./ReminderDetailsDrawer";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ReminderCardProps {
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

export const ReminderCard = ({ reminder, onUpdate }: ReminderCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("reminders")
        .update({ 
          is_completed: !reminder.is_completed,
          user_id: user.id 
        })
        .eq("id", reminder.id);

      if (error) throw error;
      onUpdate();
      toast.success("Reminder updated successfully");
    } catch (error) {
      console.error("Error updating reminder:", error);
      toast.error("Failed to update reminder");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card
        className="min-h-[270px] max-h-[270px] transition-all duration-200 hover:scale-[1.02] cursor-pointer overflow-hidden p-6"
        style={{ backgroundColor: reminder.background_color || "#F2FCE2" }}
        onClick={() => setIsDetailsOpen(true)}
      >
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={reminder.is_completed}
                onCheckedChange={() => handleToggle()}
                disabled={isLoading}
                onClick={(e) => e.stopPropagation()}
                className="mt-1"
              />
              <h3 className={`font-semibold text-xl line-clamp-2 ${
                reminder.is_completed ? "line-through text-muted-foreground" : ""
              }`}>
                {reminder.title}
              </h3>
            </div>
            <Badge variant="outline" className="capitalize">
              {reminder.category}
            </Badge>
          </div>
          {reminder.due_date && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(reminder.due_date), "PPp")}</span>
            </div>
          )}
        </div>
      </Card>

      <ReminderDetailsDrawer
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        reminder={reminder}
        onUpdate={onUpdate}
      />
    </>
  );
};
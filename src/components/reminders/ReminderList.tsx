import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

interface ReminderListProps {
  list: {
    id: string;
    name: string;
  };
  isSelected: boolean;
  onSelect: () => void;
}

export const ReminderList = ({ list, isSelected, onSelect }: ReminderListProps) => {
  const { data: reminders } = useQuery({
    queryKey: ["reminders", list.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("list_id", list.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleToggleReminder = async (reminderId: string, currentState: boolean) => {
    const { error } = await supabase
      .from("reminders")
      .update({ is_completed: !currentState })
      .eq("id", reminderId);

    if (error) {
      console.error("Error updating reminder:", error);
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-colors ${
        isSelected ? "border-primary" : ""
      }`}
      onClick={onSelect}
    >
      <CardHeader>
        <CardTitle className="text-lg">{list.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reminders?.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-start gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                checked={reminder.is_completed}
                onCheckedChange={() =>
                  handleToggleReminder(reminder.id, reminder.is_completed)
                }
              />
              <div className="flex-1">
                <p
                  className={`text-sm ${
                    reminder.is_completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {reminder.title}
                </p>
                {reminder.due_date && (
                  <p className="text-xs text-muted-foreground">
                    Due: {format(new Date(reminder.due_date), "PPP")}
                  </p>
                )}
              </div>
            </div>
          ))}
          {(!reminders || reminders.length === 0) && (
            <p className="text-sm text-muted-foreground">No reminders yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
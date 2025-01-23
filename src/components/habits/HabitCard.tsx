import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format, getDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HabitCardProps {
  habit: any;
  onHabitUpdated: () => void;
  selectedDate: Date;
}

export const HabitCard = ({ habit, onHabitUpdated, selectedDate }: HabitCardProps) => {
  const shouldDisplayHabit = () => {
    switch (habit.frequency) {
      case "daily":
        return true;
      case "three_times":
        const dayOfWeek = getDay(selectedDate);
        return [1, 3, 5].includes(dayOfWeek);
      case "custom":
        return habit.custom_days?.includes(getDay(selectedDate));
      default:
        return false;
    }
  };

  if (!shouldDisplayHabit()) {
    return null;
  }

  const handleToggleCompletion = async () => {
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      
      if (!habit.isCompleted) {
        const { error } = await supabase
          .from('habit_completions')
          .insert({
            habit_id: habit.id,
            completed_date: dateStr,
          });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .match({
            habit_id: habit.id,
            completed_date: dateStr,
          });
        if (error) throw error;
      }

      onHabitUpdated();
      toast.success(habit.isCompleted ? 'Habit unmarked' : 'Habit completed');
    } catch (error) {
      console.error('Error toggling habit completion:', error);
      toast.error('Failed to update habit');
    }
  };

  return (
    <Card className="p-4" style={{ backgroundColor: habit.background_color || "#ff9b74" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={habit.isCompleted}
            onCheckedChange={handleToggleCompletion}
          />
          <div>
            <h4 className="font-medium">{habit.title}</h4>
            <p className="text-sm text-muted-foreground">
              {habit.duration_minutes} minutes
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
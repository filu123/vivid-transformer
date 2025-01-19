import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HabitCardProps {
  habit: any;
  onHabitUpdated: () => void;
  selectedDate: Date;
}

export const HabitCard = ({ habit, onHabitUpdated, selectedDate }: HabitCardProps) => {
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
    <Card className="p-4">
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
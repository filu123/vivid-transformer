
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HabitCheckboxProps {
  habitId: string;
  title: string;
  isCompleted: boolean;
  onToggle: () => void;
}

export const HabitCheckbox = ({ habitId, title, isCompleted, onToggle }: HabitCheckboxProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      
      if (!isCompleted) {
        // First check if a completion already exists
        const { data: existingCompletion } = await supabase
          .from("habit_completions")
          .select()
          .match({
            habit_id: habitId,
            completed_date: today,
          })
          .single();

        // Only insert if no completion exists
        if (!existingCompletion) {
          const { error } = await supabase
            .from("habit_completions")
            .insert({
              habit_id: habitId,
              completed_date: today,
            });

          if (error) throw error;
        }
      } else {
        const { error } = await supabase
          .from("habit_completions")
          .delete()
          .match({
            habit_id: habitId,
            completed_date: today,
          });

        if (error) throw error;
      }
      onToggle();
    } catch (error) {
      console.error("Error toggling habit:", error);
      toast.error("Failed to update habit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        checked={isCompleted}
        onCheckedChange={handleToggle}
        disabled={isLoading}
      />
      <span className={`${isCompleted ? "line-through text-muted-foreground" : ""}`}>
        {title}
      </span>
    </div>
  );
};

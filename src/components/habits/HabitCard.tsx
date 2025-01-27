// src/components/habits/HabitCard.tsx
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format, getDay } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HabitFormModal } from "./HabitFormModal"; // Ensure HabitFormDrawer is correctly implemented

interface HabitCardProps {
  habit: any;
  onHabitUpdated: () => void;
  selectedDate: Date;
  onDrawingClick?: (habit: any) => void; // If applicable
}

export const HabitCard = ({ habit, onHabitUpdated, selectedDate, onDrawingClick }: HabitCardProps) => {
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isTitleTwoLines, setIsTitleTwoLines] = useState(false);

  useEffect(() => {
    if (titleRef.current) {
      const titleHeight = titleRef.current.offsetHeight;
      setIsTitleTwoLines(titleHeight > 28); // Adjust based on your styling
    }
  }, [habit.title]);

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

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from("habits").delete().eq("id", habit.id);

      if (error) throw error;

      toast.success("Habit deleted successfully.");

      onHabitUpdated();
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete the habit. Please try again.');
    }
  };

  const handleCardClick = () => {
    setIsEditDrawerOpen(true);
  };

  return (
    <>
      <Card 
        className="min-h-[170px] max-h-[170px] transition-all duration-200 hover:scale-[1.02] cursor-pointer overflow-hidden p-6"
        style={{ backgroundColor: habit.background_color || "#ff9b74" }}
        onClick={handleCardClick}
      >
        <CardContent className="flex flex-col p-0 h-full space-y-4">

          <div className="flex items-center gap-4 items-start">
          <Checkbox
              checked={habit.isCompleted}
              onCheckedChange={handleToggleCompletion}
              onClick={(e) => e.stopPropagation()} // Prevent card click when interacting with checkbox
            />
            <h3 ref={titleRef} className="font-semibold text-xl line-clamp-2">{habit.title}</h3>
            <div className="flex gap-2 ml-auto">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="bg-white p-2  rounded-full"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Delete Habit"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this habit.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
          </div>
         
          {habit.description && (
            <div
              className="prose text-sm text-muted-foreground line-clamp-3"
              dangerouslySetInnerHTML={{ __html: habit.description }}
            />
          )}
          {habit.created_at && (
            <p className="text-sm text-muted-foreground mt-auto">
              {format(new Date(habit.created_at), "MMM d, yyyy")}
            </p>
          )}
        </CardContent>
      </Card>

      <HabitFormModal
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        editHabit={habit}
        onHabitAdded={onHabitUpdated}
      />
    </>
  );
};
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { HabitFormModal } from "./HabitFormModal";

interface HabitCardProps {
  habit: any;
  onHabitUpdated: () => void;
  selectedDate: Date;
}

export const HabitCard = ({ habit, onHabitUpdated, selectedDate }: HabitCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habit.id);

      if (error) throw error;

      onHabitUpdated();
      toast.success('Habit deleted');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
    }
  };

  return (
    <>
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
                {habit.frequency === 'daily' ? 'Every day' :
                 habit.frequency === 'three_times' ? 'Three times a week' :
                 'Custom schedule'}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this habit and all its completion records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <HabitFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onHabitAdded={onHabitUpdated}
        editHabit={habit}
      />
    </>
  );
};
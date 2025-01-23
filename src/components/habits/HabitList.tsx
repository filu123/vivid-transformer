import { Card } from "@/components/ui/card";
import { format, addMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { HabitFormModal } from "./HabitFormModal";
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

interface Habit {
  id: string;
  title: string;
  frequency: "daily" | "three_times" | "custom";
  custom_days: number[] | null;
  duration_months: number;
  duration_minutes: number;
  start_date: string;
  background_color: string;
}

interface HabitListProps {
  habits: Habit[];
  onHabitUpdated: () => void;
}

export const HabitList = ({ habits, onHabitUpdated }: HabitListProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const handleDelete = async () => {
    if (!selectedHabit) return;

    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', selectedHabit.id);

      if (error) throw error;

      onHabitUpdated();
      toast.success('Habit deleted');
      setIsDeleteDialogOpen(false);
      setSelectedHabit(null);
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
    }
  };

  const getFrequencyText = (habit: Habit) => {
    switch (habit.frequency) {
      case "daily":
        return "Every day";
      case "three_times":
        return "Three times a week";
      case "custom":
        return `Custom: ${habit.custom_days?.map((day) => 
          ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]
        ).join(", ")}`;
      default:
        return "";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {habits.map((habit) => (
        <Card key={habit.id} className="p-6" style={{ backgroundColor: habit.background_color || "#ff9b74" }}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold mb-2">{habit.title}</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Frequency: {getFrequencyText(habit)}</p>
                <p>Duration: {habit.duration_minutes} minutes per day</p>
                <p>Goal: Until {format(addMonths(new Date(habit.start_date), habit.duration_months), "PP")}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {
                  setSelectedHabit(habit);
                  setIsEditModalOpen(true);
                }}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => {
                    setSelectedHabit(habit);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      ))}

      {habits.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No habits created yet
        </div>
      )}

      <HabitFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedHabit(null);
        }}
        onHabitAdded={onHabitUpdated}
        editHabit={selectedHabit}
      />

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
    </div>
  );
};
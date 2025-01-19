import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
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
import { PriorityFormModal } from "./priority/PriorityFormModal";
import { TaskCard } from "./TaskCard";
import { AddPriorityButton } from "./priority/AddPriorityButton";

interface DayItem {
  id: string;
  title: string;
  type: "task" | "habit" | "reminder" | "note";
  startTime?: string;
  endTime?: string;
  duration?: string;
  note?: string;
  isDone?: boolean;
}

interface DayItemsProps {
  date: Date;
  items: DayItem[];
  onItemsChange: () => void;
}

export const DayItems = ({ date, items, onItemsChange }: DayItemsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<DayItem | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("priorities")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Priority deleted",
        description: "The priority has been deleted successfully.",
      });

      onItemsChange();
    } catch (error) {
      toast({
        title: "Error deleting priority",
        description: "There was an error deleting the priority. Please try again.",
        variant: "destructive",
      });
    }
    setDeleteId(null);
  };

  const handleToggleDone = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from("priorities")
        .update({ is_done: !currentState })
        .eq("id", id);

      if (error) throw error;

      onItemsChange();
    } catch (error) {
      toast({
        title: "Error updating priority",
        description: "There was an error updating the priority. Please try again.",
        variant: "destructive",
      });
    }
  };

  const canAddMorePriorities = items.length < 3;

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {items.map((item) => (
          <TaskCard
            key={item.id}
            id={item.id}
            title={item.title}
            startTime={item.startTime}
            endTime={item.endTime}
            duration={item.duration}
            note={item.note}
            isDone={item.isDone}
            variant="yellow"
            onEdit={() => {
              setEditItem(item);
              setIsModalOpen(true);
            }}
            onDelete={() => setDeleteId(item.id)}
            onToggleDone={() => handleToggleDone(item.id, !!item.isDone)}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className="mt-8 text-center text-gray-500">
          Nothing for today
        </div>
      )}

      {canAddMorePriorities && (
        <AddPriorityButton onClick={() => setIsModalOpen(true)} />
      )}

      <PriorityFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditItem(null);
        }}
        selectedDate={date}
        onPriorityAdded={onItemsChange}
        editItem={editItem}
      />

      <AlertDialog open={!!deleteId}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the priority.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
import { TaskCard } from "./TaskCard";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { PriorityFormModal } from "./PriorityFormModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { format } from "date-fns";
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

  const getVariant = (type: DayItem["type"]) => {
    switch (type) {
      case "task":
        return "yellow";
      case "habit":
        return "blue";
      case "reminder":
        return "purple";
      case "note":
        return "green";
    }
  };

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

  if (items.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-gray-400 transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-600">Add a priority for this day</p>
        </div>
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
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {items.map((item) => (
          <div key={item.id} className="w-full">
            <TaskCard
              id={item.id}
              title={item.title}
              startTime={item.startTime}
              endTime={item.endTime}
              duration={item.duration}
              variant={getVariant(item.type)}
              note={item.note}
              isDone={item.isDone}
              onDelete={() => setDeleteId(item.id)}
              onEdit={() => {
                setEditItem(item);
                setIsModalOpen(true);
              }}
              onToggleDone={() => handleToggleDone(item.id, !!item.isDone)}
            />
          </div>
        ))}
      </div>
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
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the priority.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
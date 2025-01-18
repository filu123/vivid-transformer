import { TaskCard } from "./TaskCard";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { PriorityFormModal } from "./PriorityFormModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { format } from "date-fns";

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
          onClose={() => setIsModalOpen(false)}
          selectedDate={date}
          onPriorityAdded={onItemsChange}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsModalOpen(true)}>
          Add Priority
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <TaskCard
            key={item.id}
            id={item.id}
            title={item.title}
            startTime={item.startTime}
            endTime={item.endTime}
            duration={item.duration}
            variant={getVariant(item.type)}
            note={item.note}
            isDone={item.isDone}
            onDelete={() => handleDelete(item.id)}
            onToggleDone={() => handleToggleDone(item.id, !!item.isDone)}
          />
        ))}
      </div>
      <PriorityFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={date}
        onPriorityAdded={onItemsChange}
      />
    </div>
  );
};
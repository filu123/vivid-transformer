import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PriorityFormDrawer } from "./PriorityFormDrawer";
import { PriorityList } from "./priority/PriorityList";
import { supabase } from "@/integrations/supabase/client";

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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<DayItem | null>(null);

  const handleEdit = (item: DayItem) => {
    setEditItem(item);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditItem(null);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("priorities")
        .delete()
        .eq("id", id);

      if (error) throw error;

      onItemsChange();
    } catch (error) {
      console.error("Error deleting priority:", error);
    }
  };

  const handleToggleDone = async (id: string, isDone: boolean) => {
    try {
      const { error } = await supabase
        .from("priorities")
        .update({ is_done: !isDone })
        .eq("id", id);

      if (error) throw error;

      onItemsChange();
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Priorities</h2>
        {items.length < 4 && (
          <Button
            onClick={() => setIsFormOpen(true)}
            variant="outline"
            size="sm"
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Priority
          </Button>
        )}
      </div>

      <PriorityList
        items={items}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleDone={handleToggleDone}
      />

      <PriorityFormDrawer
        isOpen={isFormOpen}
        onClose={handleClose}
        selectedDate={date}
        onPriorityAdded={onItemsChange}
        editItem={editItem}
      />
    </div>
  );
};

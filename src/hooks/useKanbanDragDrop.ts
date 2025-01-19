import { useState } from "react";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Task {
  id: string;
  title: string;
  note?: string;
  status: string;
  is_done?: boolean;
}

export const useKanbanDragDrop = (onTaskUpdated: () => void) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { toast } = useToast();

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current as Task;
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const taskId = active.id.toString();
    const newStatus = over.id.toString();

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", taskId);

      if (error) throw error;

      toast({
        title: "Task updated",
        description: "Task status has been updated successfully.",
      });

      onTaskUpdated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    }

    setActiveTask(null);
  };

  return {
    activeTask,
    handleDragStart,
    handleDragEnd,
  };
};
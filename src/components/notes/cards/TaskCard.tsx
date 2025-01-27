import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { TaskDetailsDrawer } from "./TaskDetailsDrawer";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CardAnimation } from "../animations/CardAnimation";
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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    date?: string | null;
    background_color?: string;
    label_id?: string;
    is_done?: boolean;
  };
  onUpdate: () => void;
  index?: number;
  onClick?: () => void;
}

export const TaskCard = ({ task, onUpdate, index = 0, onClick }: TaskCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleToggleDone = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks_notes")
        .update({ is_done: !task.is_done })
        .eq("id", task.id);

      if (error) throw error;

      toast.success("Task updated successfully");
      onUpdate(); // Refresh tasks
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("tasks_notes")
        .delete()
        .eq('id', task.id);

      if (error) throw error;

      toast.success("Task deleted successfully");
      onUpdate();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsDetailsOpen(true);
    }
  };

  return (
    <CardAnimation index={index}>
      <Card
        className="min-h-[270px] max-h-[270px] transition-all duration-200 hover:scale-[1.02] cursor-pointer overflow-hidden p-6"
        style={{ backgroundColor: task.is_done ? '#F2FCE2' : task.background_color }}
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={task.is_done}
              onCheckedChange={handleToggleDone}
              onClick={(e) => e.stopPropagation()}
              className="mt-1"
            />
            <div>
              <h3 className={`font-semibold text-xl ${
                task.is_done ? "line-through text-muted-foreground" : ""
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {task.description}
                </p>
              )}
              {task.date && (
                <p className="text-sm text-black font-semibold mt-auto">
                  {format(new Date(task.date), "MMM d")}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-white p-5 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4 " />
          </Button>
        </div>
      </Card>

      {!onClick && (
        <TaskDetailsDrawer
          open={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          task={task}
          onUpdate={onUpdate}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this task.
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
    </CardAnimation>
  );
};
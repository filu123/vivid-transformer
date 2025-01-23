import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { TaskDetailsDrawer } from "./TaskDetailsDrawer";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
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
}

export const TaskCard = ({ task, onUpdate }: TaskCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("tasks_notes")
        .delete()
        .eq('id', task.id);

      if (error) throw error;

      toast({
        title: "Task deleted",
        description: "The task has been successfully deleted.",
      });
      
      onUpdate();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the task. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div 
        className="animate-fade-in"
        style={{
          animationFillMode: 'backwards'
        }}
      >
        <Card
          className={`min-h-[270px] max-h-[270px] transition-all duration-200 hover:scale-[1.02] cursor-pointer overflow-hidden p-6 ${
            task.is_done ? 'bg-[#F2FCE2]' : ''
          }`}
          style={{ backgroundColor: task.is_done ? '#F2FCE2' : task.background_color }}
          onClick={() => setIsDetailsOpen(true)}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={task.is_done}
                onCheckedChange={() => onUpdate()}
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
                  <p className="text-sm text-muted-foreground mt-2">
                    {format(new Date(task.date), "PPp")}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      <TaskDetailsDrawer
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        task={task}
        onUpdate={onUpdate}
      />

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
    </>
  );
};
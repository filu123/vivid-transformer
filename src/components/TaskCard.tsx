import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { TaskFormModal } from "./project/TaskFormModal";
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
import { useDraggable } from "@dnd-kit/core";
import { TaskCardContent } from "./project/TaskCardContent";

interface TaskCardProps {
  id: string;
  title: string;
  note?: string;
  status?: string;
  projectId?: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  isDone?: boolean;
  variant?: string;
  onTaskUpdated?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onToggleDone?: () => void;
}

export const TaskCard = ({
  id,
  title,
  note,
  status,
  projectId,
  startTime,
  endTime,
  duration,
  isDone,
  variant,
  background_color,
  onTaskUpdated,
  onDelete,
  onEdit,
  onToggleDone,
}: TaskCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { id, title, note, status, isDone },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Task deleted",
        description: "The task has been successfully deleted.",
      });
      
      onTaskUpdated?.();
      onDelete?.();
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
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card 
          className="mb-4 cursor-move" 
          style={{ backgroundColor: background_color || undefined }}
        >
          <CardContent className="pt-6">
            <TaskCardContent
              title={title}
              note={note}
              status={status}
              startTime={startTime}
              endTime={endTime}
              duration={duration}
              variant={variant}
              onEdit={onEdit || (() => setIsEditModalOpen(true))}
              onDelete={() => setIsDeleteDialogOpen(true)}
              onToggleDone={onToggleDone}
            />
          </CardContent>
        </Card>
      </div>

      {projectId && (
        <TaskFormModal
          projectId={projectId}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          editTask={{ id, title, note, status }}
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
    </>
  );
};

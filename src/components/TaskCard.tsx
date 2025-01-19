import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface TaskCardProps {
  id: string;
  title: string;
  note?: string;
  status?: string;
  projectId?: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  variant?: string;
  isDone?: boolean;
  onTaskUpdated?: () => void;
  onToggleDone?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
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
  variant,
  isDone,
  onTaskUpdated,
  onToggleDone,
  onDelete,
  onEdit,
}: TaskCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "will do":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = async () => {
    try {
      if (onDelete) {
        onDelete();
        return;
      }

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
        <Card className="mb-4 cursor-move">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{title}</h3>
                  {status && (
                    <Badge className={getStatusColor(status)} variant="secondary">
                      {status}
                    </Badge>
                  )}
                </div>
                {note && <p className="text-sm text-gray-500">{note}</p>}
                {startTime && endTime && (
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{startTime}</span>
                    {duration && <span>{duration}</span>}
                    <span>{endTime}</span>
                  </div>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit ? onEdit() : setIsEditModalOpen(true)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
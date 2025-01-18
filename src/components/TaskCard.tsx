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

interface TaskCardProps {
  id: string;
  title: string;
  note?: string;
  status: string;
  projectId: string;
  onTaskUpdated: () => void;
}

export const TaskCard = ({
  id,
  title,
  note,
  status,
  projectId,
  onTaskUpdated,
}: TaskCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

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
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Task deleted",
        description: "The task has been successfully deleted.",
      });
      
      onTaskUpdated();
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
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{title}</h3>
                <Badge className={getStatusColor(status)} variant="secondary">
                  {status}
                </Badge>
              </div>
              {note && <p className="text-sm text-gray-500">{note}</p>}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={handleDelete}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
      <TaskFormModal
        projectId={projectId}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editTask={{ id, title, note, status }}
      />
    </>
  );
};
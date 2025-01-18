import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckSquare, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ProjectEditModal } from "./ProjectEditModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ProjectCardProps {
  id: string;
  title: string;
  status: string;
  dueDate: string;
  tasksCount: number;
  onProjectUpdated: () => void;
}

export const ProjectCard = ({
  id,
  title,
  status,
  dueDate,
  tasksCount,
  onProjectUpdated,
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking the dropdown
    if ((e.target as HTMLElement).closest('.project-dropdown')) {
      e.stopPropagation();
      return;
    }
    navigate(`/projects/${id}`);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      });
      
      onProjectUpdated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the project. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card 
        className="hover:shadow-md transition-shadow cursor-pointer relative"
        onClick={handleCardClick}
      >
        <CardHeader>
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold">{title}</h3>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(status)} variant="secondary">
                {status}
              </Badge>
              <div className="project-dropdown">
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">Due {dueDate}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <CheckSquare className="h-4 w-4 mr-2" />
              <span className="text-sm">{tasksCount} tasks</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <ProjectEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={{ id, name: title, status, dueDate }}
        onProjectUpdated={onProjectUpdated}
      />
    </>
  );
};
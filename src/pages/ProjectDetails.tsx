import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { TaskFormModal } from "@/components/project/TaskFormModal";
import { KanbanBoard } from "@/components/project/KanbanBoard";

const ProjectDetails = () => {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (projectLoading || tasksLoading) {
    return (
      <div className="w-full p-4 md:p-8">
        <div className="container mx-auto max-w-7xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded"></div>
            <div className="h-[600px] bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold truncate">{project?.name}</h1>
          <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto rounded-lg">
            <Plus className="h-5 w-5 mr-2" />
            Add Task
          </Button>
        </div>

        <KanbanBoard
          tasks={tasks || []}
          projectId={id!}
          onTaskUpdated={() => queryClient.invalidateQueries({ queryKey: ["tasks", id] })}
        />

        <TaskFormModal
          projectId={id!}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </main>
  );
};

export default ProjectDetails;
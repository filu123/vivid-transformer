import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskCard } from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { TaskFormModal } from "@/components/project/TaskFormModal";

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

  const handleToggleTaskStatus = async (taskId: string, isDone: boolean) => {
    const { error } = await supabase
      .from("tasks")
      .update({ is_done: isDone })
      .eq("id", taskId);

    if (error) throw error;
    queryClient.invalidateQueries({ queryKey: ["tasks", id] });
  };

  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) throw error;
    queryClient.invalidateQueries({ queryKey: ["tasks", id] });
  };

  if (projectLoading || tasksLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      <main className="flex-1 p-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">{project?.name}</h1>
            <Button onClick={() => setIsModalOpen(true)} className="rounded-lg">
              <Plus className="h-5 w-5 mr-2" />
              Add Task
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {tasks?.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-lg text-muted-foreground">
                  No tasks added yet. Start by adding one!
                </p>
              </div>
            ) : (
              tasks?.map((task) => (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  note={task.note}
                  variant={
                    task.status === "will do"
                      ? "yellow"
                      : task.status === "in progress"
                      ? "blue"
                      : "green"
                  }
                  isDone={task.is_done}
                  onToggleDone={() =>
                    handleToggleTaskStatus(task.id, !task.is_done)
                  }
                  onDelete={() => handleDeleteTask(task.id)}
                />
              ))
            )}
          </div>

          <TaskFormModal
            projectId={id!}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
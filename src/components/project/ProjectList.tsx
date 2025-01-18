import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProjectCard } from "./ProjectCard";
import { format } from "date-fns";

export const ProjectList = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  if (!projects?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-muted-foreground">
          No projects added yet. Start by adding one!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          title={project.name}
          status={project.status}
          dueDate={format(new Date(project.due_date), "MMM d, yyyy")}
          tasksCount={project.tasks_count || 0}
        />
      ))}
    </div>
  );
};
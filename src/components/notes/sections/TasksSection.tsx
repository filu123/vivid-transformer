import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskCard } from "../cards/TaskCard";

interface TasksSectionProps {
  selectedColor: string | null;
  onColorSelect: (color: string | null) => void;
}

export const TasksSection = ({ selectedColor, onColorSelect }: TasksSectionProps) => {
  const { data: tasks, refetch: refetchTasks } = useQuery({
    queryKey: ["tasks_notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks_notes")
        .select("*, task_labels(name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredTasks = selectedColor
    ? tasks?.filter((task) => task.background_color === selectedColor)
    : tasks;

  if (!filteredTasks?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
      {filteredTasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onUpdate={refetchTasks}
        />
      ))}
    </div>
  );
};
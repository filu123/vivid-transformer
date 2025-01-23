import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskCard } from "../cards/TaskCard";
import { format } from "date-fns";

interface DayTasksSectionProps {
  selectedDate: Date;
}

export const DayTasksSection = ({ selectedDate }: DayTasksSectionProps) => {
  const { data: tasks, refetch: refetchTasks } = useQuery({
    queryKey: ["tasks_notes", format(selectedDate, "yyyy-MM-dd")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks_notes")
        .select("*, task_labels(name)")
        .eq('date', format(selectedDate, "yyyy-MM-dd"))
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (!tasks?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          No tasks for {format(selectedDate, "MMMM d, yyyy")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onUpdate={refetchTasks}
        />
      ))}
    </div>
  );
};
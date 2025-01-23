import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskCard } from "../cards/TaskCard";
import { NoteColorFilters } from "../filters/NoteColorFilters";
import { TaskLabelFilter } from "../filters/TaskLabelFilter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TasksSectionProps {
  selectedColor: string | null;
  onColorSelect: (color: string | null) => void;
}

export const TasksSection = ({ selectedColor, onColorSelect }: TasksSectionProps) => {
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
  const [completionFilter, setCompletionFilter] = useState<"all" | "completed" | "pending">("all");

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

  const filteredTasks = tasks?.filter(task => {
    if (selectedColor && task.background_color !== selectedColor) return false;
    if (selectedLabelId && task.label_id !== selectedLabelId) return false;
    if (completionFilter === "completed" && !task.is_done) return false;
    if (completionFilter === "pending" && task.is_done) return false;
    return true;
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4 flex-1">
          <NoteColorFilters
            colors={['#ff9b74', '#fdc971', '#ebc49a', '#322a2f', '#c15626', '#ebe3d6', '#a2a8a5']}
            selectedColor={selectedColor}
            onColorSelect={onColorSelect}
            notesCount={filteredTasks?.length || 0}
            title="All tasks"
          />
          <Select value={completionFilter} onValueChange={(value: "all" | "completed" | "pending") => setCompletionFilter(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TaskLabelFilter
          selectedLabelId={selectedLabelId}
          onLabelSelect={setSelectedLabelId}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
        {filteredTasks?.map((task, index) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onUpdate={refetchTasks}
            index={index}
          />
        ))}
      </div>
    </>
  );
};
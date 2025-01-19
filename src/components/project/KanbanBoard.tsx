import { useEffect, useState } from "react";
import { TaskCard } from "@/components/TaskCard";
import { CircleDot, CheckCircle2, Circle } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { KanbanColumn } from "./KanbanColumn";

interface Task {
  id: string;
  title: string;
  note?: string;
  status: string;
  is_done?: boolean;
}

interface KanbanBoardProps {
  tasks: Task[];
  projectId: string;
  onTaskUpdated: () => void;
}

export const KanbanBoard = ({ tasks, projectId, onTaskUpdated }: KanbanBoardProps) => {
  const [willDoTasks, setWillDoTasks] = useState<Task[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { toast } = useToast();

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  
  const sensors = useSensors(mouseSensor);

  useEffect(() => {
    setWillDoTasks(tasks.filter((task) => task.status === "will do"));
    setInProgressTasks(tasks.filter((task) => task.status === "in progress"));
    setCompletedTasks(tasks.filter((task) => task.status === "completed"));
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id.toString());
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const taskId = active.id.toString();
    const newStatus = over.id.toString();

    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", taskId);

      if (error) throw error;

      toast({
        title: "Task updated",
        description: "Task status has been updated successfully.",
      });

      onTaskUpdated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    }

    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full overflow-x-auto">
        <div className="flex flex-col md:flex-row gap-6 min-w-min p-4">
          <KanbanColumn
            title="Will Do"
            tasks={willDoTasks}
            status="will do"
            icon={Circle}
            projectId={projectId}
            onTaskUpdated={onTaskUpdated}
          />
          <KanbanColumn
            title="In Progress"
            tasks={inProgressTasks}
            status="in progress"
            icon={CircleDot}
            projectId={projectId}
            onTaskUpdated={onTaskUpdated}
          />
          <KanbanColumn
            title="Completed"
            tasks={completedTasks}
            status="completed"
            icon={CheckCircle2}
            projectId={projectId}
            onTaskUpdated={onTaskUpdated}
          />
        </div>
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="w-[300px]">
            <TaskCard
              id={activeTask.id}
              title={activeTask.title}
              note={activeTask.note}
              status={activeTask.status}
              isDone={activeTask.is_done}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
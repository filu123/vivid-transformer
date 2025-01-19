import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  UniqueIdentifier,
} from "@dnd-kit/core";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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

  const renderColumn = (title: string, columnTasks: Task[], status: string, icon: React.ReactNode) => (
    <div className="flex flex-col gap-4 min-w-[300px] w-full md:w-1/3">
      <div className="flex items-center gap-2 font-semibold text-lg">
        {icon}
        <h3>{title}</h3>
        <span className="text-sm text-muted-foreground">({columnTasks.length})</span>
      </div>
      <Card 
        className="bg-muted/50 p-4 h-full"
        id={status}
      >
        <CardContent className="p-0 space-y-4">
          {columnTasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No tasks</p>
          ) : (
            columnTasks.map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                projectId={projectId}
                title={task.title}
                note={task.note}
                status={task.status}
                isDone={task.is_done}
                onTaskUpdated={onTaskUpdated}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full overflow-x-auto">
        <div className="flex flex-col md:flex-row gap-6 min-w-min p-4">
          {renderColumn(
            "Will Do",
            willDoTasks,
            "will do",
            <Circle className="w-5 h-5 text-yellow-500" />
          )}
          {renderColumn(
            "In Progress",
            inProgressTasks,
            "in progress",
            <CircleDot className="w-5 h-5 text-blue-500" />
          )}
          {renderColumn(
            "Completed",
            completedTasks,
            "completed",
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          )}
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
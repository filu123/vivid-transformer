import { DndContext, DragOverlay, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { CircleDot, CheckCircle2, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { DragOverlayCard } from "./DragOverlayCard";
import { useKanbanDragDrop } from "@/hooks/useKanbanDragDrop";

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

  const { activeTask, handleDragStart, handleDragEnd } = useKanbanDragDrop(onTaskUpdated);

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
        <DragOverlayCard activeTask={activeTask} />
      </DragOverlay>
    </DndContext>
  );
};
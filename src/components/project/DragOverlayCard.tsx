import { TaskCard } from "@/components/TaskCard";

interface Task {
  id: string;
  title: string;
  note?: string;
  status: string;
  is_done?: boolean;
}

interface DragOverlayCardProps {
  activeTask: Task | null;
}

export const DragOverlayCard = ({ activeTask }: DragOverlayCardProps) => {
  if (!activeTask) return null;

  return (
    <div className="w-[300px]">
      <TaskCard
        id={activeTask.id}
        title={activeTask.title}
        note={activeTask.note}
        status={activeTask.status}
        isDone={activeTask.is_done}
      />
    </div>
  );
};
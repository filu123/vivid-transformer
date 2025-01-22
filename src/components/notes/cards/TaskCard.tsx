import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { TaskDetailsDrawer } from "./TaskDetailsDrawer";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    date?: string | null;
    background_color?: string;
    label_id?: string;
  };
  onUpdate: () => void;
}

export const TaskCard = ({ task, onUpdate }: TaskCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <>
      <Card
        className="min-h-[270px] max-h-[270px] transition-all duration-200 hover:scale-[1.02] cursor-pointer overflow-hidden p-6"
        style={{ backgroundColor: task.background_color }}
        onClick={() => setIsDetailsOpen(true)}
      >
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-xl line-clamp-2">{task.title}</h3>
          </div>
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-4">
              {task.description}
            </p>
          )}
          {task.date && (
            <p className="text-sm text-muted-foreground mt-auto">
              {format(new Date(task.date), "MMM d, yyyy")}
            </p>
          )}
        </div>
      </Card>

      <TaskDetailsDrawer
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        task={task}
        onUpdate={onUpdate}
      />
    </>
  );
};
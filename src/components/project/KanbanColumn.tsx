import { Card, CardContent } from "@/components/ui/card";
import { TaskCard } from "@/components/TaskCard";
import { LucideIcon } from "lucide-react";

interface Task {
  id: string;
  title: string;
  note?: string;
  status: string;
  is_done?: boolean;
}

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  status: string;
  icon: LucideIcon;
  projectId: string;
  onTaskUpdated: () => void;
}

export const KanbanColumn = ({
  title,
  tasks,
  status,
  icon: Icon,
  projectId,
  onTaskUpdated,
}: KanbanColumnProps) => {
  const iconColor = {
    "will do": "text-yellow-500",
    "in progress": "text-blue-500",
    completed: "text-green-500",
  }[status] || "text-gray-500";

  return (
    <div className="flex-1 min-w-[300px] max-w-md mx-auto md:mx-0">
      <div className="flex items-center gap-2 font-semibold text-lg mb-4">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h3>{title}</h3>
        <span className="text-sm text-muted-foreground">({tasks.length})</span>
      </div>
      <Card 
        className="bg-muted/50 p-4 min-h-[500px]"
        id={status}
      >
        <CardContent className="p-0 space-y-4">
          {tasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No tasks</p>
          ) : (
            tasks.map((task) => (
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
};
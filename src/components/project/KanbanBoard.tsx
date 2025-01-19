import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TaskCard } from "@/components/TaskCard";
import { CircleDot, CheckCircle2, Circle } from "lucide-react";

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

  useEffect(() => {
    setWillDoTasks(tasks.filter((task) => task.status === "will do"));
    setInProgressTasks(tasks.filter((task) => task.status === "in progress"));
    setCompletedTasks(tasks.filter((task) => task.status === "completed"));
  }, [tasks]);

  const renderColumn = (title: string, tasks: Task[], icon: React.ReactNode) => (
    <div className="flex flex-col gap-4 min-w-[300px] w-full md:w-1/3">
      <div className="flex items-center gap-2 font-semibold text-lg">
        {icon}
        <h3>{title}</h3>
        <span className="text-sm text-muted-foreground">({tasks.length})</span>
      </div>
      <Card className="bg-muted/50 p-4 h-full">
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

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-col md:flex-row gap-6 min-w-min p-4">
        {renderColumn("Will Do", willDoTasks, <Circle className="w-5 h-5 text-yellow-500" />)}
        {renderColumn("In Progress", inProgressTasks, <CircleDot className="w-5 h-5 text-blue-500" />)}
        {renderColumn("Completed", completedTasks, <CheckCircle2 className="w-5 h-5 text-green-500" />)}
      </div>
    </div>
  );
};
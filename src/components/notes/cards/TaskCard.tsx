import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    date?: string | null;
    background_color?: string;
    status?: string;
    label_id?: string;
  };
}

export const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <Card
      className="min-h-[270px] max-h-[270px] transition-all duration-200 hover:scale-[1.02] cursor-pointer overflow-hidden p-6"
      style={{ backgroundColor: task.background_color }}
    >
      <div className="space-y-4 flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-xl line-clamp-2">{task.title}</h3>
          {task.status && (
            <Badge variant="secondary" className="capitalize">
              {task.status}
            </Badge>
          )}
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
  );
};
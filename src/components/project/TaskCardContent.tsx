import { cn } from "@/lib/utils";
import { TaskActions } from "./TaskActions";

interface TaskCardContentProps {
  title: string;
  note?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  variant?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleDone?: () => void;
}

export const TaskCardContent = ({
  title,
  note,
  status,
  startTime,
  endTime,
  duration,
  variant,
  onEdit,
  onDelete,
  onToggleDone,
}: TaskCardContentProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className={cn("font-semibold", {
            "text-yellow-600": variant === "yellow",
            "text-blue-600": variant === "blue",
            "text-purple-600": variant === "purple",
            "text-green-600": variant === "green",
          })}>{title}</h3>
          {note && <p className="text-sm text-gray-500">{note}</p>}
          {status && <p className="text-sm text-gray-500">Status: {status}</p>}
          {startTime && <p className="text-sm text-gray-500">Starts: {startTime}</p>}
          {endTime && <p className="text-sm text-gray-500">Ends: {endTime}</p>}
          {duration && <p className="text-sm text-gray-500">Duration: {duration}</p>}
        </div>
        <TaskActions
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleDone={onToggleDone}
        />
      </div>
    </div>
  );
};
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { MoreVertical } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-4 flex-1">
        {onToggleDone && (
          <Checkbox
            checked={status === "done"}
            onCheckedChange={onToggleDone}
            className="mt-1"
          />
        )}
        <div className="space-y-1">
          <p className={status === "done" ? "line-through text-muted-foreground" : ""}>
            {title}
          </p>
          {note && (
            <p className="text-sm text-muted-foreground">{note}</p>
          )}
          {(startTime || endTime || duration) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                {startTime && endTime
                  ? `${startTime} - ${endTime}`
                  : duration}
              </span>
            </div>
          )}
        </div>
      </div>

      {(onEdit || onDelete) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
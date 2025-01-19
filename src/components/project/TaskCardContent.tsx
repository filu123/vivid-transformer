import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
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
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskCardContent = ({
  title,
  note,
  status,
  startTime,
  endTime,
  duration,
  onEdit,
  onDelete,
}: TaskCardContentProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "will do":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{title}</h3>
          {status && (
            <Badge className={getStatusColor(status)} variant="secondary">
              {status}
            </Badge>
          )}
        </div>
        {note && <p className="text-sm text-gray-500">{note}</p>}
        {startTime && endTime && (
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{startTime}</span>
            {duration && <span>{duration}</span>}
            <span>{endTime}</span>
          </div>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-red-600"
            onClick={onDelete}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
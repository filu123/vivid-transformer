import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface TaskActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleDone?: () => void;
}

export const TaskActions = ({ onEdit, onDelete, onToggleDone }: TaskActionsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      {onToggleDone && (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onToggleDone();
          }}
          className="w-full"
        >
          Toggle Done
        </Button>
      )}
    </div>
  );
};
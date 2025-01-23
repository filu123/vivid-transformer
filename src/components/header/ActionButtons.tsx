import { Calendar, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActionButtonsProps {
  onNoteClick: () => void;
  onHabitClick: () => void;
  onTaskClick: () => void;
  onReminderClick: () => void;
}

export const ActionButtons = ({
  onNoteClick,
  onHabitClick,
  onTaskClick,
  onReminderClick,
}: ActionButtonsProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Button variant="ghost" size="icon" className="hidden md:inline-flex">
        <RefreshCw className="h-5 w-5" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => navigate("/calendar")}
      >
        <Calendar className="h-5 w-5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onNoteClick}>
            Notes
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onHabitClick}>
            Habits
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onTaskClick}>
            Tasks
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onReminderClick}>
            Reminders
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
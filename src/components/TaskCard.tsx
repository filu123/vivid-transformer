import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface TaskCardProps {
  id: string;
  title: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  variant: "yellow" | "blue" | "purple" | "green";
  note?: string;
  isDone?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleDone?: () => void;
  participants?: Array<{
    name: string;
    avatar: string;
  }>;
}

export const TaskCard = ({
  title,
  startTime,
  endTime,
  duration,
  variant,
  note,
  isDone,
  onEdit,
  onDelete,
  onToggleDone,
  participants,
}: TaskCardProps) => {
  return (
    <div
      className={cn(
        `p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow`,
        {
          "bg-emerald-100": isDone,
          [`bg-card-${variant}`]: !isDone,
        }
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full"
            onClick={onToggleDone}
          >
            <Check
              className={cn("h-4 w-4", {
                "text-emerald-600": isDone,
                "text-gray-400": !isDone,
              })}
            />
          </Button>
          <h3
            className={cn("text-xl font-semibold", {
              "line-through": isDone,
            })}
          >
            {title}
          </h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {note && (
        <p className="text-sm text-gray-600 mb-4">{note}</p>
      )}
      <div className="flex justify-between items-center">
        {startTime && endTime ? (
          <>
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-600">Start</div>
              <div className="text-lg">{startTime}</div>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-black/10 text-sm font-medium">
              {duration}
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-600">End</div>
              <div className="text-lg">{endTime}</div>
            </div>
          </>
        ) : (
          <div className="w-full text-gray-600">Note</div>
        )}
      </div>
      {participants && (
        <div className="flex -space-x-2 mt-4">
          {participants.map((participant, index) => (
            <Avatar key={index} className="w-8 h-8 border-2 border-white">
              <AvatarImage src={participant.avatar} alt={participant.name} />
              <AvatarFallback>{participant.name[0]}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      )}
    </div>
  );
};
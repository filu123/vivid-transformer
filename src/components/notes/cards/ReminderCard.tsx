import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface ReminderCardProps {
  reminder: {
    id: string;
    title: string;
    due_date?: string | null;
    is_completed: boolean;
    category: string;
  };
}

export const ReminderCard = ({ reminder }: ReminderCardProps) => {
  return (
    <Card className="min-h-[270px] max-h-[270px] transition-all duration-200 hover:scale-[1.02] cursor-pointer overflow-hidden p-6">
      <div className="space-y-4 flex-1">
        <div className="flex justify-between items-start">
          <h3 className={`font-semibold text-xl line-clamp-2 ${
            reminder.is_completed ? "line-through text-muted-foreground" : ""
          }`}>
            {reminder.title}
          </h3>
          <Badge variant="outline" className="capitalize">
            {reminder.category}
          </Badge>
        </div>
        {reminder.due_date && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{format(new Date(reminder.due_date), "PPp")}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
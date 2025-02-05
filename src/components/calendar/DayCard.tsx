
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DayCardProps {
  date: Date;
  habits: any[];
  onHabitUpdated: () => void;
  cardColor: string;
  hasEvents?: boolean;
  tasks?: Array<{
    id: string;
    title: string;
    is_done?: boolean;
    frequency?: "daily" | "three_times" | "custom" | null;
    first_occurrence_date?: string;
  }>;
}

export const DayCard = ({ date, cardColor, hasEvents, tasks = [] }: DayCardProps) => {
  const hasRecurringTasks = tasks && tasks.length > 0;

  return (
    <Card
      className={cn(
        "p-6 hover:shadow-md transition-shadow cursor-pointer relative group min-h-[200px]",
        `bg-${cardColor}`
      )}
    >
      <div className="flex flex-col">
        <span className="text-sm font-medium text-muted-foreground">
          {format(date, "EEEE")}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{format(date, "d")}</span>
          <span className="text-xl font-semibold text-muted-foreground">
            {format(date, "MMM")}
          </span>
        </div>
      </div>
      
      {hasRecurringTasks && (
        <div className="mt-4 space-y-2">
          {tasks.map((task) => (
            <div 
              key={task.id}
              className={cn(
                "text-sm truncate",
                task.is_done ? "line-through text-muted-foreground" : ""
              )}
            >
              {task.title}
              {task.frequency && (
                <span className="ml-2 text-xs text-muted-foreground">
                  {task.frequency === 'daily' ? '🔄' : 
                   task.frequency === 'three_times' ? '3️⃣' : 
                   task.frequency === 'custom' ? '📅' : ''}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {hasEvents && (
        <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-primary animate-pulse" />
      )}
    </Card>
  );
};

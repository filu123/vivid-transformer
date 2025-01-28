import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DayCardProps {
  date: Date;
  habits: any[];
  onHabitUpdated: () => void;
  cardColor: string;
  hasEvents?: boolean;
}

export const DayCard = ({ date, cardColor, hasEvents }: DayCardProps) => {
  return (
    <Card
      className={cn(
        "p-6 hover:shadow-md transition-shadow cursor-pointer relative group",
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
      {hasEvents && (
        <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-primary animate-pulse" />
      )}
    </Card>
  );
};
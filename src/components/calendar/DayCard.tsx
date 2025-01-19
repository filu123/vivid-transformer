import { format } from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DayHabits } from "./DayHabits";

interface DayCardProps {
  date: Date;
  habits: any[];
  onHabitUpdated: () => void;
  cardColor: string;
}

export const DayCard = ({ date, habits, onHabitUpdated, cardColor }: DayCardProps) => {
  return (
    <Card
      className={`p-6 bg-${cardColor} hover:shadow-md transition-shadow cursor-pointer relative group`}
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
      <Button
        size="icon"
        variant="ghost"
        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Plus className="h-5 w-5" />
      </Button>
      <DayHabits 
        habits={habits}
        onHabitUpdated={onHabitUpdated}
        date={date}
      />
    </Card>
  );
};
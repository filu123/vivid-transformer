import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, subMonths, addMonths } from "date-fns";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarHeader = ({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
}: CalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPreviousMonth}
        className="rounded-lg"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground">
          {format(subMonths(currentMonth, 1), "MMM")}
        </span>
        <span className="text-xl font-semibold">
          {format(currentMonth, "MMM")}
        </span>
        <span className="text-muted-foreground">
          {format(addMonths(currentMonth, 1), "MMM")}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onNextMonth}
        className="rounded-lg"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
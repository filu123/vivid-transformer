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
    <div className="flex items-center justify-between mb-6 bg-[#FFF7EA] rounded-2xl p-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPreviousMonth}
        className="rounded-lg bg-white rounded-full"
      >
        <ChevronLeft className="  h-5 w-5" />
      </Button>
      <div className="flex items-center gap-4">
        
        <span className="text-xl font-semibold">
          {format(currentMonth, "MMMM YYY")}
        </span>
    
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onNextMonth}
        className="rounded-lg bg-white rounded-full"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
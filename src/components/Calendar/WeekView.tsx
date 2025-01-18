import { useState } from "react";
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth, addDays, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const WeekView = ({ onDaySelect, selectedDate }: { onDaySelect: (date: Date) => void; selectedDate: Date }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const getDaysInCurrentMonth = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const startDate = startOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < daysInMonth; i++) {
      days.push(addDays(startDate, i));
    }

    return days;
  };

  const getCardColor = (dayNum: number) => {
    const colors = ["card.purple", "card.blue", "card.green", "card.yellow"];
    return colors[dayNum % colors.length];
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={previousMonth} className="rounded-lg">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-sm">
            {format(subMonths(currentDate, 1), "MMM")}
          </span>
          <span className="text-lg font-semibold">
            {format(currentDate, "MMM")}
          </span>
          <span className="text-muted-foreground text-sm">
            {format(addMonths(currentDate, 1), "MMM")}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-lg">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {getDaysInCurrentMonth().map((date, index) => (
          <Card
            key={date.toString()}
            className={`p-2 ${
              isSameDay(date, selectedDate)
                ? "ring-2 ring-primary"
                : ""
            } bg-${getCardColor(index)} hover:shadow-md transition-shadow cursor-pointer relative group`}
            onClick={() => onDaySelect(date)}
          >
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium text-muted-foreground">
                {format(date, "EEE")}
              </span>
              <span className="text-lg font-bold">{format(date, "d")}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
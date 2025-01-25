import { Card } from "@/components/ui/card";
import { addMonths, subMonths } from "date-fns";
import { CalendarGrid } from "../calendar/CalendarGrid";
import { CalendarHeader } from "../calendar/CalendarHeader";

interface PlannerCalendarProps {
  currentMonth: Date;
  selectedDate: Date;
  onDateClick: (date: Date) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const PlannerCalendar = ({
  currentMonth,
  selectedDate,
  onDateClick,
  onPreviousMonth,
  onNextMonth,
}: PlannerCalendarProps) => {
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  return (
    <Card className="p-4 md:p-6 bg-white shadow-sm min-w-[410px] min-h-[410px] max-w-[410px] max-h-[410px]">
      <CalendarHeader
        currentMonth={currentMonth}
        onPreviousMonth={onPreviousMonth}
        onNextMonth={onNextMonth}
      />
      <CalendarGrid
        days={getDaysInMonth()}
        selectedDate={selectedDate}
        onDateClick={onDateClick}
      />
    </Card>
  );
};
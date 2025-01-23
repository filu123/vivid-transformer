import { Card } from "@/components/ui/card";
import { CalendarHeader } from "../calendar/CalendarHeader";
import { CalendarGrid } from "../calendar/CalendarGrid";
import { addMonths, subMonths } from "date-fns";

interface PlannerCalendarProps {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const PlannerCalendar = ({
  currentMonth,
  setCurrentMonth,
  selectedDate,
  setSelectedDate,
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
    <Card className="p-4 md:p-6 bg-white shadow-sm">
      <CalendarHeader
        currentMonth={currentMonth}
        onPreviousMonth={() => setCurrentMonth(subMonths(currentMonth, 1))}
        onNextMonth={() => setCurrentMonth(addMonths(currentMonth, 1))}
      />
      <CalendarGrid
        days={getDaysInMonth()}
        selectedDate={selectedDate}
        onDateClick={setSelectedDate}
      />
    </Card>
  );
};
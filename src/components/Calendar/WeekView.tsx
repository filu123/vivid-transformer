import { useState } from "react";
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth, addDays } from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DayHabits } from "../calendar/DayHabits";

interface Habit {
  id: string;
  user_id: string;
  title: string;
  frequency: "daily" | "three_times" | "custom";
  custom_days: number[] | null;
  duration_months: number;
  start_date: string;
  created_at: string;
  habit_completions: {
    completed_date: string;
  }[];
}

interface WeekViewProps {
  habits: Habit[];
}

export const WeekView = ({ habits }: WeekViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  const handleHabitUpdated = () => {
    // Refresh habits data if needed
  };

  return (
    <div className="w-full space-y-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={previousMonth}
          className="rounded-lg"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            {format(subMonths(currentDate, 1), "MMM")}
          </span>
          <span className="text-2xl font-semibold">
            {format(currentDate, "MMM")}
          </span>
          <span className="text-muted-foreground">
            {format(addMonths(currentDate, 1), "MMM")}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          className="rounded-lg"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {getDaysInCurrentMonth().map((date, index) => (
          <Card
            key={date.toString()}
            className={`p-6 bg-${getCardColor(index)} hover:shadow-md transition-shadow cursor-pointer relative group`}
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
              onHabitUpdated={handleHabitUpdated}
              date={date}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};
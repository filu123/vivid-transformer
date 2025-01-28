import { useState } from "react";
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth, addDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DayCard } from "../calendar/DayCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface WeekViewProps {
  habits: Habit[];
}

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

export const WeekView = ({ habits }: WeekViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const { data: dailyEvents } = useQuery({
    queryKey: ['dailyEvents', format(currentDate, 'yyyy-MM')],
    queryFn: async () => {
      const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const endDate = format(addMonths(startOfMonth(currentDate), 1), 'yyyy-MM-dd');
      
      const [notesResponse, remindersResponse, tasksResponse] = await Promise.all([
        supabase
          .from('notes')
          .select('date')
          .gte('date', startDate)
          .lt('date', endDate),
        supabase
          .from('reminders')
          .select('due_date')
          .gte('due_date', startDate)
          .lt('due_date', endDate),
        supabase
          .from('tasks_notes')
          .select('date')
          .gte('date', startDate)
          .lt('date', endDate)
      ]);

      const events = new Set();
      
      notesResponse.data?.forEach(note => note.date && events.add(note.date));
      remindersResponse.data?.forEach(reminder => reminder.due_date && events.add(format(new Date(reminder.due_date), 'yyyy-MM-dd')));
      tasksResponse.data?.forEach(task => task.date && events.add(task.date));
      
      return Array.from(events) as string[];
    }
  });

  const getDaysInCurrentMonth = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const startDate = startOfMonth(currentDate);
    return Array.from({ length: daysInMonth }, (_, i) => addDays(startDate, i));
  };

  const getCardColor = (dayNum: number) => {
    const colors = ["card.purple", "card.blue", "card.green", "card.yellow"];
    return colors[dayNum % colors.length];
  };

  const hasEventsOnDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return dailyEvents?.includes(dateStr);
  };

  return (
    <div className="w-full space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {getDaysInCurrentMonth().map((date, index) => (
          <DayCard
            key={date.toString()}
            date={date}
            habits={habits}
            onHabitUpdated={() => {}}
            cardColor={getCardColor(index)}
            hasEvents={hasEventsOnDate(date)}
          />
        ))}
      </div>
    </div>
  );
};
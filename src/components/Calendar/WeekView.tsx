
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
  habit_completions: {
    completed_date: string;
  }[];
}

export const WeekView = ({ habits }: WeekViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const { data: dailyData } = useQuery({
    queryKey: ['monthlyData', format(currentDate, 'yyyy-MM')],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const dates = getDaysInCurrentMonth().map(date => 
        supabase.rpc('get_daily_data', {
          p_user_id: user.id,
          p_date: format(date, 'yyyy-MM-dd')
        })
      );

      const results = await Promise.all(dates);
      return results.map((result, index) => ({
        date: getDaysInCurrentMonth()[index],
        data: result.data
      }));
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
    const dayData = dailyData?.find(d => format(d.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
    return dayData?.data?.notes?.length > 0 || 
           dayData?.data?.reminders?.length > 0 || 
           dayData?.data?.priorities?.length > 0;
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
        {getDaysInCurrentMonth().map((date, index) => {
          const dayData = dailyData?.find(d => 
            format(d.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
          );

          return (
            <DayCard
              key={date.toString()}
              date={date}
              habits={habits}
              onHabitUpdated={() => {}}
              cardColor={getCardColor(index)}
              hasEvents={hasEventsOnDate(date)}
              tasks={dayData?.data?.tasks || []}
            />
          );
        })}
      </div>
    </div>
  );
};

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DayItems } from "./DayItems";
import { PlannerCalendar } from "./planner/PlannerCalendar";
import { PlannerDailyTabs } from "./planner/PlannerDailyTabs";
import { useDailyData } from "@/hooks/useDailyData";
import { toast } from "@/hooks/use-toast";
import { DayItem } from "@/integrations/supabase/timeboxTypes";

export const TimeboxPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isChangingDate, setIsChangingDate] = useState(false);

  // Fetch user session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/auth';
        return null;
      }
      return session;
    },
  });

  // Fetch daily data using custom hook
  const { data: dailyData, isLoading } = useDailyData(selectedDate, session?.user?.id);

  // Format priorities data
  const priorities: DayItem[] = dailyData?.priorities?.map((priority) => ({
    id: priority.id,
    title: priority.title,
    type: "task" as const,
    startTime: priority.start_time || undefined,
    endTime: priority.end_time || undefined,
    duration: priority.start_time && priority.end_time ? "1h" : undefined,
    note: priority.note || undefined,
    isDone: priority.is_done || false,
  })) || [];

  // Handle priority toggle
  const handleTogglePriorityDone = async (id: string, newIsDone: boolean) => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from("priorities")
        .update({ is_done: newIsDone })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: newIsDone ? "Priority completed" : "Priority unmarked",
        description: newIsDone
          ? "Priority has been marked as complete."
          : "Priority has been unmarked.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the priority. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Planner</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div className={`transition-all duration-300 ${isChangingDate ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'}`}>
            <div className=" ">
              <DayItems
                date={selectedDate}
                items={priorities}
                onItemsChange={() => {}}
                onToggleDone={handleTogglePriorityDone}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <PlannerCalendar
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onDateClick={setSelectedDate}
            onPreviousMonth={() => setCurrentMonth((prev) => new Date(prev.setMonth(prev.getMonth() - 1)))}
            onNextMonth={() => setCurrentMonth((prev) => new Date(prev.setMonth(prev.getMonth() + 1)))}
          />
        </div>
      </div>
      
      <div className={`transition-all md:max-w-[58%] duration-300 ${isLoading ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <PlannerDailyTabs
          selectedDate={selectedDate}
          dailyData={dailyData}
          onTaskUpdate={() => {}}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
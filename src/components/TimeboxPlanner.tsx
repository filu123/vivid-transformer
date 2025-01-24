import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { format, addMonths, subMonths, startOfDay, endOfDay } from "date-fns";
import { DayItems } from "./DayItems";
import { supabase } from "@/integrations/supabase/client";
import { DayNotes } from "./calendar/DayNotes";
import { DayReminders } from "./calendar/DayReminders";
import { CalendarGrid } from "./calendar/CalendarGrid";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { DayHabits } from "./calendar/DayHabits";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskCard } from "./notes/cards/TaskCard";
import { useQuery } from "@tanstack/react-query";
import { DailyData, DayItem } from "@/integrations/supabase/timeboxTypes";

export interface GetDailyDataParams {
  p_user_id: string;
  p_date: string;
}

export interface Priority {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  note?: string;
  is_done: boolean;
}

// Define other interfaces based on your RPC response
export interface GetDailyDataResult {
  priorities: Priority[];
  
}

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

  // Fetch daily data using RPC
  const { data: dailyData, isLoading } = useQuery<DailyData>({
    queryKey: ['dailyData', selectedDate, session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .rpc('get_daily_data', {
          p_user_id: session.user.id,
          p_date: format(selectedDate, "yyyy-MM-dd")
        });

      if (error) throw error;
      return data as unknown as DailyData;
    },
    enabled: !!session?.user?.id,
  });

  // Format priorities data
  const priorities: DayItem[] = dailyData?.priorities?.map((priority) => ({
    id: priority.id,
    title: priority.title,
    type: "task" as const,
    startTime: priority.start_time ? format(new Date(`2000-01-01T${priority.start_time}`), "h:mm a") : undefined,
    endTime: priority.end_time ? format(new Date(`2000-01-01T${priority.end_time}`), "h:mm a") : undefined,
    duration: priority.start_time && priority.end_time ? "1h" : undefined,
    note: priority.note || undefined,
    isDone: priority.is_done || false,
  })) || [];

  // Handle priority toggle
  const handleTogglePriorityDone = (id: string, newIsDone: boolean) => {
    const priority = priorities.find(p => p.id === id);
    if (priority) {
      priority.isDone = newIsDone;
    }
  };

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
        {/* Left side - 70% */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div className={`transition-all duration-300 ${isChangingDate ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'}`}>
            <div className=" ">
              <DayItems
                date={selectedDate}
                items={priorities}
                onItemsChange={() => {}} // Refetch will happen automatically through React Query
                onToggleDone={handleTogglePriorityDone}
              />
            </div>
          </div>

          <div className={`transition-all md:max-w-[70%] duration-300 ${isLoading ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'}`}>
          <div className="mt-8">
          <h2 className="text-xl md:text-xl font-semibold mb-4 mt-10 animate-fade-in">
                {format(selectedDate, "MMMM d, yyyy")}
              </h2>
              <Tabs defaultValue="tasks" className="w-full">
              <TabsList className="mb-4 gap-6 bg-transparent">
              <TabsTrigger className="p-0" value="tasks">Tasks</TabsTrigger>
              <TabsTrigger className="p-0" value="habits">Habits</TabsTrigger>
              <TabsTrigger className="p-0" value="notes">Notes</TabsTrigger>
              <TabsTrigger className="p-0" value="reminders">Reminders</TabsTrigger>
            </TabsList>
                <TabsContent value="tasks">
                  <div className="space-y-4 grid grid-cols-3">
                    {dailyData?.tasks?.length > 0 ? (
                      dailyData.tasks.map((task, index) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onUpdate={() => {}} // Refetch will happen automatically through React Query
                          index={index}
                        />
                      ))
                    ) : (
                      <div className="mt-8 text-center text-gray-500">
                        No tasks for today
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="habits">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <DayHabits habits={dailyData?.habits || []} onHabitUpdated={() => {}} date={selectedDate} />
                  </div>
                </TabsContent>
                <TabsContent value="notes">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <DayNotes notes={dailyData?.notes || []} />
                  </div>
                </TabsContent>
                <TabsContent value="reminders">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <DayReminders reminders={dailyData?.reminders || []} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Right side - 30% */}
        <div className="lg:col-span-5">
        <Card className="p-4 md:p-6 bg-white shadow-sm min-w-[410px] min-h-[410px] max-w-[410px] max-h-[410px]">
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
        </div>
      </div>
    </div>
  );
};
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

export const TimeboxPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [priorities, setPriorities] = useState([]);
  const [notes, setNotes] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingDate, setIsChangingDate] = useState(false);

  const fetchPriorities = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("priorities")
        .select("*")
        .eq("date", format(selectedDate, "yyyy-MM-dd"));

      if (error) throw error;

      const formattedPriorities = data.map((priority) => ({
        id: priority.id,
        title: priority.title,
        type: "task",
        startTime: priority.start_time ? format(new Date(`2000-01-01T${priority.start_time}`), "h:mm a") : undefined,
        endTime: priority.end_time ? format(new Date(`2000-01-01T${priority.end_time}`), "h:mm a") : undefined,
        duration: priority.start_time && priority.end_time ? "1h" : undefined,
        note: priority.note,
        isDone: priority.is_done,
      }));

      setPriorities(formattedPriorities);
    } catch (error) {
      console.error("Error fetching priorities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("date", format(selectedDate, "yyyy-MM-dd"));

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const fetchReminders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get start and end of selected date
      const start = startOfDay(selectedDate);
      const end = endOfDay(selectedDate);

      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .gte("due_date", start.toISOString())
        .lte("due_date", end.toISOString());

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  const fetchHabits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("habits")
        .select("*, habit_completions(completed_date)")
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedHabits = data.map(habit => ({
        ...habit,
        isCompleted: habit.habit_completions?.some(
          completion => completion.completed_date === format(selectedDate, 'yyyy-MM-dd')
        )
      }));

      setHabits(formattedHabits);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/auth';
        return;
      }
    };
    
    const loadData = async () => {
      setIsChangingDate(true);
      await Promise.all([
        fetchPriorities(),
        fetchNotes(),
        fetchReminders(),
        fetchHabits()
      ]);
      setIsChangingDate(false);
    };

    checkSession();
    loadData();
  }, [selectedDate]);

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
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left side - 70% */}
        <div className="lg:col-span-8 space-y-6">
          <div className={`transition-all duration-300 ${isChangingDate ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'}`}>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <DayItems
                date={selectedDate}
                items={priorities}
                onItemsChange={fetchPriorities}
              />
            </div>
          </div>

          <div className={`transition-all duration-300 ${isChangingDate ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'}`}>
            <div className="mt-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-6 animate-fade-in">
                {format(selectedDate, "MMMM d, yyyy")}
              </h2>
              <Tabs defaultValue="tasks" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="habits">Habits</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="reminders">Reminders</TabsTrigger>
                </TabsList>
                <TabsContent value="tasks">
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <DayItems
                        date={selectedDate}
                        items={priorities}
                        onItemsChange={fetchPriorities}
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="habits">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <DayHabits habits={habits} onHabitUpdated={fetchHabits} date={selectedDate} />
                  </div>
                </TabsContent>
                <TabsContent value="notes">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <DayNotes notes={notes} />
                  </div>
                </TabsContent>
                <TabsContent value="reminders">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <DayReminders reminders={reminders} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Right side - 30% */}
        <div className="lg:col-span-4">
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
        </div>
      </div>
    </div>
  );
};
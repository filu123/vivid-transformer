import { useState, useEffect } from "react";
import { format, startOfDay, endOfDay } from "date-fns";
import { DayItems } from "./DayItems";
import { supabase } from "@/integrations/supabase/client";
import { PlannerCalendar } from "./planner/PlannerCalendar";
import { PlannerTabs } from "./planner/PlannerTabs";
import { PlannerSkeleton } from "./planner/PlannerSkeleton";

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

  if (isLoading) {
    return <PlannerSkeleton />;
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
              <PlannerTabs
                habits={habits}
                notes={notes}
                reminders={reminders}
                selectedDate={selectedDate}
                onHabitUpdated={fetchHabits}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <PlannerCalendar
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
      </div>
    </div>
  );
};
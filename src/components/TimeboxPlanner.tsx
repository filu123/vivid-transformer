import { useState } from "react";
import { Button } from "./ui/button";
import { DateDisplay } from "./DateDisplay";
import { PlannerTabs } from "./PlannerTabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { DayTasksSection } from "./notes/sections/DayTasksSection";

const TimeboxPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: habits, refetch: fetchHabits } = useQuery({
    queryKey: ["habits", format(selectedDate, "yyyy-MM-dd")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("date", format(selectedDate, "yyyy-MM-dd"))
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: notes } = useQuery({
    queryKey: ["notes", format(selectedDate, "yyyy-MM-dd")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("date", format(selectedDate, "yyyy-MM-dd"))
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: reminders } = useQuery({
    queryKey: ["reminders", format(selectedDate, "yyyy-MM-dd")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("date", format(selectedDate, "yyyy-MM-dd"))
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <DateDisplay date={selectedDate} onDateChange={setSelectedDate} />
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedDate(new Date())}>
            Today
          </Button>
        </div>
      </div>

      <PlannerTabs
        habits={habits}
        notes={notes}
        reminders={reminders}
        selectedDate={selectedDate}
        onHabitUpdated={fetchHabits}
      />

      <DayTasksSection selectedDate={selectedDate} />
    </div>
  );
};

export default TimeboxPlanner;
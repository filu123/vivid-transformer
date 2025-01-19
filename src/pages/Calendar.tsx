import { WeekView } from "@/components/Calendar/WeekView";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const Calendar = () => {
  const { data: habits } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("*, habit_completions(completed_date)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="w-full p-4 md:p-8">
      <div className="container mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Calendar</h1>
        <WeekView habits={habits || []} />
      </div>
    </div>
  );
};

export default Calendar;
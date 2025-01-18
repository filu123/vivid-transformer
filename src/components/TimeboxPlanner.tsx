import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { format, addMonths, subMonths } from "date-fns";
import { DayItems } from "./DayItems";
import { supabase } from "@/integrations/supabase/client";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { CalendarGrid } from "./calendar/CalendarGrid";

export const TimeboxPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [priorities, setPriorities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPriorities = async () => {
    try {
      setIsLoading(true);
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

  useEffect(() => {
    fetchPriorities();
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
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7">
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {format(selectedDate, "MMMM d, yyyy")}
              </h2>
            </div>
          </Card>
          <div className="space-y-4">
            <DayItems
              date={selectedDate}
              items={priorities}
              onItemsChange={fetchPriorities}
            />
          </div>
        </div>

        <div className="col-span-5">
          <Card className="p-6 bg-card-blue">
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
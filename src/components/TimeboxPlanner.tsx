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
          <div className="space-y-6">
            <DayItems
              date={selectedDate}
              items={priorities}
              onItemsChange={fetchPriorities}
            />
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-6">
                {format(selectedDate, "MMMM d, yyyy")}
              </h2>
              <div className="space-y-4">
                {priorities.map((priority) => (
                  <Card key={priority.id} className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{priority.title}</h3>
                    {priority.startTime && priority.endTime && (
                      <div className="flex items-center justify-between text-gray-600">
                        <div>
                          <div className="text-sm font-medium">Start</div>
                          <div className="text-lg">{priority.startTime}</div>
                        </div>
                        <div className="px-4 py-1.5 rounded-full bg-gray-100">
                          {priority.duration}
                        </div>
                        <div>
                          <div className="text-sm font-medium">End</div>
                          <div className="text-lg">{priority.endTime}</div>
                        </div>
                      </div>
                    )}
                    {priority.note && (
                      <div className="mt-4 text-gray-600">
                        <div className="text-sm font-medium">Note</div>
                        <p>{priority.note}</p>
                      </div>
                    )}
                  </Card>
                ))}
                {priorities.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    Nothing for today
                  </div>
                )}
              </div>
            </div>
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
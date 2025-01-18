import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { format, addMonths, subMonths, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayItems } from "./DayItems";
import { supabase } from "@/integrations/supabase/client";

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

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
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

  const getCircleColor = (date: Date) => {
    if (isSameDay(date, new Date())) return "bg-emerald-500";
    const day = date.getDate();
    if (day % 3 === 0) return "bg-emerald-500";
    if (day % 5 === 0) return "bg-black";
    if (day % 7 === 0) return "bg-orange-500";
    return "bg-emerald-500";
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
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
            <div className="flex items-center justify-between mb-6">
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
                  {format(subMonths(currentMonth, 1), "MMM")}
                </span>
                <span className="text-xl font-semibold">
                  {format(currentMonth, "MMM")}
                </span>
                <span className="text-muted-foreground">
                  {format(addMonths(currentMonth, 1), "MMM")}
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

            <div className="grid grid-cols-7 gap-2 text-center mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <div key={day} className="text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth().map((date, index) => (
                <div
                  key={index}
                  className="aspect-square flex items-center justify-center relative"
                >
                  {date && (
                    <button
                      onClick={() => handleDateClick(date)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all
                        ${getCircleColor(date)} text-white hover:opacity-90
                        ${isSameDay(date, new Date()) ? 'ring-2 ring-offset-2 ring-primary hover:ring-4' : ''}
                        ${isSameDay(date, selectedDate) ? 'ring-4 ring-offset-2 ring-primary' : ''}
                      `}
                    >
                      {date.getDate()}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

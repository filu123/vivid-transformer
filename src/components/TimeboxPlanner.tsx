import { useState } from "react";
import { Card } from "@/components/ui/card";
import { format, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./TaskCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const TimeboxPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [priorities, setPriorities] = useState<string[]>(["", "", ""]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handlePriorityChange = (index: number, value: string) => {
    const newPriorities = [...priorities];
    newPriorities[index] = value;
    setPriorities(newPriorities);
  };

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
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add the days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getCircleColor = (date: Date) => {
    // Example logic for different circle colors
    const day = date.getDate();
    if (day % 3 === 0) return "bg-emerald-500";
    if (day % 5 === 0) return "bg-black";
    if (day % 7 === 0) return "bg-orange-500";
    return "bg-emerald-500";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-4 space-y-4">
        {priorities.map((priority, index) => (
          <TaskCard
            key={index}
            title={priority || `Priority ${index + 1}`}
            startTime="9:00 AM"
            endTime="10:00 AM"
            duration="1h"
            variant={index === 0 ? "yellow" : index === 1 ? "blue" : "purple"}
          />
        ))}
      </div>

      <div className="md:col-span-8">
        <Card className="p-8 bg-card-blue">
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
                {format(subMonths(currentMonth, 1), "MMM")}
              </span>
              <span className="text-2xl font-semibold">
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

          <div className="grid grid-cols-7 gap-4 text-center mb-4">
            {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
              <div key={day} className="text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-4">
            {getDaysInMonth().map((date, index) => (
              <div
                key={index}
                className="aspect-square flex items-center justify-center relative"
              >
                {date && (
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                      getCircleColor(date)
                    } text-white hover:opacity-90`}
                  >
                    {date.getDate()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { format, addMonths, subMonths, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./TaskCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayItems } from "./DayItems";

// Mock data for demonstration
const mockDayItems = {
  tasks: [
    {
      id: "1",
      title: "Team Meeting",
      type: "task",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      duration: "1h",
    },
    {
      id: "2",
      title: "Daily Exercise",
      type: "habit",
      startTime: "7:00 AM",
      endTime: "8:00 AM",
      duration: "1h",
    },
    {
      id: "3",
      title: "Doctor Appointment",
      type: "reminder",
      startTime: "2:00 PM",
      endTime: "3:00 PM",
      duration: "1h",
    },
    {
      id: "4",
      title: "Project Ideas",
      type: "note",
    },
  ],
};

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7 space-y-4">
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

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">
          {format(selectedDate, "MMMM d, yyyy")}
        </h3>
        <DayItems
          date={selectedDate}
          items={mockDayItems.tasks}
        />
      </div>
    </div>
  );
};
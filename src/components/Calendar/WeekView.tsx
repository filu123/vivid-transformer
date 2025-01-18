import { useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  time: string;
  variant: "purple" | "pink" | "blue" | "green";
}

const mockEvents: Record<string, Event[]> = {
  "2024-03-13": [
    { id: "1", title: "Meeting", time: "3:00 PM", variant: "purple" },
  ],
  "2024-03-14": [
    { id: "2", title: "App Update", time: "10:00 AM", variant: "pink" },
    { id: "3", title: "Meeting", time: "10:30 AM", variant: "pink" },
  ],
  "2024-03-15": [
    { id: "4", title: "Web Update", time: "2:00 PM", variant: "green" },
  ],
};

export const WeekView = () => {
  const [selectedDate] = useState(new Date());
  
  // Get the start of the week
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  
  // Generate array of 5 days (Monday to Friday)
  const weekDays = Array.from({ length: 5 }).map((_, index) => {
    const date = addDays(weekStart, index);
    const dateStr = format(date, "yyyy-MM-dd");
    const events = mockEvents[dateStr] || [];
    
    return {
      date,
      events,
    };
  });

  const timeSlots = Array.from({ length: 9 }).map((_, index) => {
    const hour = index + 9; // Start from 9 AM
    return format(new Date().setHours(hour, 0), "h:mm a");
  });

  const getEventVariantClass = (variant: Event["variant"]) => {
    const baseClasses = "rounded-md px-3 py-1 text-sm font-medium";
    const variantClasses = {
      purple: "bg-card-purple text-primary",
      pink: "bg-[#FFE4E6] text-primary",
      blue: "bg-card-blue text-primary",
      green: "bg-card-green text-primary",
    };
    return `${baseClasses} ${variantClasses[variant]}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 w-full">
      <div className="grid grid-cols-[auto,repeat(5,1fr)] gap-4">
        {/* Time slots column */}
        <div className="space-y-6 pt-16">
          {timeSlots.map((time) => (
            <div key={time} className="text-sm text-muted-foreground h-12">
              {time}
            </div>
          ))}
        </div>

        {/* Days columns */}
        {weekDays.map(({ date, events }) => (
          <div key={format(date, "yyyy-MM-dd")} className="min-w-[120px]">
            <div className={`p-4 rounded-xl mb-4 ${
              format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
                ? "bg-card-purple"
                : "bg-muted"
            }`}>
              <div className="text-sm font-medium">
                {format(date, "EEEE")}
              </div>
              <div className="text-2xl font-semibold">
                {format(date, "dd")}
              </div>
              <div className="text-lg">
                {format(date, "MMM")}
              </div>
            </div>

            <div className="relative h-[calc(9*3rem)] border-l">
              {events.map((event) => {
                const hour = parseInt(event.time.split(":")[0]);
                const meridiem = event.time.slice(-2);
                const adjustedHour = meridiem === "PM" && hour !== 12 ? hour + 12 : hour;
                const top = (adjustedHour - 9) * 3;

                return (
                  <div
                    key={event.id}
                    className={`absolute left-2 right-2 ${getEventVariantClass(event.variant)}`}
                    style={{ top: `${top}rem` }}
                  >
                    {event.title}
                  </div>
                );
              })}
              
              {timeSlots.map((_, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 w-[calc(100%-1rem)] h-12"
                  style={{ top: `${index * 3}rem` }}
                >
                  <Plus className="h-4 w-4 text-muted-foreground/40" />
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
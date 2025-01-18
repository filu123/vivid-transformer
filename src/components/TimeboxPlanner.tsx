import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimeSlot {
  time: string;
  task: string;
}

export const TimeboxPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [priorities, setPriorities] = useState<string[]>(["", "", ""]);
  const [brainDump, setBrainDump] = useState("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(() => {
    const slots: TimeSlot[] = [];
    for (let hour = 0; hour < 24; hour++) {
      // Add both :00 and :30 slots for each hour
      slots.push({ 
        time: format(new Date().setHours(hour, 0), "HH:mm"),
        task: "" 
      });
      slots.push({ 
        time: format(new Date().setHours(hour, 30), "HH:mm"),
        task: "" 
      });
    }
    return slots;
  });

  const handlePriorityChange = (index: number, value: string) => {
    const newPriorities = [...priorities];
    newPriorities[index] = value;
    setPriorities(newPriorities);
  };

  const handleTimeSlotChange = (time: string, task: string) => {
    setTimeSlots(prev =>
      prev.map(slot =>
        slot.time === time ? { ...slot, task } : slot
      )
    );
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-4 space-y-6">
        <Card className="p-6 bg-card-yellow">
          <h3 className="text-xl font-semibold mb-4">Top Priorities</h3>
          <div className="space-y-3">
            {priorities.map((priority, index) => (
              <Input
                key={index}
                value={priority}
                onChange={(e) => handlePriorityChange(index, e.target.value)}
                placeholder={`Priority ${index + 1}`}
                className="bg-white/50"
              />
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-card-purple">
          <h3 className="text-xl font-semibold mb-4">Brain Dump</h3>
          <Textarea
            value={brainDump}
            onChange={(e) => setBrainDump(e.target.value)}
            placeholder="Dump your thoughts here..."
            className="min-h-[200px] bg-white/50"
          />
        </Card>
      </div>

      <div className="md:col-span-8">
        <Card className="p-6 bg-card-blue">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Daily Schedule</h3>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={format(selectedDate, "yyyy-MM-dd")}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-40 bg-white/50"
              />
              <Button 
                variant="outline" 
                onClick={handleTodayClick}
                className="whitespace-nowrap"
              >
                Today
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-14rem)]">
            <div className="space-y-2 pr-4">
              {timeSlots.map((slot) => (
                <div key={slot.time} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-2 text-right font-medium">
                    {slot.time}
                  </div>
                  <div className="col-span-10">
                    <Input
                      value={slot.task}
                      onChange={(e) => handleTimeSlotChange(slot.time, e.target.value)}
                      placeholder="Add task..."
                      className="bg-white/50"
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};
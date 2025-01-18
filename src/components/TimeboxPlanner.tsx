import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

interface TimeSlot {
  hour: number;
  task: string;
}

export const TimeboxPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [priorities, setPriorities] = useState<string[]>(["", "", ""]);
  const [brainDump, setBrainDump] = useState("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(
    Array.from({ length: 24 }, (_, i) => ({ hour: i, task: "" }))
  );

  const handlePriorityChange = (index: number, value: string) => {
    const newPriorities = [...priorities];
    newPriorities[index] = value;
    setPriorities(newPriorities);
  };

  const handleTimeSlotChange = (hour: number, task: string) => {
    setTimeSlots(prev =>
      prev.map(slot =>
        slot.hour === hour ? { ...slot, task } : slot
      )
    );
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
            <Input
              type="date"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-40 bg-white/50"
            />
          </div>

          <div className="space-y-2">
            {timeSlots.map((slot) => (
              <div key={slot.hour} className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-2 text-right font-medium">
                  {format(new Date().setHours(slot.hour), "h:mm a")}
                </div>
                <div className="col-span-10">
                  <Input
                    value={slot.task}
                    onChange={(e) => handleTimeSlotChange(slot.hour, e.target.value)}
                    placeholder="Add task..."
                    className="bg-white/50"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
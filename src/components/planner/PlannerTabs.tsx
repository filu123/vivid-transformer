import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DayHabits } from "../calendar/DayHabits";
import { DayNotes } from "../calendar/DayNotes";
import { DayReminders } from "../calendar/DayReminders";
import { TasksSection } from "../notes/sections/TasksSection";
import { useState } from "react";

interface PlannerTabsProps {
  habits: any[];
  notes: any[];
  reminders: any[];
  selectedDate: Date;
  onHabitUpdated: () => void;
}

export const PlannerTabs = ({
  habits,
  notes,
  reminders,
  selectedDate,
  onHabitUpdated,
}: PlannerTabsProps) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  return (
    <Tabs defaultValue="tasks" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="habits">Habits</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="reminders">Reminders</TabsTrigger>
      </TabsList>
      <TabsContent value="tasks">
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <TasksSection
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
            />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="habits">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <DayHabits habits={habits} onHabitUpdated={onHabitUpdated} date={selectedDate} />
        </div>
      </TabsContent>
      <TabsContent value="notes">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <DayNotes notes={notes} />
        </div>
      </TabsContent>
      <TabsContent value="reminders">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <DayReminders reminders={reminders} />
        </div>
      </TabsContent>
    </Tabs>
  );
};
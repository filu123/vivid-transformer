import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DayHabits } from "../calendar/DayHabits";
import { DayNotes } from "../calendar/DayNotes";
import { DayReminders } from "../calendar/DayReminders";
import { TaskCard } from "../notes/cards/TaskCard";
import { DailyData } from "@/integrations/supabase/timeboxTypes";
import { NoteCard } from "../notes/NoteCard";
import { useState } from "react";
import { NoteFormDrawer } from "../notes/NoteFormDrawer";

interface PlannerDailyTabsProps {
  selectedDate: Date;
  dailyData: DailyData | null | undefined;
  onTaskUpdate: () => void;
  isLoading: boolean;
}

export const PlannerDailyTabs = ({
  selectedDate,
  dailyData,
  onTaskUpdate,
  isLoading,
}: PlannerDailyTabsProps) => {
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <div className="mt-8 ">
      <h2 className="text-xl md:text-xl font-semibold mb-4 mt-10 animate-fade-in">
        At Brief - <span className="text-[#FF9B74]">{format(selectedDate, "MMM d")}</span>
      </h2>
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="mb-4 gap-6 bg-transparent">
          <TabsTrigger className="p-0" value="tasks">Tasks</TabsTrigger>
          <TabsTrigger className="p-0" value="habits">Habits</TabsTrigger>
          <TabsTrigger className="p-0" value="notes">Notes</TabsTrigger>
          <TabsTrigger className="p-0" value="reminders">Reminders</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          <div className="gap-3 grid grid-cols-2">
            {dailyData?.tasks?.length > 0 ? (
              dailyData.tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={onTaskUpdate}
                  index={index}
                  onClick={() => {
                    setSelectedTask(task);
                    setIsDetailsOpen(true);
                  }}
                />
              ))
            ) : (
              <div className="mt-8 text-center text-gray-500">
                No tasks for today
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="habits">
          <div className="bg-transparent rounded-xl ">
            <DayHabits habits={dailyData?.habits || []} onHabitUpdated={() => { }} date={selectedDate} />
          </div>
        </TabsContent>
        <TabsContent value="notes">
          <div className="bg-transparent rounded-xl  grid grid-cols-2">
            {dailyData?.notes?.length > 0 ? (
              dailyData.notes.map((note, index) => (
                <NoteCard
                  id={note.id}
                  key={note.id}
                  title={note.title}
                  onNoteUpdated={onTaskUpdate}
                  description={note.description}
                  date={note.date}
                  background_color={note.background_color}
                />
              ))
            ) : (
              <div className="mt-8 text-center text-gray-500">
                No Notes for today
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="reminders">
          <div className="bg-transparent rounded-xl  ">
            <DayReminders reminders={dailyData?.reminders || []} />
          </div>
        </TabsContent>
      </Tabs>

      {selectedTask && (
        <NoteFormDrawer
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedTask(null);
          }}
          onNoteAdded={onTaskUpdate}
          editNote={{
            id: selectedTask.id,
            title: selectedTask.title,
            description: selectedTask.description,
            date: selectedTask.date,
            background_color: selectedTask.background_color,
            label_id: selectedTask.label_id,
          }}
          isTaskMode={true}
        />
      )}
    </div>
  );
};
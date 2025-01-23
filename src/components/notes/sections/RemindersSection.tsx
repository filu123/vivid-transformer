import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReminderCard } from "../cards/ReminderCard";
import { NoteColorFilters } from "../filters/NoteColorFilters";
import { Button } from "@/components/ui/button";
import { Calendar, Bell, CheckSquare, ListTodo } from "lucide-react";

interface RemindersSectionProps {
  selectedColor: string | null;
  onColorSelect: (color: string | null) => void;
}

export const RemindersSection = ({
  selectedColor,
  onColorSelect,
}: RemindersSectionProps) => {
  const { data: reminders, refetch: refetchReminders } = useQuery({
    queryKey: ["reminders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredReminders = selectedColor
    ? reminders?.filter((reminder) => reminder.background_color === selectedColor)
    : reminders;

  const categories = [
    {
      id: "all",
      name: "All",
      count: reminders?.filter((r) => !r.is_completed).length || 0,
      icon: ListTodo,
      color: "bg-card-yellow",
    },
    {
      id: "today",
      name: "Today",
      count:
        reminders?.filter((r) => !r.is_completed && r.category === "today")
          .length || 0,
      icon: Calendar,
      color: "bg-card-blue",
    },
    {
      id: "scheduled",
      name: "Scheduled",
      count:
        reminders?.filter((r) => !r.is_completed && r.category === "scheduled")
          .length || 0,
      icon: Bell,
      color: "bg-card-purple",
    },
    {
      id: "completed",
      name: "Completed",
      count: reminders?.filter((r) => r.is_completed).length || 0,
      icon: CheckSquare,
      color: "bg-card-green",
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <NoteColorFilters
            colors={[
              "#F2FCE2",
              "#FEF7CD",
              "#FEC6A1",
              "#9b87f5",
              "#7E69AB",
              "#6E59A5",
              "#8E9196",
            ]}
            selectedColor={selectedColor}
            onColorSelect={onColorSelect}
            notesCount={filteredReminders?.length || 0}
            title="All reminders"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              className={`h-24 flex items-center justify-start p-4 ${category.color} hover:opacity-90`}
            >
              <div className="flex items-center space-x-4 w-full">
                <div className="bg-white/80 rounded-full p-3">
                  <category.icon className="h-6 w-6 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-left">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground text-left">
                    {category.count} tasks
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
          {filteredReminders?.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onUpdate={refetchReminders}
            />
          ))}
        </div>
      </div>
    </>
  );
};
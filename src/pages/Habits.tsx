import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HabitFormModal } from "@/components/habits/HabitFormModal";
import { HabitList } from "@/components/habits/HabitList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NoteColorFilters } from "@/components/notes/filters/NoteColorFilters";

const COLORS = [
  "#ff9b74",
  "#fdc971",
  "#ebc49a",
  "#322a2f",
  "#c15626",
  "#ebe3d6",
  "#a2a8a5",
];

const Habits = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const { data: habits, refetch } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredHabits = selectedColor
    ? habits?.filter((habit) => habit.background_color === selectedColor)
    : habits;

  return (
    <main className="container mx-auto p-4 md:p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Habits</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Habit
        </Button>
      </div>

      <div className="mb-6">
        <NoteColorFilters
          colors={COLORS}
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
          notesCount={filteredHabits?.length || 0}
          title="All habits"
        />
      </div>

      <HabitList habits={filteredHabits || []} onHabitUpdated={refetch} />

      <HabitFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onHabitAdded={() => {
          refetch();
          setIsModalOpen(false);
        }}
      />
    </main>
  );
};

export default Habits;
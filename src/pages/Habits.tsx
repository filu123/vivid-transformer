import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HabitFormModal } from "@/components/habits/HabitFormModal";
import { HabitList } from "@/components/habits/HabitList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Habits = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <main className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Habits</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Habit
        </Button>
      </div>

      <HabitList habits={habits || []} onHabitUpdated={refetch} />

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
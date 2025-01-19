import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ReminderList } from "@/components/reminders/ReminderList";
import { ReminderFormModal } from "@/components/reminders/ReminderFormModal";

const Reminders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<string | null>(null);

  const { data: lists, isLoading } = useQuery({
    queryKey: ["reminder-lists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reminder_lists")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Reminders</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lists?.map((list) => (
          <ReminderList
            key={list.id}
            list={list}
            isSelected={selectedList === list.id}
            onSelect={() => setSelectedList(list.id)}
          />
        ))}
      </div>

      <ReminderFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lists={lists || []}
      />
    </main>
  );
};

export default Reminders;
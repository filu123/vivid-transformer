import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ReminderList } from "@/components/reminders/ReminderList";
import { ReminderFormModal } from "@/components/reminders/ReminderFormModal";
import { Card } from "@/components/ui/card";

const Reminders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const queryClient = useQueryClient();

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reminders'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['reminders'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: lists, isLoading: listsLoading } = useQuery({
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

  const { data: reminders, isLoading: remindersLoading } = useQuery({
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

  const filteredReminders = reminders?.filter(reminder => {
    if (selectedCategory === "completed") {
      return reminder.is_completed;
    }
    if (selectedCategory === "today") {
      return !reminder.is_completed && reminder.category === "today";
    }
    if (selectedCategory === "scheduled") {
      return !reminder.is_completed && reminder.category === "scheduled";
    }
    if (selectedCategory === "all") {
      return !reminder.is_completed;
    }
    return false;
  }) || [];

  const todayReminders = reminders?.filter(r => !r.is_completed && r.category === 'today') || [];
  const scheduledReminders = reminders?.filter(r => !r.is_completed && r.category === 'scheduled') || [];
  const completedReminders = reminders?.filter(r => r.is_completed) || [];
  const allReminders = reminders?.filter(r => !r.is_completed) || [];

  if (listsLoading || remindersLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          {/* Categories */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <Card 
              className={`p-4 hover:bg-accent cursor-pointer ${selectedCategory === "all" ? "bg-accent" : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              <div className="flex justify-between items-center">
                <span>All</span>
                <span className="text-muted-foreground">{allReminders.length}</span>
              </div>
            </Card>
            <Card 
              className={`p-4 hover:bg-accent cursor-pointer ${selectedCategory === "today" ? "bg-accent" : ""}`}
              onClick={() => setSelectedCategory("today")}
            >
              <div className="flex justify-between items-center">
                <span>Today</span>
                <span className="text-muted-foreground">{todayReminders.length}</span>
              </div>
            </Card>
            <Card 
              className={`p-4 hover:bg-accent cursor-pointer ${selectedCategory === "scheduled" ? "bg-accent" : ""}`}
              onClick={() => setSelectedCategory("scheduled")}
            >
              <div className="flex justify-between items-center">
                <span>Scheduled</span>
                <span className="text-muted-foreground">{scheduledReminders.length}</span>
              </div>
            </Card>
            <Card 
              className={`p-4 hover:bg-accent cursor-pointer ${selectedCategory === "completed" ? "bg-accent" : ""}`}
              onClick={() => setSelectedCategory("completed")}
            >
              <div className="flex justify-between items-center">
                <span>Completed</span>
                <span className="text-muted-foreground">{completedReminders.length}</span>
              </div>
            </Card>
          </div>

          {/* Lists */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold mb-4">My Lists</h2>
            {lists?.map((list) => (
              <Card 
                key={list.id}
                className={`p-4 hover:bg-accent cursor-pointer ${selectedList === list.id ? 'bg-accent' : ''}`}
                onClick={() => setSelectedList(list.id)}
              >
                <div className="flex justify-between items-center">
                  <span>{list.name}</span>
                  <span className="text-muted-foreground">
                    {reminders?.filter(r => r.list_id === list.id && !r.is_completed).length || 0}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">
              {selectedList 
                ? lists?.find(l => l.id === selectedList)?.name 
                : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) + " Reminders"}
            </h1>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </div>

          <div className="space-y-4">
            {selectedList ? (
              <ReminderList
                key={selectedList}
                list={{ 
                  id: selectedList, 
                  name: lists?.find(l => l.id === selectedList)?.name || "" 
                }}
                isSelected={true}
                onSelect={() => {}}
              />
            ) : (
              filteredReminders.map((reminder) => (
                <Card key={reminder.id} className="p-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={reminder.is_completed}
                      onChange={async () => {
                        await supabase
                          .from("reminders")
                          .update({ is_completed: !reminder.is_completed })
                          .eq("id", reminder.id);
                      }}
                      className="rounded-full"
                    />
                    <span className={reminder.is_completed ? "line-through text-muted-foreground" : ""}>
                      {reminder.title}
                    </span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      <ReminderFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
};

export default Reminders;
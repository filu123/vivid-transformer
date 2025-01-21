import { useState } from "react";
import { ReminderFormModal } from "@/components/reminders/ReminderFormModal";
import { ReminderCategories } from "@/components/reminders/ReminderCategories";
import { ReminderContent } from "@/components/reminders/ReminderContent";
import { ReminderHeader } from "@/components/reminders/ReminderHeader";
import { useReminders } from "@/hooks/useReminders";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, CheckSquare, ListTodo } from "lucide-react";

const Reminders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { lists, reminders, handleToggleReminder } = useReminders();

  const filteredReminders = reminders?.filter((reminder) => {
    if (selectedList) {
      return reminder.list_id === selectedList;
    }
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
      count: reminders?.filter((r) => !r.is_completed && r.category === "today").length || 0,
      icon: Calendar,
      color: "bg-card-blue",
    },
    {
      id: "scheduled",
      name: "Scheduled",
      count: reminders?.filter((r) => !r.is_completed && r.category === "scheduled").length || 0,
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

  const pageTitle = selectedList
    ? lists?.find((l) => l.id === selectedList)?.name
    : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Reminders`;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <ReminderHeader
        title={pageTitle}
        onAddReminder={() => setIsModalOpen(true)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Categories Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <div className="grid grid-cols-2 gap-4">
            <ReminderCategories
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(category) => {
                setSelectedCategory(category);
                setSelectedList(null);
              }}
            />
          </div>
        </div>

        {/* Lists Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">My Lists</h2>
          <div className="grid grid-cols-2 gap-4">
            {lists?.map((list) => (
              <Button
                key={list.id}
                variant="ghost"
                className={`h-24 flex items-center justify-start p-4 bg-white hover:bg-accent/50 ${
                  selectedList === list.id ? "bg-accent/50" : ""
                }`}
                onClick={() => {
                  setSelectedList(selectedList === list.id ? null : list.id);
                  setSelectedCategory("all");
                }}
              >
                <div className="flex items-center space-x-4 w-full">
                  <div className="bg-[#f3f3f3] rounded-full p-3">
                    <ListTodo className="h-6 w-6 text-black" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-left">{list.name}</h3>
                    <p className="text-sm text-muted-foreground text-left">
                      {reminders?.filter((r) => r.list_id === list.id && !r.is_completed).length || 0} tasks
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Reminders Content */}
      <ReminderContent
        selectedList={selectedList}
        lists={lists || []}
        reminders={filteredReminders}
        onToggleReminder={handleToggleReminder}
      />

      <ReminderFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Reminders;
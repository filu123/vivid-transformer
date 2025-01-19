import { useState } from "react";
import { ReminderFormModal } from "@/components/reminders/ReminderFormModal";
import { ReminderCategories } from "@/components/reminders/ReminderCategories";
import { ReminderContent } from "@/components/reminders/ReminderContent";
import { ReminderHeader } from "@/components/reminders/ReminderHeader";
import { useReminders } from "@/hooks/useReminders";

const Reminders = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { lists, reminders, handleToggleReminder } = useReminders();

  const filteredReminders = reminders?.filter((reminder) => {
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
    },
    {
      id: "today",
      name: "Today",
      count:
        reminders?.filter((r) => !r.is_completed && r.category === "today")
          .length || 0,
    },
    {
      id: "scheduled",
      name: "Scheduled",
      count:
        reminders?.filter((r) => !r.is_completed && r.category === "scheduled")
          .length || 0,
    },
    {
      id: "completed",
      name: "Completed",
      count: reminders?.filter((r) => r.is_completed).length || 0,
    },
  ];

  const pageTitle = selectedList
    ? lists?.find((l) => l.id === selectedList)?.name
    : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Reminders`;

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <ReminderCategories
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Lists */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold mb-4">My Lists</h2>
            {lists?.map((list) => (
              <Card
                key={list.id}
                className={`p-4 hover:bg-accent cursor-pointer ${
                  selectedList === list.id ? "bg-accent" : ""
                }`}
                onClick={() => setSelectedList(list.id)}
              >
                <div className="flex justify-between items-center">
                  <span>{list.name}</span>
                  <span className="text-muted-foreground">
                    {
                      reminders?.filter(
                        (r) => r.list_id === list.id && !r.is_completed
                      ).length
                    }
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          <ReminderHeader
            title={pageTitle}
            onAddReminder={() => setIsModalOpen(true)}
          />
          <ReminderContent
            selectedList={selectedList}
            lists={lists || []}
            reminders={filteredReminders}
            onToggleReminder={handleToggleReminder}
          />
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
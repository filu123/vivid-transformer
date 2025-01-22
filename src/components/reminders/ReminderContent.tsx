import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { ReminderList } from "./ReminderList";

interface Reminder {
  id: string;
  title: string;
  is_completed: boolean;
  due_date?: string;
  category: string;
  list_id?: string;
}

interface ReminderContentProps {
  selectedList: string | null;
  lists: any[];
  reminders: Reminder[];
  onToggleReminder: (id: string, currentState: boolean) => void;
}

export const ReminderContent = ({
  selectedList,
  lists,
  reminders,
  onToggleReminder,
}: ReminderContentProps) => {
  if (selectedList) {
    return (
      <ReminderList
        key={selectedList}
        list={{
          id: selectedList,
          name: lists?.find((l) => l.id === selectedList)?.name || "",
        }}
        isSelected={true}
        onSelect={() => {}}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">All Reminders</h2>
        <span className="text-sm text-muted-foreground">
          {reminders.length} reminders
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reminders.map((reminder, index) => (
          <Card 
            key={reminder.id} 
            className="group p-6 hover:shadow-lg transition-all duration-300 ease-in-out animate-fade-in"
            style={{
              animationDelay: `${index * 50}ms`,
              transform: 'translateY(0)',
              opacity: 1
            }}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <Checkbox
                  checked={reminder.is_completed}
                  onCheckedChange={() =>
                    onToggleReminder(reminder.id, reminder.is_completed)
                  }
                  className="h-5 w-5 border-2 transition-colors duration-200"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p
                  className={`text-base font-medium transition-all duration-200 ${
                    reminder.is_completed
                      ? "line-through text-muted-foreground"
                      : "group-hover:text-primary"
                  }`}
                >
                  {reminder.title}
                </p>
                {reminder.due_date && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    Due: {format(new Date(reminder.due_date), "PPP")}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
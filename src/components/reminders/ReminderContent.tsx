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
        {reminders.map((reminder) => (
          <Card key={reminder.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={reminder.is_completed}
                onCheckedChange={() =>
                  onToggleReminder(reminder.id, reminder.is_completed)
                }
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-base ${
                    reminder.is_completed
                      ? "line-through text-muted-foreground"
                      : ""
                  }`}
                >
                  {reminder.title}
                </p>
                {reminder.due_date && (
                  <p className="text-sm text-muted-foreground truncate">
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
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
    <div className="space-y-4">
      {reminders.map((reminder) => (
        <Card key={reminder.id} className="p-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={reminder.is_completed}
              onCheckedChange={() =>
                onToggleReminder(reminder.id, reminder.is_completed)
              }
            />
            <div className="flex-1">
              <span
                className={
                  reminder.is_completed
                    ? "line-through text-muted-foreground"
                    : ""
                }
              >
                {reminder.title}
              </span>
              {reminder.due_date && (
                <p className="text-xs text-muted-foreground">
                  Due: {format(new Date(reminder.due_date), "PPP")}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
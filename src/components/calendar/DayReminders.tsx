import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Clock } from "lucide-react";

interface Reminder {
  id: string;
  title: string;
  due_date: string;
  is_completed: boolean;
}

interface DayRemindersProps {
  reminders: Reminder[];
}

export const DayReminders = ({ reminders }: DayRemindersProps) => {
  if (!reminders.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Reminders</h3>
      {reminders.map((reminder) => (
        <Card key={reminder.id} className="p-4">
          <div className="flex items-center justify-between">
            <span className={reminder.is_completed ? "line-through text-muted-foreground" : ""}>
              {reminder.title}
            </span>
            {reminder.due_date && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {format(new Date(reminder.due_date), "h:mm a")}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
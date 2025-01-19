import { Card } from "@/components/ui/card";
import { format, addMonths } from "date-fns";

interface Habit {
  id: string;
  title: string;
  frequency: "daily" | "three_times" | "custom";
  custom_days: number[] | null;
  duration_months: number;
  start_date: string;
}

interface HabitListProps {
  habits: Habit[];
}

export const HabitList = ({ habits }: HabitListProps) => {
  const getFrequencyText = (habit: Habit) => {
    switch (habit.frequency) {
      case "daily":
        return "Every day";
      case "three_times":
        return "Three times a week";
      case "custom":
        return `Custom: ${habit.custom_days?.map((day) => 
          ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]
        ).join(", ")}`;
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <Card key={habit.id} className="p-6">
          <h3 className="text-xl font-semibold mb-2">{habit.title}</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Frequency: {getFrequencyText(habit)}</p>
            <p>Duration: Until {format(addMonths(new Date(habit.start_date), habit.duration_months), "PP")}</p>
          </div>
        </Card>
      ))}
      {habits.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No habits created yet
        </div>
      )}
    </div>
  );
};
import { Card } from "@/components/ui/card";
import { HabitCard } from "../habits/HabitCard";

interface DayHabitsProps {
  habits: any[];
  onHabitUpdated: () => void;
  date: Date;
}

export const DayHabits = ({ habits, onHabitUpdated, date }: DayHabitsProps) => {
  if (!habits.length) return null;

  return (
    <Card className="p-0 border-0  shadow-none">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-4">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onHabitUpdated={onHabitUpdated}
            selectedDate={date}
          />
        ))}
      </div>
    </Card>
  );
};
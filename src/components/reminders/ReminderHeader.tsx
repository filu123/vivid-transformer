import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ReminderHeaderProps {
  title: string;
  onAddReminder: () => void;
}

export const ReminderHeader = ({ title, onAddReminder }: ReminderHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <Button onClick={onAddReminder}>
        <Plus className="h-4 w-4 mr-2" />
        Add Reminder
      </Button>
    </div>
  );
};
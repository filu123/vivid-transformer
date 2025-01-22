import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Reminder {
  id: string;
  title: string;
  due_date?: string;
  is_completed: boolean;
  category: string;
  background_color?: string;
}

interface ReminderListProps {
  reminders: Reminder[];
  onToggleReminder: (id: string, isCompleted: boolean) => void;
  list?: {
    id: string;
    name: string;
  };
}

export const ReminderList = ({ reminders, onToggleReminder, list }: ReminderListProps) => {
  const { toast } = useToast();

  const handleToggle = async (id: string, isCompleted: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('reminders')
        .update({ 
          is_completed: isCompleted,
          user_id: user.id 
        })
        .eq('id', id);

      if (error) throw error;
      onToggleReminder(id, isCompleted);
    } catch (error) {
      console.error('Error toggling reminder:', error);
      toast({
        title: "Error",
        description: "Failed to toggle reminder status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {reminders.map((reminder) => (
        <Card key={reminder.id} className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Checkbox
              checked={reminder.is_completed}
              onCheckedChange={(checked) => handleToggle(reminder.id, checked as boolean)}
              className="mr-4"
            />
            <div>
              <h3 className="font-semibold">{reminder.title}</h3>
              <p className="text-sm text-muted-foreground">{reminder.due_date}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
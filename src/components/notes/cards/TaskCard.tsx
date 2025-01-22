import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { TaskDetailsDrawer } from "./TaskDetailsDrawer";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description?: string;
    date?: string | null;
    background_color?: string;
    label_id?: string;
    is_done?: boolean;
  };
  onUpdate: () => void;
}

export const TaskCard = ({ task, onUpdate }: TaskCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();

  const handleToggleDone = async (checked: boolean) => {
    try {
      const { error } = await supabase
        .from("tasks_notes")
        .update({ is_done: checked })
        .eq("id", task.id);

      if (error) throw error;

      onUpdate();
      
      toast({
        title: checked ? "Task completed" : "Task uncompleted",
        description: `"${task.title}" has been ${checked ? 'marked as complete' : 'unmarked'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card
        className={`min-h-[270px] max-h-[270px] transition-all duration-200 hover:scale-[1.02] cursor-pointer overflow-hidden p-6 ${
          task.is_done ? 'bg-[#F2FCE2]' : ''
        }`}
        style={{ backgroundColor: task.is_done ? '#F2FCE2' : task.background_color }}
        onClick={() => setIsDetailsOpen(true)}
      >
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Checkbox
                checked={task.is_done}
                onCheckedChange={(checked) => {
                  handleToggleDone(checked as boolean);
                }}
                onClick={(e) => e.stopPropagation()}
                className="mt-1.5"
              />
              <div className="space-y-1 flex-1">
                <h3 className={`font-semibold text-xl line-clamp-2 ${task.is_done ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`text-sm text-muted-foreground line-clamp-4 ${task.is_done ? 'line-through' : ''}`}>
                    {task.description}
                  </p>
                )}
              </div>
            </div>
          </div>
          {task.date && (
            <p className="text-sm text-muted-foreground mt-auto">
              {format(new Date(task.date), "MMM d, yyyy")}
            </p>
          )}
        </div>
      </Card>

      <TaskDetailsDrawer
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        task={task}
        onUpdate={onUpdate}
      />
    </>
  );
};
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useState } from "react";
import { ReminderDetailsDrawer } from "./ReminderDetailsDrawer";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CardAnimation } from "../animations/CardAnimation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ReminderCardProps {
  reminder: {
    id: string;
    title: string;
    due_date?: string;
    is_completed: boolean;
    category: string;
    background_color?: string;
  };
  onUpdate: () => void;
  index?: number;
}

export const ReminderCard = ({ reminder, onUpdate, index = 0 }: ReminderCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("reminders")
        .delete()
        .eq('id', reminder.id);

      if (error) throw error;

      toast.success("Reminder deleted successfully");
      onUpdate();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("Failed to delete reminder");
    }
  };

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("reminders")
        .update({ 
          is_completed: !reminder.is_completed,
          user_id: user.id 
        })
        .eq("id", reminder.id);

      if (error) throw error;
      onUpdate();
      toast.success("Reminder updated successfully");
    } catch (error) {
      console.error("Error updating reminder:", error);
      toast.error("Failed to update reminder");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardAnimation index={index}>
      <Card
        className="min-h-[270px] max-h-[270px] transition-all duration-200 hover:scale-[1.02] cursor-pointer overflow-hidden p-6"
        style={{ backgroundColor: reminder.background_color || "#F2FCE2" }}
        onClick={() => setIsDetailsOpen(true)}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={reminder.is_completed}
              onCheckedChange={handleToggle}
              disabled={isLoading}
              onClick={(e) => e.stopPropagation()}
              className="mt-1"
            />
            <div>
              <h3 className={`font-semibold text-xl ${
                reminder.is_completed ? "line-through text-muted-foreground" : ""
              }`}>
                {reminder.title}
              </h3>
              <Badge variant="outline" className="mt-2 capitalize">
                {reminder.category}
              </Badge>
              {reminder.due_date && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <Clock className="h-4 w-4" />
                  <span>{format(new Date(reminder.due_date), "PPp")}</span>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <ReminderDetailsDrawer
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        reminder={reminder}
        onUpdate={onUpdate}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this reminder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CardAnimation>
  );
};
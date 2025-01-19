import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { isToday } from "date-fns";

export const useReminderForm = (onClose: () => void) => {
  const [title, setTitle] = useState("");
  const [listId, setListId] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create reminders",
          variant: "destructive",
        });
        return;
      }

      let dueDate: Date | null = null;
      if (date) {
        dueDate = new Date(date);
        if (time) {
          const [hours, minutes] = time.split(':').map(Number);
          dueDate.setHours(hours, minutes);
        }
      }

      let category: "all" | "today" | "scheduled" = "all";
      if (date) {
        category = isToday(date) ? "today" : "scheduled";
      }

      const { error } = await supabase.from("reminders").insert({
        title,
        list_id: listId,
        due_date: dueDate?.toISOString(),
        user_id: user.id,
        category,
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create reminder",
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Success",
        description: "Reminder created successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      onClose();
      setTitle("");
      setListId("");
      setDate(undefined);
      setTime("");
    } catch (error) {
      console.error("Error creating reminder:", error);
    }
  };

  return {
    title,
    setTitle,
    listId,
    setListId,
    date,
    setDate,
    time,
    setTime,
    handleSubmit,
  };
};
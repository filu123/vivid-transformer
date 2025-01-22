import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useReminders = () => {
  const [lists, setLists] = useState([]);
  const [reminders, setReminders] = useState([]);
  const { toast } = useToast();

  const fetchLists = async () => {
    const { data, error } = await supabase.from("reminder_lists").select("*");
    if (error) {
      console.error("Error fetching lists:", error);
      return;
    }
    setLists(data);
  };

  const fetchReminders = async () => {
    const { data, error } = await supabase.from("reminders").select("*");
    if (error) {
      console.error("Error fetching reminders:", error);
      return;
    }
    setReminders(data);
  };

  useEffect(() => {
    fetchLists();
    fetchReminders();
  }, []);

  const handleToggleReminder = async (id: string, isCompleted: boolean) => {
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
      
      fetchReminders();
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  return {
    lists,
    reminders,
    handleToggleReminder
  };
};

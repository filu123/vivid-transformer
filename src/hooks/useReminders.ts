import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useReminders = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('reminders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reminders'
        },
        async (payload) => {
          // Force a refetch of the reminders data
          await queryClient.invalidateQueries({ queryKey: ['reminders'] });
          
          if (payload.eventType === 'UPDATE' && 'is_completed' in payload.new && 'is_completed' in payload.old) {
            const newIsCompleted = payload.new.is_completed;
            const oldIsCompleted = payload.old.is_completed;
            
            if (newIsCompleted !== oldIsCompleted) {
              toast({
                title: newIsCompleted ? "Reminder completed" : "Reminder uncompleted",
                description: `"${payload.new.title}" has been ${newIsCompleted ? 'marked as complete' : 'unmarked'}`,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  const { data: lists } = useQuery({
    queryKey: ["reminder-lists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reminder_lists")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: reminders } = useQuery({
    queryKey: ["reminders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleToggleReminder = async (reminderId: string, currentState: boolean) => {
    const { error } = await supabase
      .from("reminders")
      .update({ is_completed: !currentState })
      .eq("id", reminderId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update reminder status",
        variant: "destructive",
      });
    }
  };

  return {
    lists,
    reminders,
    handleToggleReminder,
  };
};
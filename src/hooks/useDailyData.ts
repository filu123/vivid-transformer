import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DailyData } from "@/integrations/supabase/timeboxTypes";
import { format } from "date-fns";

export const useDailyData = (selectedDate: Date, userId: string | undefined) => {
  return useQuery<DailyData>({
    queryKey: ['dailyData', selectedDate, userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .rpc('get_daily_data', {
          p_user_id: userId,
          p_date: format(selectedDate, "yyyy-MM-dd")
        });

      if (error) throw error;
      return data as unknown as DailyData;
    },
    enabled: !!userId,
  });
};
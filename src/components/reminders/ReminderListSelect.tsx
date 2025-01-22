import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface ReminderListSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const ReminderListSelect = ({ value, onChange, className }: ReminderListSelectProps) => {
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

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn(
        "w-full border-none bg-background focus:ring-0",
        className
      )}>
        <SelectValue placeholder="Select a list" />
      </SelectTrigger>
      <SelectContent>
        {lists?.map((list) => (
          <SelectItem
            key={list.id}
            value={list.id}
            className="cursor-pointer"
          >
            {list.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
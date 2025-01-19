import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReminderListSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const ReminderListSelect = ({ value, onChange }: ReminderListSelectProps) => {
  const { data: lists = [] } = useQuery({
    queryKey: ["reminder-lists"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("reminder_lists")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="list">List</Label>
      <Select value={value} onValueChange={onChange} required>
        <SelectTrigger>
          <SelectValue placeholder="Select a list" />
        </SelectTrigger>
        <SelectContent>
          {lists.map((list) => (
            <SelectItem key={list.id} value={list.id}>
              {list.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
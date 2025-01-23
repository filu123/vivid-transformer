import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface TaskLabelFilterProps {
  selectedLabelId: string | null;
  onLabelSelect: (labelId: string | null) => void;
}

export const TaskLabelFilter = ({
  selectedLabelId,
  onLabelSelect,
}: TaskLabelFilterProps) => {
  const [newLabelName, setNewLabelName] = useState("");
  const { toast } = useToast();

  const { data: labels, refetch } = useQuery({
    queryKey: ["task-labels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("task_labels")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleCreateLabel = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!newLabelName.trim()) return;

    if (labels && labels.length >= 7) {
      toast({
        title: "Label limit reached",
        description: "You can only create up to 7 labels.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      const id = crypto.randomUUID();
      const { error } = await supabase
        .from("task_labels")
        .insert({ 
          id,
          name: newLabelName.trim(),
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Label created",
        description: "Your new label has been created successfully.",
      });

      setNewLabelName("");
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create label. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Select
      value={selectedLabelId || "all"}
      onValueChange={(value) => onLabelSelect(value === "all" ? null : value)}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filter by label" />
      </SelectTrigger>
      <SelectContent>
        <div className="p-2">
          <div className="flex items-center space-x-2">
            <Input
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              placeholder="New label"
              className="h-8"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleCreateLabel}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <SelectItem value="all">All labels</SelectItem>
        {labels?.map((label) => (
          <SelectItem key={label.id} value={label.id}>
            {label.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
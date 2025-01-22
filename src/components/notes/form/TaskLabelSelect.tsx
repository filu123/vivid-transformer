import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface TaskLabelSelectProps {
  selectedLabelId: string | null;
  onSelectLabel: (labelId: string | null) => void;
}

export const TaskLabelSelect = ({
  selectedLabelId,
  onSelectLabel,
}: TaskLabelSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleCreateLabel = async () => {
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
      const { error } = await supabase
        .from("task_labels")
        .insert({ name: newLabelName.trim() });

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
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start"
          role="combobox"
          aria-expanded={isOpen}
        >
          {selectedLabelId && labels
            ? labels.find((label) => label.id === selectedLabelId)?.name
            : "Select label"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="p-2">
          <div className="flex items-center space-x-2">
            <Input
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              placeholder="New label"
              className="h-8"
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
        <div className="max-h-[200px] overflow-y-auto">
          {labels?.map((label) => (
            <Button
              key={label.id}
              variant="ghost"
              role="option"
              className={cn(
                "w-full justify-start font-normal",
                selectedLabelId === label.id && "bg-accent"
              )}
              onClick={() => {
                onSelectLabel(label.id);
                setIsOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedLabelId === label.id ? "opacity-100" : "opacity-0"
                )}
              />
              {label.name}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
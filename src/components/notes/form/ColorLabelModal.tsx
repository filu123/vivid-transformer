
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ColorLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableColors: string[];
  type: "note" | "task" | "reminder";
}

export const ColorLabelModal = ({ isOpen, onClose, availableColors, type }: ColorLabelModalProps) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedColor || !label.trim()) {
      toast({
        title: "Error",
        description: "Please select a color and enter a label",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('color_labels')
        .insert({
          color: selectedColor,
          label: label.trim(),
          category: type,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Color label added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['colorLabels', type] });
      setSelectedColor(null);
      setLabel("");
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add color label",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Color Label</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Color</label>
            <div className="flex gap-2">
              {availableColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "w-8 h-8 rounded-full transition-transform hover:scale-110",
                    selectedColor === color ? "ring-2 ring-offset-2 ring-black scale-110" : ""
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="label" className="text-sm font-medium">Label</label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter a label (e.g., Groceries)"
              maxLength={20}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Color
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

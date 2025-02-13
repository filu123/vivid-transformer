
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { ColorLabelModal } from "./ColorLabelModal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_COLOR = '#ff9b74';
const AVAILABLE_COLORS = ['#FDC971', '#EBC49A', '#322A2F', '#C15626', '#EBE3D6', '#A2A8A5'];

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (colorId: string | null, color: string) => void;
  type: "note" | "task" | "reminder";
}

export const ColorPicker = ({ selectedColor, onColorChange, type }: ColorPickerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: colorLabels } = useQuery({
    queryKey: ['colorLabels', type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('color_labels')
        .select('*')
        .eq('category', type)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onColorChange(null, DEFAULT_COLOR)}
          className={cn(
            "w-6 h-6 rounded-full transition-transform",
            !selectedColor || selectedColor === DEFAULT_COLOR ? "scale-110 ring-2 ring-offset-2 ring-black" : ""
          )}
          style={{ backgroundColor: DEFAULT_COLOR }}
        />
        
        {colorLabels?.map((label) => (
          <div key={label.id} className="relative group">
            <button
              type="button"
              onClick={() => onColorChange(label.id, label.color)}
              className={cn(
                "w-6 h-6 rounded-full transition-transform",
                selectedColor === label.color ? "scale-110 ring-2 ring-offset-2 ring-black" : ""
              )}
              style={{ backgroundColor: label.color }}
            />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {label.label}
            </div>
          </div>
        ))}

        {(!colorLabels || colorLabels.length < 8) && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="w-6 h-6 rounded-full"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ColorLabelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableColors={AVAILABLE_COLORS}
        type={type}
      />
    </div>
  );
};

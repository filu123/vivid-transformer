import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COLORS = ['#ff9b74', '#fdc971', '#ebc49a', '#322a2f', '#c15626', '#ebe3d6', '#a2a8a5'];

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export const ColorPicker = ({ selectedColor, onColorChange }: ColorPickerProps) => {
  return (
    <div className="flex items-center gap-2">
      {COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onColorChange(color)}
          className={cn(
            "w-6 h-6 rounded-full transition-transform",
            selectedColor === color ? "scale-110 ring-2 ring-offset-2 ring-black" : ""
          )}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};
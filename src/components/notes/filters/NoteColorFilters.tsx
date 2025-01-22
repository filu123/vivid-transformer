import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NoteColorFiltersProps {
  colors: string[];
  selectedColor: string | null;
  onColorSelect: (color: string | null) => void;
  notesCount: number;
  title?: string;
}

export const NoteColorFilters = ({
  colors,
  selectedColor,
  onColorSelect,
  notesCount,
  title = "All notes"
}: NoteColorFiltersProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        className={cn(
          "px-3 py-1 h-auto text-sm font-medium",
          !selectedColor && "bg-muted"
        )}
        onClick={() => onColorSelect(null)}
      >
        {title} ({notesCount})
      </Button>
      {colors.map((color) => (
        <Button
          key={color}
          className={cn(
            "w-6 h-6 p-0 rounded-full",
            selectedColor === color && "ring-2 ring-offset-2 ring-offset-background"
          )}
          style={{ backgroundColor: color }}
          onClick={() => onColorSelect(color)}
        />
      ))}
    </div>
  );
};
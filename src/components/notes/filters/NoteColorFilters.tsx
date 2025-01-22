import { cn } from "@/lib/utils";

interface NoteColorFiltersProps {
  colors: string[];
  selectedColor: string | null;
  onColorSelect: (color: string | null) => void;
  notesCount: number;
}

export const NoteColorFilters = ({
  colors,
  selectedColor,
  onColorSelect,
  notesCount,
}: NoteColorFiltersProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onColorSelect(null)}
          className="text-lg md:text-xl font-semibold hover:opacity-80 transition-opacity"
        >
          All Notes
        </button>
        <div className="flex items-center gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => onColorSelect(selectedColor === color ? null : color)}
              className={cn(
                "w-6 h-6 rounded-full transition-transform hover:scale-110",
                selectedColor === color ? "ring-2 ring-offset-2 ring-black scale-110" : ""
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      <span className="text-sm text-muted-foreground">
        {notesCount} Notes
      </span>
    </div>
  );
};
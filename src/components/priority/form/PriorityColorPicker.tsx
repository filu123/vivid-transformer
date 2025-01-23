import { Label } from "@/components/ui/label";

const COLORS = [
  '#F2FCE2',
  '#FEF7CD',
  '#FEC6A1',
  '#E5DEFF',
  '#FFDEE2',
  '#FDE1D3',
  '#D3E4FD',
];

interface PriorityColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const PriorityColorPicker = ({
  selectedColor,
  onColorSelect,
}: PriorityColorPickerProps) => {
  return (
    <div className="space-y-2">
      <Label>Background Color</Label>
      <div className="flex gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className={`w-8 h-8 rounded-full transition-transform hover:scale-105 ${
              selectedColor === color ? 'ring-2 ring-black ring-offset-2 scale-110' : ''
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onColorSelect(color)}
          />
        ))}
      </div>
    </div>
  );
};
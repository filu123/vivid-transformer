import { Button } from "@/components/ui/button";
import { Eraser, Save, X } from "lucide-react";

interface DrawingToolbarProps {
  isDrawingMode: boolean;
  onDrawingModeChange: (mode: boolean) => void;
  onSave: () => void;
  onClose: () => void;
}

export const DrawingToolbar = ({
  isDrawingMode,
  onDrawingModeChange,
  onSave,
  onClose,
}: DrawingToolbarProps) => {
  return (
    <div className="p-4 border-t">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDrawingModeChange(!isDrawingMode)}
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
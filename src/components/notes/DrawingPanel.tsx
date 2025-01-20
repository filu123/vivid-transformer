import { Button } from "@/components/ui/button";
import { Eraser, Undo2, Redo2, ThumbsUp } from "lucide-react";

export const DrawingPanel = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Drawing Area */}
      <div className="flex-1 border-b p-4">
        <div className="w-full h-full rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-muted-foreground">
          Drawing Canvas
        </div>
      </div>

      {/* Tools */}
      <div className="p-4 space-y-4">
        {/* Color Palette */}
        <div className="flex justify-center gap-2">
          {["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"].map(
            (color) => (
              <button
                key={color}
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            )
          )}
        </div>

        {/* Drawing Tools */}
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="icon">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Eraser className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ThumbsUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
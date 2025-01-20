import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eraser, Undo2, Redo2, X, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "fabric";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DrawingPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export const DrawingPanel = ({ isVisible, onClose }: DrawingPanelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const [title, setTitle] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!canvasRef.current || !isVisible) return;

    const canvas = new Canvas(canvasRef.current, {
      width: canvasRef.current.offsetWidth,
      height: window.innerHeight - 200,
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [isVisible]);

  const handleSave = async () => {
    if (!fabricCanvas || !title.trim()) {
      toast({
        title: "Error",
        description: "Please provide a title for your note",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      // Convert canvas to image
      const imageData = fabricCanvas.toDataURL({
        format: 'png',
        quality: 1,
      });

      // Convert base64 to blob
      const response = await fetch(imageData);
      const blob = await response.blob();

      // Upload to Supabase Storage
      const fileName = `${crypto.randomUUID()}.png`;
      const { error: uploadError, data } = await supabase.storage
        .from('note_images')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('note_images')
        .getPublicUrl(fileName);

      // Create note with drawing
      const { error } = await supabase.from("notes").insert({
        title,
        image_url: publicUrl,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your drawing has been saved",
      });

      setTitle("");
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the drawing. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex-1 mr-4">
          <Label htmlFor="title" className="sr-only">
            Title
          </Label>
          <Input
            id="title"
            placeholder="Enter note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Drawing Area */}
      <div className="flex-1 overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Tools */}
      <div className="p-4 border-t">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fabricCanvas?.undo()}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => fabricCanvas?.redo()}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (fabricCanvas) {
                  fabricCanvas.isDrawingMode = !fabricCanvas.isDrawingMode;
                }
              }}
            >
              <Eraser className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
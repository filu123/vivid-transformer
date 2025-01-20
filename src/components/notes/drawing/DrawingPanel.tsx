import { useState } from "react";
import { Canvas } from "fabric";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DrawingCanvas } from "./DrawingCanvas";
import { DrawingToolbar } from "./DrawingToolbar";

interface DrawingPanelProps {
  isVisible: boolean;
  onClose: () => void;
  existingNote?: {
    id: string;
    title: string;
    image_url: string;
  };
}

export const DrawingPanel = ({ isVisible, onClose, existingNote }: DrawingPanelProps) => {
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  const [title, setTitle] = useState(existingNote?.title || "");
  const [isDrawingMode, setIsDrawingMode] = useState(true);
  const { toast } = useToast();

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

      const imageData = fabricCanvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1
      });

      const response = await fetch(imageData);
      const blob = await response.blob();

      const fileName = `${crypto.randomUUID()}.png`;
      const { error: uploadError, data } = await supabase.storage
        .from('note_images')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('note_images')
        .getPublicUrl(fileName);

      if (existingNote) {
        const { error } = await supabase
          .from("notes")
          .update({
            title,
            image_url: publicUrl,
          })
          .eq('id', existingNote.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("notes").insert({
          title,
          image_url: publicUrl,
          user_id: user.id,
        });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: existingNote ? "Drawing updated successfully" : "Drawing saved successfully",
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
      <div className="p-4 border-b">
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

      <div className="flex-1 overflow-hidden">
        <DrawingCanvas
          existingImage={existingNote?.image_url}
          onCanvasReady={setFabricCanvas}
        />
      </div>

      <DrawingToolbar
        isDrawingMode={isDrawingMode}
        onDrawingModeChange={(mode) => {
          setIsDrawingMode(mode);
          if (fabricCanvas) {
            fabricCanvas.isDrawingMode = mode;
          }
        }}
        onSave={handleSave}
        onClose={onClose}
      />
    </div>
  );
};
import { useEffect, useRef } from "react";
import { Canvas, Image as FabricImage } from "fabric";
import { useToast } from "@/components/ui/use-toast";

interface DrawingCanvasProps {
  existingImage?: string;
  onCanvasReady: (canvas: Canvas) => void;
}

export const DrawingCanvas = ({ existingImage, onCanvasReady }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: canvasRef.current.offsetWidth,
      height: window.innerHeight - 200,
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    onCanvasReady(canvas);

    if (existingImage) {
      const loadImage = async () => {
        try {
          const img = await FabricImage.fromURL(existingImage);
          if (img) {
            canvas.backgroundImage = img;
            img.scaleToWidth(canvas.width!);
            img.scaleToHeight(canvas.height!);
            canvas.renderAll();
          }
        } catch (error) {
          console.error('Error loading image:', error);
          toast({
            title: "Error",
            description: "Failed to load the existing drawing",
            variant: "destructive",
          });
        }
      };
      loadImage();
    }

    return () => {
      canvas.dispose();
    };
  }, [existingImage]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};
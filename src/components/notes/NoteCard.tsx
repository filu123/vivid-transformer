// src/components/notes/NoteCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useRef, useEffect } from "react";
import { NoteFormDrawer } from "./NoteFormDrawer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { sanitizeHtml } from "@/lib/sanitizeHtml";

interface NoteCardProps {
  id: string;
  title: string;
  description?: string;
  date?: string;
  image_url?: string;
  background_color?: string;
  onNoteUpdated: () => void;
  onDrawingClick?: (note: { id: string; title: string; image_url: string; description?: string }) => void;
}

export const NoteCard = ({
  id,
  title,
  description,
  date,
  image_url,
  background_color = '#ff9b74',
  onNoteUpdated,
  onDrawingClick,
}: NoteCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isTitleTwoLines, setIsTitleTwoLines] = useState(false);

  useEffect(() => {
    if (titleRef.current) {
      const titleHeight = titleRef.current.offsetHeight;
      setIsTitleTwoLines(titleHeight > 28); // Assuming single line height is around 28px
    }
  }, [title]);

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from("notes").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Note deleted",
        description: "The note has been successfully deleted.",
      });

      onNoteUpdated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsEditModalOpen(true);
  };

  const handleImageClick = () => {
    if (onDrawingClick && image_url) {
      onDrawingClick({ id, title, image_url, description });
    }
  };

  return (
    <>
      <Card 
        className="min-h-[270px] max-h-[270px] transition-all duration-200 hover:scale-[1.02] cursor-pointer overflow-hidden"
        onClick={handleCardClick}
        style={{ backgroundColor: background_color }}
      >
        <CardContent className="p-6 h-full flex flex-col">
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-start">
              <h3 ref={titleRef} className="font-semibold text-xl line-clamp-2">{title}</h3>
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="bg-white p-4 rounded-full"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Delete Note"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this note.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            {image_url && (
              <div 
                className="relative w-full cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick();
                }}
              >
                <img
                  src={image_url}
                  alt={title}
                  className={`w-full object-cover rounded-md ${isTitleTwoLines ? 'h-32' : 'h-40'}`}
                />
              </div>
            )}
            {description && !image_url && (
              <div
                className="prose text-sm text-muted-foreground max-w-full line-clamp-4"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
              />
            )}
            {date && (
              <p className="text-sm text-black font-semibold mt-auto">
                {format(new Date(date), "MMM d")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <NoteFormDrawer
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editNote={{ id, title, description, date, image_url, background_color }}
        onNoteAdded={onNoteUpdated}
      />
    </>
  );
};
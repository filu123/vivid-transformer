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
import { useState, useMemo } from "react";
import { NoteFormDrawer } from "./NoteFormDrawer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { NoteDetailsDrawer } from "./NoteDetailsDrawer";

interface NoteCardProps {
  id: string;
  title: string;
  description?: string;
  date?: string;
  image_url?: string;
  onNoteUpdated: () => void;
  onDrawingClick?: (note: { id: string; title: string; image_url: string; description?: string }) => void;
}

export const NoteCard = ({
  id,
  title,
  description,
  date,
  image_url,
  onNoteUpdated,
  onDrawingClick,
}: NoteCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();

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
    // Prevent opening the drawer when clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsDetailsOpen(true);
  };

  // Deterministic background based on the note's ID
  const background = useMemo(() => {
    const backgrounds = [
      "bg-[#ff9b74]",
      "bg-[#ffc972]",
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % backgrounds.length;
    return backgrounds[index];
  }, [id]);

  const handleImageClick = () => {
    if (onDrawingClick && image_url) {
      onDrawingClick({ id, title, image_url, description });
    }
  };

  const cardHeight = image_url ? 'h-34' : 'h-34';

  return (
    <>
      <Card 
        className={`${background} ${cardHeight} min-h-[260px] max-h-[260px] transition-all duration-200 hover:scale-[1.02] cursor-pointer`}
        onClick={handleCardClick}
      >
        <CardContent className="p-6 h-full flex flex-col">
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-xl">{title}</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white p-4 rounded-full"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
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
                className="relative w-full h-24 cursor-pointer"
                onClick={handleImageClick}
              >
                <img
                  src={image_url}
                  alt={title}
                  className="absolute inset-0 w-24 h-24 object-cover rounded-md"
                />
              </div>
            )}
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {description}
              </p>
            )}
            {date && (
              <p className="text-sm text-muted-foreground mt-auto">
                {format(new Date(date), "MMM d, yyyy")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <NoteFormDrawer
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editNote={{ id, title, description, date, image_url }}
        onNoteAdded={onNoteUpdated}
      />

      <NoteDetailsDrawer
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        note={{ id, title, description, date, image_url }}
      />
    </>
  );
};
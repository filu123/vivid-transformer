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
import { useState } from "react";
import { NoteFormModal } from "./NoteFormModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface NoteCardProps {
  id: string;
  title: string;
  description?: string;
  date?: string;
  image_url?: string;
  onNoteUpdated: () => void;
  onDrawingClick?: (note: { id: string; title: string; image_url: string }) => void;
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

  const getRandomBackground = () => {
    const backgrounds = [
      "bg-card-yellow",
      "bg-card-blue",
      "bg-card-purple",
      "bg-card-green",
    ];
    return backgrounds[Math.floor(Math.random() * backgrounds.length)];
  };

  const handleImageClick = () => {
    if (onDrawingClick && image_url) {
      onDrawingClick({ id, title, image_url });
    }
  };

  return (
    <>
      <Card className={`${getRandomBackground()}`}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg">{title}</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
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
                className="relative w-full pt-[56.25%] cursor-pointer"
                onClick={handleImageClick}
              >
                <img
                  src={image_url}
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover rounded-md"
                />
              </div>
            )}
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {description}
              </p>
            )}
            {date && (
              <p className="text-sm text-muted-foreground">
                {format(new Date(date), "MMM d, yyyy")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <NoteFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editNote={{ id, title, description, date, image_url }}
        onNoteAdded={onNoteUpdated}
      />
    </>
  );
};
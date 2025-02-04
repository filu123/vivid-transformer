
// src/components/notes/NoteCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { NoteFormDrawer } from "./NoteFormDrawer";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NoteCardProps {
  id: string;
  title: string;
  description?: string;
  date?: string;
  image_url?: string;
  background_color?: string;
  onNoteUpdated: () => void;
}

export const NoteCard = ({
  id,
  title,
  description,
  date,
  image_url,
  background_color = '#ff9b74',
  onNoteUpdated,
}: NoteCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Note deleted successfully");
      onNoteUpdated();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  return (
    <>
      <Card
        className="min-h-[270px] max-h-[270px] transition-all duration-200 hover:scale-[1.02] cursor-pointer overflow-hidden"
        style={{ backgroundColor: background_color }}
        onClick={() => setIsDetailsOpen(true)}
      >
        <CardContent className="p-6 h-full flex flex-col">
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-xl">{title}</h3>
              <div className="flex gap-2">
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white p-4 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
              <div className="relative w-full">
                <img
                  src={image_url}
                  alt={title}
                  className="w-full h-32 object-cover rounded-md"
                />
              </div>
            )}

            {description && !image_url && (
              <p className="text-sm text-muted-foreground line-clamp-4">{description}</p>
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
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onNoteAdded={onNoteUpdated}
        initialData={{
          id,
          title,
          description,
          date,
          background_color,
          image_url
        }}
      />
    </>
  );
};

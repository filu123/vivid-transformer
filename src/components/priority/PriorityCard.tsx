import { useState } from "react";
import { Check, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PriorityFormModal } from "./PriorityFormModal";
import { PriorityDeleteDialog } from "./PriorityDeleteDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { CardAnimation } from "../notes/animations/CardAnimation";

interface PriorityCardProps {
  id: string;
  title: string;
  note?: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  isDone?: boolean;
  backgroundColor?: string;
  onPriorityUpdated?: () => void;
  index: number; // Added index prop
  onToggleDone: (id: string, newIsDone: boolean) => void; // New prop
}

export const PriorityCard = ({
  id,
  title,
  note,
  startTime,
  endTime,
  duration,
  isDone,
  backgroundColor = '#ff9b74',
  onPriorityUpdated,
  index, // Destructure index
  onToggleDone, // Destructure the new prop
}: PriorityCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleToggleDone = async () => {
    const newIsDone = !isDone;
    onToggleDone(id, newIsDone); // Optimistically update the parent state

    try {
      const { error } = await supabase
        .from("priorities")
        .update({ is_done: newIsDone })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: newIsDone ? "Priority completed" : "Priority unmarked",
        description: newIsDone
          ? "Priority has been marked as complete."
          : "Priority has been unmarked.",
      });
    } catch (error) {
      // Revert the change in case of an error
      onToggleDone(id, isDone);
      toast({
        title: "Error",
        description: "Failed to update the priority. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("priorities")
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Priority deleted",
        description: "The priority has been successfully deleted.",
      });
      
      onPriorityUpdated?.();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the priority. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <CardAnimation index={index}>
      <Card
        className={`min-h-[200px] max-h-[200px] transition-all duration-200 hover:scale-[1.02] cursor-pointer overflow-hidden p-6  ${isDone ? 'bg-green-50' : ''}`}
        style={{ backgroundColor }}
        onClick={() => setIsEditModalOpen(true)}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isDone}
              onCheckedChange={handleToggleDone}
              onClick={(e) => e.stopPropagation()}
              className="mt-1"
            />
            <div>
              <h3 className={`font-semibold text-xl ${isDone ? "line-through text-muted-foreground" : ""}`}>
                {title}
              </h3>
              {note && (
                <p className={`text-sm text-muted-foreground mt-2 ${isDone ? 'line-through' : ''}`}>
                  {note}
                </p>
              )}
              {(startTime || endTime) && (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{startTime}</span>
                  {endTime && (
                    <>
                      <span>-</span>
                      <span>{endTime}</span>
                    </>
                  )}
                  {duration && <span>({duration})</span>}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Edit button can be re-enabled if needed */}
            {/* <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditModalOpen(true);
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button> */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white rounded-full p-5"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <PriorityFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        selectedDate={new Date()}
        onPriorityAdded={onPriorityUpdated}
        editItem={{ 
          id, 
          title, 
          note, 
          type: "task" as const,
          startTime,
          endTime,
          isDone 
        }}
      />

      <PriorityDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </CardAnimation>
  );
};
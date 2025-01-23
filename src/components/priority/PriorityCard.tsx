import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PriorityFormModal } from "./PriorityFormModal";
import { PriorityActions } from "./PriorityActions";
import { PriorityDeleteDialog } from "./PriorityDeleteDialog";

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
}: PriorityCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleToggleDone = async () => {
    try {
      const { error } = await supabase
        .from("priorities")
        .update({ is_done: !isDone })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: isDone ? "Priority unmarked" : "Priority completed",
        description: isDone ? "Priority has been unmarked" : "Priority has been marked as complete",
      });
      
      onPriorityUpdated?.();
    } catch (error) {
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
    <>
      <Card className={`mb-4 ${isDone ? 'bg-green-50' : ''}`} style={{ backgroundColor }}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 ${isDone ? 'text-green-500' : ''}`}
                  onClick={handleToggleDone}
                >
                  <Check className={`h-4 w-4 ${isDone ? 'text-green-500' : 'text-gray-400'}`} />
                </Button>
                <h3 className={`font-medium ${isDone ? 'line-through text-gray-500' : ''}`}>
                  {title}
                </h3>
              </div>
              {note && (
                <p className={`mt-1 text-sm text-gray-500 ${isDone ? 'line-through' : ''}`}>
                  {note}
                </p>
              )}
              {(startTime || endTime) && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
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
            <PriorityActions
              onEdit={() => setIsEditModalOpen(true)}
              onDelete={() => setIsDeleteDialogOpen(true)}
            />
          </div>
        </CardContent>
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
    </>
  );
};
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { MoreVertical, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PriorityFormModal } from "./PriorityFormModal";

interface PriorityCardProps {
  id: string;
  title: string;
  note?: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  isDone?: boolean;
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
      <Card className={`mb-4 ${isDone ? 'bg-green-50' : ''}`}>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this priority.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
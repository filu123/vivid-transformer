import { Drawer } from "vaul";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { NoteForm } from "./form/NoteForm";
import { startOfDay } from "date-fns";

interface NoteFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNoteAdded: () => void;
  editNote?: {
    id: string;
    title: string;
    description?: string;
    date?: string;
    image_url?: string;
    background_color?: string;
    label_id?: string;
  };
  initialData?: {
    title: string;
    description?: string;
    background_color?: string;
  };
  isTaskMode?: boolean;
}

export const NoteFormDrawer = ({
  isOpen,
  onClose,
  onNoteAdded,
  editNote,
  initialData,
  isTaskMode = false,
}: NoteFormDrawerProps) => {
  const { toast } = useToast();

  const handleSubmit = async (formData: {
    title: string;
    description: string;
    date?: Date;
    image?: File;
    selectedColor: string;
    labelId?: string | null;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      let finalImageUrl = editNote?.image_url;
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('note_images')
          .upload(fileName, formData.image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('note_images')
          .getPublicUrl(fileName);

        finalImageUrl = publicUrl;
      }

      // Ensure date is set to start of day in local timezone
      const dateToStore = formData.date ? startOfDay(formData.date).toISOString().split('T')[0] : null;

      if (editNote) {
        const { error } = await supabase
          .from(isTaskMode ? "tasks_notes" : "notes")
          .update({
            title: formData.title,
            description: formData.description || null,
            date: dateToStore,
            image_url: finalImageUrl,
            background_color: formData.selectedColor,
            label_id: isTaskMode ? formData.labelId : undefined,
          })
          .eq('id', editNote.id);

        if (error) throw error;

        toast({
          title: `${isTaskMode ? "Task" : "Note"} updated successfully`,
          description: `Your ${isTaskMode ? "task" : "note"} has been updated.`,
        });
      } else {
        const { error } = await supabase
          .from(isTaskMode ? "tasks_notes" : "notes")
          .insert({
            title: formData.title,
            description: formData.description || null,
            date: dateToStore,
            image_url: finalImageUrl,
            background_color: formData.selectedColor,
            label_id: isTaskMode ? formData.labelId : undefined,
            user_id: user.id,
          });

        if (error) throw error;

        toast({
          title: `${isTaskMode ? "Task" : "Note"} added successfully`,
          description: `Your new ${isTaskMode ? "task" : "note"} has been created.`,
        });
      }

      onNoteAdded();
      onClose();
    } catch (error) {
      toast({
        title: editNote ? "Error updating note" : "Error adding note",
        description: "There was an error. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content 
          className={`bg-background flex flex-col rounded-t-[10px] fixed ${
            isTaskMode ? 'bottom-0 left-0 right-0 h-[85vh] mt-24' 
            : 'bottom-0 left-0 right-0 h-[85vh] mt-24'
          }`}
        >
          <div className={`p-4 bg-background rounded-t-[10px] flex-1 ${isTaskMode ? 'rounded-b-[10px]' : ''}`}>
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
            <div className="max-w-3xl mx-auto">
              <NoteForm
                onSubmit={handleSubmit}
                initialData={editNote || initialData}
                onClose={onClose}
                isTaskMode={isTaskMode}
              />
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
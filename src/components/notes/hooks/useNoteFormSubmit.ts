
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { startOfDay, format } from "date-fns";
import { FormSubmitData } from "../types/NoteFormTypes";

export const useNoteFormSubmit = (
  onNoteAdded: () => void,
  onClose: () => void,
  isReminderMode: boolean,
  isTaskMode: boolean,
  isEditing: boolean,
  initialId?: string
) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: FormSubmitData) => {
    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      let finalImageUrl = undefined;
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

      const dateToStore = formData.date 
        ? format(startOfDay(formData.date), 'yyyy-MM-dd')
        : null;

      if (isReminderMode) {
        if (isEditing) {
          const { error } = await supabase
            .from("reminders")
            .update({
              title: formData.title,
              due_date: formData.date ? formData.date.toISOString() : null,
              background_color: formData.selectedColor,
            })
            .eq('id', initialId);

          if (error) throw error;

          toast({
            title: "Reminder updated successfully",
            description: "Your reminder has been updated.",
          });
        } else {
          const { error } = await supabase
            .from("reminders")
            .insert({
              title: formData.title,
              due_date: formData.date ? formData.date.toISOString() : null,
              background_color: formData.selectedColor || null,
              user_id: user.id,
              category: 'all',
            });

          if (error) throw error;

          toast({
            title: "Reminder added successfully",
            description: "Your new reminder has been created.",
          });
        }
      } else if (isTaskMode) {
        if (isEditing) {
          const { error } = await supabase
            .from("tasks_notes")
            .update({
              title: formData.title,
              description: formData.description || null,
              date: dateToStore,
              background_color: formData.selectedColor,
              label_id: formData.labelId,
              frequency: formData.frequency,
              custom_days: formData.customDays,
            })
            .eq('id', initialId);

          if (error) throw error;

          toast({
            title: "Task updated successfully",
            description: "Your task has been updated.",
          });
        } else {
          const { error } = await supabase
            .from("tasks_notes")
            .insert({
              title: formData.title,
              description: formData.description || null,
              date: dateToStore,
              background_color: formData.selectedColor,
              label_id: formData.labelId,
              user_id: user.id,
              frequency: formData.frequency,
              custom_days: formData.customDays,
            });

          if (error) throw error;

          toast({
            title: "Task added successfully",
            description: "Your new task has been created.",
          });
        }
      } else {
        if (isEditing) {
          const { error } = await supabase
            .from("notes")
            .update({
              title: formData.title,
              description: formData.description || null,
              date: dateToStore,
              image_url: finalImageUrl,
              background_color: formData.selectedColor,
            })
            .eq('id', initialId);

          if (error) throw error;

          toast({
            title: "Note updated successfully",
            description: "Your note has been updated.",
          });
        } else {
          const { error } = await supabase
            .from("notes")
            .insert({
              title: formData.title,
              description: formData.description || null,
              date: dateToStore,
              image_url: finalImageUrl,
              background_color: formData.selectedColor,
              user_id: user.id,
            });

          if (error) throw error;

          toast({
            title: "Note added successfully",
            description: "Your new note has been created.",
          });
        }
      }

      onNoteAdded();
      onClose();
    } catch (error) {
      toast({
        title: isEditing ? "Error updating note" : "Error adding note",
        description: "There was an error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return { handleSubmit, isUploading };
};

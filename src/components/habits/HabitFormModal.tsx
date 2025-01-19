import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HabitTitleInput } from "./form/HabitTitleInput";
import { HabitDurationInput } from "./form/HabitDurationInput";
import { HabitFrequencySelect } from "./form/HabitFrequencySelect";
import { HabitDurationSelect } from "./form/HabitDurationSelect";

interface HabitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHabitAdded: () => void;
  editHabit?: {
    id: string;
    title: string;
    frequency: "daily" | "three_times" | "custom";
    custom_days?: number[];
    duration_months: number;
    duration_minutes: number;
  };
}

export const HabitFormModal = ({ isOpen, onClose, onHabitAdded, editHabit }: HabitFormModalProps) => {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "three_times" | "custom">("daily");
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [durationMinutes, setDurationMinutes] = useState<number>(0);

  useEffect(() => {
    if (editHabit) {
      setTitle(editHabit.title);
      setFrequency(editHabit.frequency);
      setCustomDays(editHabit.custom_days || []);
      setDurationMonths(editHabit.duration_months);
      setDurationMinutes(editHabit.duration_minutes || 0);
    } else {
      resetForm();
    }
  }, [editHabit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to create habits");
        return;
      }

      if (editHabit) {
        const { error } = await supabase
          .from("habits")
          .update({
            title,
            frequency,
            custom_days: frequency === "custom" ? customDays : null,
            duration_months: durationMonths,
            duration_minutes: durationMinutes,
          })
          .eq('id', editHabit.id);

        if (error) throw error;
        toast.success("Habit updated successfully!");
      } else {
        const { error } = await supabase.from("habits").insert({
          title,
          frequency,
          custom_days: frequency === "custom" ? customDays : null,
          duration_months: durationMonths,
          duration_minutes: durationMinutes,
          user_id: user.id
        });

        if (error) throw error;
        toast.success("Habit created successfully!");
      }

      onHabitAdded();
      resetForm();
    } catch (error) {
      console.error("Error creating/updating habit:", error);
      toast.error("Failed to save habit");
    }
  };

  const resetForm = () => {
    setTitle("");
    setFrequency("daily");
    setCustomDays([]);
    setDurationMonths(3);
    setDurationMinutes(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editHabit ? "Edit Habit" : "Create New Habit"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <HabitTitleInput title={title} setTitle={setTitle} />
          <HabitDurationInput 
            durationMinutes={durationMinutes} 
            setDurationMinutes={setDurationMinutes} 
          />
          <HabitFrequencySelect
            frequency={frequency}
            setFrequency={setFrequency}
            customDays={customDays}
            setCustomDays={setCustomDays}
          />
          <HabitDurationSelect
            durationMonths={durationMonths}
            setDurationMonths={setDurationMonths}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{editHabit ? "Update" : "Create"} Habit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
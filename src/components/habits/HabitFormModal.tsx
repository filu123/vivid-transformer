import { useState, useEffect } from "react";
import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HabitTitleInput } from "./form/HabitTitleInput";
import { HabitDurationInput } from "./form/HabitDurationInput";
import { HabitFrequencySelect } from "./form/HabitFrequencySelect";
import { HabitDurationSelect } from "./form/HabitDurationSelect";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "../notes/form/ColorPicker";

const COLORS = ['#ff9b74', '#fdc971', '#ebc49a', '#322a2f', '#c15626', '#ebe3d6', '#a2a8a5'];

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
    background_color?: string;
  };
}

export const HabitFormModal = ({ isOpen, onClose, onHabitAdded, editHabit }: HabitFormModalProps) => {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "three_times" | "custom">("daily");
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [durationMinutes, setDurationMinutes] = useState<number>(0);
  const [backgroundColor, setBackgroundColor] = useState(COLORS[0]);

  useEffect(() => {
    if (editHabit) {
      setTitle(editHabit.title);
      setFrequency(editHabit.frequency);
      setCustomDays(editHabit.custom_days || []);
      setDurationMonths(editHabit.duration_months);
      setDurationMinutes(editHabit.duration_minutes || 0);
      setBackgroundColor(editHabit.background_color || COLORS[0]);
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
            background_color: backgroundColor,
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
          background_color: backgroundColor,
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
    setBackgroundColor(COLORS[0]);
    onClose();
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] w-[70%] mx-auto fixed bottom-0 left-0 right-0 h-[85vh] mt-24">
          <div className="p-4 bg-background rounded-t-[10px] flex-1 ">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
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
              <div className="space-y-2">
                <Label>Color</Label>
                <ColorPicker
                  selectedColor={backgroundColor}
                  onColorChange={setBackgroundColor}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">{editHabit ? "Update" : "Create"} Habit</Button>
              </div>
            </form>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HabitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHabitAdded: () => void;
}

export const HabitFormModal = ({ isOpen, onClose, onHabitAdded }: HabitFormModalProps) => {
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "three_times" | "custom">("daily");
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [durationMonths, setDurationMonths] = useState<number>(3);

  const weekDays = [
    { label: "Sunday", value: 0 },
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to create habits");
        return;
      }

      const { error } = await supabase.from("habits").insert({
        title,
        frequency,
        custom_days: frequency === "custom" ? customDays : null,
        duration_months: durationMonths,
        user_id: user.id
      });

      if (error) throw error;

      toast.success("Habit created successfully!");
      onHabitAdded();
      resetForm();
    } catch (error) {
      console.error("Error creating habit:", error);
      toast.error("Failed to create habit");
    }
  };

  const resetForm = () => {
    setTitle("");
    setFrequency("daily");
    setCustomDays([]);
    setDurationMonths(3);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Frequency</Label>
            <RadioGroup value={frequency} onValueChange={(value: "daily" | "three_times" | "custom") => setFrequency(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">Daily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="three_times" id="three_times" />
                <Label htmlFor="three_times">Three times a week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">Custom</Label>
              </div>
            </RadioGroup>
          </div>

          {frequency === "custom" && (
            <div>
              <Label>Select Days</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {weekDays.map((day) => (
                  <div key={day.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day.value}`}
                      checked={customDays.includes(day.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setCustomDays([...customDays, day.value]);
                        } else {
                          setCustomDays(customDays.filter((d) => d !== day.value));
                        }
                      }}
                    />
                    <Label htmlFor={`day-${day.value}`}>{day.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label>Duration</Label>
            <RadioGroup value={String(durationMonths)} onValueChange={(value) => setDurationMonths(Number(value))}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="3months" />
                <Label htmlFor="3months">3 months</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="6" id="6months" />
                <Label htmlFor="6months">6 months</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="12" id="12months" />
                <Label htmlFor="12months">1 year</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Habit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
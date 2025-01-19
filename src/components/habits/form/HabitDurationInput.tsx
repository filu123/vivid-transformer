import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface HabitDurationInputProps {
  durationMinutes: number;
  setDurationMinutes: (duration: number) => void;
}

export const HabitDurationInput = ({ 
  durationMinutes, 
  setDurationMinutes 
}: HabitDurationInputProps) => {
  return (
    <div>
      <Label htmlFor="duration">Duration (minutes)</Label>
      <Input
        id="duration"
        type="number"
        min="0"
        value={durationMinutes}
        onChange={(e) => setDurationMinutes(Number(e.target.value))}
        required
      />
    </div>
  );
};
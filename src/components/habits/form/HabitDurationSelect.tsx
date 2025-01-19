import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface HabitDurationSelectProps {
  durationMonths: number;
  setDurationMonths: (months: number) => void;
}

export const HabitDurationSelect = ({
  durationMonths,
  setDurationMonths,
}: HabitDurationSelectProps) => {
  return (
    <div>
      <Label>Duration</Label>
      <RadioGroup 
        value={String(durationMonths)} 
        onValueChange={(value) => setDurationMonths(Number(value))}
      >
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
  );
};
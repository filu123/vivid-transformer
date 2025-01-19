import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface HabitFrequencySelectProps {
  frequency: "daily" | "three_times" | "custom";
  setFrequency: (frequency: "daily" | "three_times" | "custom") => void;
  customDays: number[];
  setCustomDays: (days: number[]) => void;
}

export const HabitFrequencySelect = ({
  frequency,
  setFrequency,
  customDays,
  setCustomDays,
}: HabitFrequencySelectProps) => {
  const weekDays = [
    { label: "Sunday", value: 0 },
    { label: "Monday", value: 1 },
    { label: "Tuesday", value: 2 },
    { label: "Wednesday", value: 3 },
    { label: "Thursday", value: 4 },
    { label: "Friday", value: 5 },
    { label: "Saturday", value: 6 },
  ];

  return (
    <div>
      <Label>Frequency</Label>
      <RadioGroup 
        value={frequency} 
        onValueChange={(value: "daily" | "three_times" | "custom") => setFrequency(value)}
      >
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

      {frequency === "custom" && (
        <div className="mt-4">
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
    </div>
  );
};
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PriorityTimeInputsProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (startTime: string) => void;
  onEndTimeChange: (endTime: string) => void;
}

export const PriorityTimeInputs = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
}: PriorityTimeInputsProps) => {
  return (
    <div className="flex space-x-4">
      <div className="space-y-2">
        <Label htmlFor="start-time">Start Time</Label>
        <Input
          type="time"
          id="start-time"
          value={startTime}
          onChange={(e) => onStartTimeChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="end-time">End Time</Label>
        <Input
          type="time"
          id="end-time"
          value={endTime}
          onChange={(e) => onEndTimeChange(e.target.value)}
        />
      </div>
    </div>
  );
};
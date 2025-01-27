import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PriorityStartTimeProps {
  startTime: string;
  onStartTimeChange: (startTime: string) => void;
}

export const PriorityStartTime = ({ startTime, onStartTimeChange }: PriorityStartTimeProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="start-time">Start Time</Label>
      <Input
        type="time"
        id="start-time"
        value={startTime}
        onChange={(e) => onStartTimeChange(e.target.value)}
      />
    </div>
  );
};
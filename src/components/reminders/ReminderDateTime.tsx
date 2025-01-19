import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ReminderDateTimeProps {
  date: Date | undefined;
  time: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

export const ReminderDateTime = ({
  date,
  time,
  onDateChange,
  onTimeChange,
}: ReminderDateTimeProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label>Due Date (Optional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <Label htmlFor="time">Time (Optional)</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            className="flex-1"
          />
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </>
  );
};
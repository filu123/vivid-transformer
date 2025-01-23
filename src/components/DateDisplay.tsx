import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Calendar as CalendarComponent } from "./ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

interface DateDisplayProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DateDisplay = ({ selectedDate, onDateChange }: DateDisplayProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[280px] justify-start text-left font-normal"
        >
          <Calendar className="mr-2 h-4 w-4" />
          {format(selectedDate, "PPP")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateChange(date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
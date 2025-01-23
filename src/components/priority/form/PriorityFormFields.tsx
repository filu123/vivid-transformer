import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ColorPicker } from "@/components/notes/form/ColorPicker";

interface PriorityFormFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  note: string;
  setNote: (note: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
}

export const PriorityFormFields = ({
  title,
  setTitle,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  note,
  setNote,
  backgroundColor,
  setBackgroundColor,
}: PriorityFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Name *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={70}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Color</Label>
        <ColorPicker
          selectedColor={backgroundColor}
          onColorChange={setBackgroundColor}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="note">Note</Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={100}
          className="resize-none"
        />
      </div>
    </div>
  );
};
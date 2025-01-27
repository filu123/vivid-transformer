import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ImageIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface NoteFormActionsProps {
  date?: Date;
  onDateChange: (date?: Date) => void;
  imageUrl: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  onClose: () => void;
  isEditing: boolean;
}

export const NoteFormActions = ({
  date,
  onDateChange,
  imageUrl,
  onImageChange,
  isUploading,
  onClose,
  isEditing,
}: NoteFormActionsProps) => {
  return (
    <>
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "pl-0 text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Add date"}
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

        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
            id="image-upload"
          />
          <Button
            variant="ghost"
            className="pl-0"
            onClick={() => document.getElementById('image-upload')?.click()}
            type="button"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            {imageUrl ? "Change image" : "Add image"}
          </Button>
        </div>
      </div>

      {imageUrl && (
        <div className="mt-2">
          <img
            src={imageUrl}
            alt="Preview"
            className="max-h-48 rounded-md object-cover"
          />
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isUploading}>
          {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {!isEditing ? "Confirm" : "Confirm"} 
        </Button>
      </div>
    </>
  );
};
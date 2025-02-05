
import { useState } from "react";
import { ColorPicker } from "./ColorPicker";
import { TaskLabelSelect } from "./TaskLabelSelect";
import { NoteFormTitle } from "./NoteFormTitle";
import { NoteFormDescription } from "./NoteFormDescription";
import { NoteFormActions } from "./NoteFormActions";
import { useToast } from "@/hooks/use-toast";
import { HabitFrequencySelect } from "@/components/habits/form/HabitFrequencySelect";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Repeat } from "lucide-react";

interface NoteFormProps {
  onSubmit: (formData: {
    title: string;
    description: string;
    date?: Date;
    image?: File;
    selectedColor: string;
    labelId?: string | null;
    frequency?: "daily" | "three_times" | "custom" | null;
    customDays?: number[];
  }) => Promise<void>;
  initialData?: {
    id?: string;
    title: string;
    description?: string;
    date?: string;
    image_url?: string;
    background_color?: string;
    label_id?: string;
    frequency?: "daily" | "three_times" | "custom" | null;
    custom_days?: number[];
  };
  onClose: () => void;
  isTaskMode?: boolean;
  isReminderMode?: boolean;
}

export const NoteForm = ({ onSubmit, initialData, onClose, isTaskMode = false, isReminderMode = false }: NoteFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [date, setDate] = useState<Date | undefined>(
    initialData?.date ? new Date(initialData.date) : undefined
  );
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(initialData?.background_color || '#ff9b74');
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(initialData?.label_id || null);
  const [frequency, setFrequency] = useState<"daily" | "three_times" | "custom" | null>(
    initialData?.frequency || null
  );
  const [customDays, setCustomDays] = useState<number[]>(initialData?.custom_days || []);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      await onSubmit({
        title,
        description,
        date,
        image: image || undefined,
        selectedColor,
        labelId: isTaskMode ? selectedLabelId : undefined,
        frequency: isTaskMode ? frequency : undefined,
        customDays: isTaskMode ? customDays : undefined,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getFrequencyLabel = () => {
    switch (frequency) {
      case "daily":
        return "Daily";
      case "three_times":
        return "Three times a week";
      case "custom":
        return "Custom days";
      default:
        return "Add frequency";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <NoteFormTitle initialTitle={title} onTitleChange={setTitle} />
      
      {!isReminderMode && (
        <NoteFormDescription initialDescription={description} onDescriptionChange={setDescription} />
      )}

      {isTaskMode && (
        <div className="space-y-4">
          <TaskLabelSelect 
            selectedLabelId={selectedLabelId} 
            onLabelSelect={setSelectedLabelId} 
          />
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[200px] justify-start"
              >
                <Repeat className="mr-2 h-4 w-4" />
                {getFrequencyLabel()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-4">
              <HabitFrequencySelect
                frequency={frequency}
                setFrequency={setFrequency}
                customDays={customDays}
                setCustomDays={setCustomDays}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      <div className="space-y-4">
        <ColorPicker selectedColor={selectedColor} onColorChange={setSelectedColor} />

        <NoteFormActions
          date={date}
          onDateChange={setDate}
          imageUrl={imageUrl}
          onImageChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size > 4 * 1024 * 1024) {
                toast({
                  title: "Error",
                  description: "Image size must be less than 4MB",
                  variant: "destructive",
                });
                return;
              }
              setImage(file);
              setImageUrl(URL.createObjectURL(file));
            }
          }}
          isUploading={isUploading}
          onClose={onClose}
          isEditing={!!initialData?.id}
        />
      </div>
    </form>
  );
};

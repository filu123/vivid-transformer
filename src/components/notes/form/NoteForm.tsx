import { useState } from "react";
import { ColorPicker } from "./ColorPicker";
import { TaskLabelSelect } from "./TaskLabelSelect";
import { NoteFormTitle } from "./NoteFormTitle";
import { NoteFormDescription } from "./NoteFormDescription";
import { NoteFormActions } from "./NoteFormActions";
import { useToast } from "@/hooks/use-toast";

interface NoteFormProps {
  onSubmit: (formData: {
    title: string;
    description: string;
    date?: Date;
    image?: File;
    selectedColor: string;
    labelId?: string | null;
  }) => Promise<void>;
  initialData?: {
    title: string;
    description?: string;
    date?: string;
    image_url?: string;
    background_color?: string;
    label_id?: string;
  };
  onClose: () => void;
  isTaskMode?: boolean;
}

export const NoteForm = ({ onSubmit, initialData, onClose, isTaskMode = false }: NoteFormProps) => {
  const { toast } = useToast();
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

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
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <NoteFormTitle initialTitle={title} onTitleChange={setTitle} />
      <NoteFormDescription initialDescription={description} onDescriptionChange={setDescription} />

      <div className="space-y-4">
        {isTaskMode && (
          <TaskLabelSelect
            selectedLabelId={selectedLabelId}
            onSelectLabel={setSelectedLabelId}
          />
        )}

        <ColorPicker selectedColor={selectedColor} onColorChange={setSelectedColor} />

        <NoteFormActions
          date={date}
          onDateChange={setDate}
          imageUrl={imageUrl}
          onImageChange={handleImageChange}
          isUploading={isUploading}
          onClose={onClose}
          isEditing={!!initialData?.title}
        />
      </div>
    </form>
  );
};
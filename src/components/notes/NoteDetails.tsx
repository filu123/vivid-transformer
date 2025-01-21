import { format } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Note {
  id: string;
  title: string;
  description?: string;
  date?: string;
  image_url?: string;
  background_color?: string;
}

interface NoteDetailsProps {
  note: Note;
  onUpdate: (updatedNote: Note) => void;
}

export const NoteDetails = ({ note, onUpdate }: NoteDetailsProps) => {
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description || "");

  const handleTitleChange = (e: React.FormEvent<HTMLDivElement>) => {
    setTitle(e.currentTarget.textContent || "");
  };

  const handleDescriptionChange = (e: React.FormEvent<HTMLDivElement>) => {
    setDescription(e.currentTarget.textContent || "");
  };

  const handleSave = () => {
    onUpdate({ ...note, title, description });
    // Optionally, you can add API calls here to save the updates
  };

  return (
    <div className="space-y-6">
      {/* Inline Editable Title */}
      <div
        contentEditable
        suppressContentEditableWarning
        className="text-2xl font-semibold border-b border-gray-300 focus:outline-none px-0 placeholder:text-muted-foreground/50"
        onInput={handleTitleChange}
        style={{ minHeight: '2em' }}
      >
        {title || "Title"}
      </div>
      
      {/* Inline Editable Description */}
      <div
        contentEditable
        suppressContentEditableWarning
        className="min-h-[100px] resize-none border-b border-gray-300 focus:outline-none px-0 placeholder:text-muted-foreground/50"
        onInput={handleDescriptionChange}
      >
        {description || "Write something..."}
      </div>

      {note.image_url && (
        <img
          src={note.image_url}
          alt={note.title}
          className="w-full max-w-2xl rounded-lg object-cover"
        />
      )}
      
      {note.date && (
        <p className="text-sm text-muted-foreground">
          {format(new Date(note.date), "PPP")}
        </p>
      )}

      <Button onClick={handleSave} variant="default">
        Save
      </Button>
    </div>
  );
};
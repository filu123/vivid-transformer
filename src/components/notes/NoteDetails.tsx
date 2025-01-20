import { format } from "date-fns";

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
}

export const NoteDetails = ({ note }: NoteDetailsProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{note.title}</h2>
      
      {note.description && (
        <p className="text-muted-foreground whitespace-pre-wrap">{note.description}</p>
      )}
      
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
    </div>
  );
};
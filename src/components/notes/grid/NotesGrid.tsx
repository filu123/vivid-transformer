import { NoteCard } from "@/components/notes/NoteCard";

interface Note {
  id: string;
  title: string;
  description?: string;
  date?: string;
  image_url?: string;
  background_color?: string;
}

interface NotesGridProps {
  notes: Note[];
  onNoteUpdated: () => void;
}

export const NotesGrid = ({ notes, onNoteUpdated }: NotesGridProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
      {notes?.map((note, index) => (
        <div 
          key={note.id}
          className="animate-spring-in"
          style={{
            animationDelay: `${index * 0.05}s`,
            animationFillMode: 'backwards'
          }}
        >
          <NoteCard
            id={note.id}
            title={note.title}
            description={note.description}
            date={note.date}
            image_url={note.image_url}
            background_color={note.background_color}
            onNoteUpdated={onNoteUpdated}
          />
        </div>
      ))}
    </div>
  );
};
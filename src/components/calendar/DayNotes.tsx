import { Card } from "@/components/ui/card";

interface Note {
  id: string;
  title: string;
  description?: string;
}

interface DayNotesProps {
  notes: Note[];
}

export const DayNotes = ({ notes }: DayNotesProps) => {
  if (notes.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Notes</h3>
      {notes.map((note) => (
        <Card key={note.id} className="p-4 mb-4">
          <h4 className="font-medium">{note.title}</h4>
          {note.description && (
            <p className="text-sm text-gray-600 mt-2">{note.description}</p>
          )}
        </Card>
      ))}
    </div>
  );
};
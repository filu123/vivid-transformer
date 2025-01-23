import { NoteColorFilters } from "@/components/notes/filters/NoteColorFilters";
import { NotesGrid } from "@/components/notes/grid/NotesGrid";

interface NotesSectionProps {
  notes: any[];
  selectedColor: string | null;
  onColorSelect: (color: string | null) => void;
  onNotesUpdated: () => void;
}

export const NotesSection = ({
  notes,
  selectedColor,
  onColorSelect,
  onNotesUpdated,
}: NotesSectionProps) => {
  const filteredNotes = selectedColor
    ? notes?.filter((note) => note.background_color === selectedColor)
    : notes;

  return (
    <div className="animate-fade-in">
      <NoteColorFilters
        colors={[
          "#ff9b74",
          "#fdc971",
          "#ebc49a",
          "#322a2f",
          "#c15626",
          "#ebe3d6",
          "#a2a8a5",
        ]}
        selectedColor={selectedColor}
        onColorSelect={onColorSelect}
        notesCount={filteredNotes?.length || 0}
      />
      <NotesGrid notes={filteredNotes || []} onNoteUpdated={onNotesUpdated} />
    </div>
  );
};
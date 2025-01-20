import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NoteCard } from "@/components/notes/NoteCard";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { NoteFormModal } from "@/components/notes/NoteFormModal";
import { Input } from "@/components/ui/input";
import { NoteDetails } from "@/components/notes/NoteDetails";

const Notes = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<{
    id: string;
    title: string;
    description?: string;
    date?: string;
  } | null>(null);

  const { data: notes, refetch } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredNotes = notes?.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex">
      {/* Left column - Note list */}
      <div className="w-[400px] min-w-[400px] border-r bg-muted/20">
        <div className="p-6 space-y-6">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold">Notes</h1>
              <Button onClick={() => setIsAddModalOpen(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search notes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            {filteredNotes?.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className="cursor-pointer"
              >
                <NoteCard
                  id={note.id}
                  title={note.title}
                  description={note.description}
                  date={note.date}
                  onNoteUpdated={refetch}
                  isSelected={selectedNote?.id === note.id}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column - Note details */}
      <div className="flex-1 bg-white">
        {selectedNote ? (
          <NoteDetails
            id={selectedNote.id}
            title={selectedNote.title}
            description={selectedNote.description}
            date={selectedNote.date}
            onNoteUpdated={refetch}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select a note to view details
          </div>
        )}
      </div>

      <NoteFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onNoteAdded={refetch}
      />
    </div>
  );
};

export default Notes;
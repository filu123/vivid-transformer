import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NoteCard } from "@/components/notes/NoteCard";
import { Button } from "@/components/ui/button";
import { FileText, Image, PenTool } from "lucide-react";
import { useState } from "react";
import { NoteFormModal } from "@/components/notes/NoteFormModal";
import { Input } from "@/components/ui/input";
import { DrawingPanel } from "@/components/notes/DrawingPanel";

const Notes = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  return (
    <div className="flex h-full">
      {/* Left section - 70% */}
      <div className="w-[70%] p-8 overflow-y-auto">
        {/* New Note Cards */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <Button
            variant="outline"
            className="h-32 flex flex-col items-center justify-center gap-3 border-2 border-dashed hover:border-primary hover:bg-accent/50"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FileText className="h-8 w-8" />
            <span>Take a Note</span>
          </Button>
          <Button
            variant="outline"
            className="h-32 flex flex-col items-center justify-center gap-3 border-2 border-dashed hover:border-primary hover:bg-accent/50"
          >
            <PenTool className="h-8 w-8" />
            <span>With Drawing</span>
          </Button>
          <Button
            variant="outline"
            className="h-32 flex flex-col items-center justify-center gap-3 border-2 border-dashed hover:border-primary hover:bg-accent/50"
          >
            <Image className="h-8 w-8" />
            <span>With Image</span>
          </Button>
        </div>

        {/* All Notes Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">All Notes</h2>
            <span className="text-sm text-muted-foreground">
              {notes?.length || 0} Notes
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {notes?.map((note) => (
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

      {/* Right section - 30% */}
      <div className="w-[30%] border-l bg-white">
        <DrawingPanel />
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
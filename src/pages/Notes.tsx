import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NoteCard } from "@/components/notes/NoteCard";
import { Button } from "@/components/ui/button";
import { FileText, Image, PenTool } from "lucide-react";
import { useState } from "react";
import { NoteFormModal } from "@/components/notes/NoteFormModal";
import { DrawingPanel } from "@/components/notes/drawing/DrawingPanel";

const Notes = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState<{
    id: string;
    title: string;
    image_url: string;
    description?: string;
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

  const handleDrawingClick = (note: { 
    id: string; 
    title: string; 
    image_url: string;
    description?: string;
  }) => {
    setSelectedDrawing(note);
    setIsDrawingMode(true);
  };

  return (
    <div className="relative min-h-screen">
      {/* Main content */}
      <div className="p-8">
        {/* New Note Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
            onClick={() => {
              setSelectedDrawing(null);
              setIsDrawingMode(true);
            }}
          >
            <PenTool className="h-8 w-8" />
            <span>With Drawing</span>
          </Button>
          <Button
            variant="outline"
            className="h-32 flex flex-col items-center justify-center gap-3 border-2 border-dashed hover:border-primary hover:bg-accent/50"
            onClick={() => {
              setIsAddModalOpen(true);
            }}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes?.map((note) => (
              <div key={note.id}>
                <NoteCard
                  id={note.id}
                  title={note.title}
                  description={note.description}
                  date={note.date}
                  image_url={note.image_url}
                  onNoteUpdated={refetch}
                  onDrawingClick={handleDrawingClick}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drawing Panel - Slide in from right when active */}
      {isDrawingMode && (
        <div className="fixed inset-y-0 right-0 w-[600px] bg-background border-l shadow-xl">
          <DrawingPanel 
            isVisible={isDrawingMode} 
            onClose={() => {
              setIsDrawingMode(false);
              setSelectedDrawing(null);
              refetch();
            }}
            existingNote={selectedDrawing}
          />
        </div>
      )}

      <NoteFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onNoteAdded={refetch}
      />
    </div>
  );
};

export default Notes;
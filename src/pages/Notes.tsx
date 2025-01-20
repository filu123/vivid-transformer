import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NoteCard } from "@/components/notes/NoteCard";
import { Button } from "@/components/ui/button";
import { FileText, Image, PenTool } from "lucide-react";
import { useState } from "react";
import { NoteFormDrawer } from "@/components/notes/NoteFormDrawer";
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
    <div className="relative min-h-screen container mx-auto">
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <Button
            variant="ghost"
            className="h-20 flex items-center justify-start p-4 bg-white hover:bg-accent/50"
            onClick={() => setIsAddModalOpen(true)}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-[#f3f3f3] rounded-full p-3 flex-shrink-0">
                <FileText className="h-6 w-6 text-black" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">New Note</p>
                <h3 className="text-lg font-semibold">Take a Note</h3>
              </div>
            </div>
          </Button>
          
          <Button
            variant="ghost"
            className="h-20 flex items-center justify-start p-4 bg-white hover:bg-accent/50"
            onClick={() => {
              setSelectedDrawing(null);
              setIsDrawingMode(true);
            }}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-[#f3f3f3] rounded-full p-3 flex-shrink-0">
                <PenTool className="h-6 w-6 text-black" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">New Note</p>
                <h3 className="text-lg font-semibold">With Drawing</h3>
              </div>
            </div>
          </Button>
          
          <Button
            variant="ghost"
            className="h-20 flex items-center justify-start p-4 bg-white hover:bg-accent/50"
            onClick={() => setIsAddModalOpen(true)}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-[#f3f3f3] rounded-full p-3 flex-shrink-0">
                <Image className="h-6 w-6 text-black" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">New Note</p>
                <h3 className="text-lg font-semibold">With Image</h3>
              </div>
            </div>
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg md:text-xl font-semibold">All Notes</h2>
            <span className="text-sm text-muted-foreground">
              {notes?.length || 0} Notes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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

      {isDrawingMode && (
        <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-background border-l shadow-xl z-50">
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

      <NoteFormDrawer
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onNoteAdded={refetch}
      />
    </div>
  );
};

export default Notes;
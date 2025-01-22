import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NoteCard } from "@/components/notes/NoteCard";
import { Button } from "@/components/ui/button";
import { FileText, ListTodo, Bell, PenTool } from "lucide-react";
import { useState } from "react";
import { NoteFormDrawer } from "@/components/notes/NoteFormDrawer";
import { DrawingPanel } from "@/components/notes/drawing/DrawingPanel";
import { Drawer } from "vaul";
import { ReminderFormModal } from "@/components/reminders/ReminderFormModal";
import { useRef } from "react";

const COLORS = [
  '#ff9b74',
  '#fdc971',
  '#ebc49a',
  '#322a2f',
  '#c15626',
  '#ebe3d6',
  '#a2a8a5'
];

const Notes = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isTaskMode, setIsTaskMode] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);

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

  const filteredNotes = selectedColor 
    ? notes?.filter(note => note.background_color === selectedColor)
    : notes;

  return (
    <div className="relative min-h-screen container mx-auto">
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          <Button
            variant="ghost"
            className="h-20 flex items-center justify-start p-4 bg-white hover:bg-accent/50"
            onClick={() => {
              setIsTaskMode(false);
              setIsAddModalOpen(true);
            }}
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
              setIsTaskMode(true);
              setIsAddModalOpen(true);
            }}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-[#f3f3f3] rounded-full p-3 flex-shrink-0">
                <ListTodo className="h-6 w-6 text-black" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">New Task</p>
                <h3 className="text-lg font-semibold">Add Task</h3>
              </div>
            </div>
          </Button>

          <Button
            variant="ghost"
            className="h-20 flex items-center justify-start p-4 bg-white hover:bg-accent/50"
            onClick={() => setIsReminderModalOpen(true)}
            ref={addButtonRef}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-[#f3f3f3] rounded-full p-3 flex-shrink-0">
                <Bell className="h-6 w-6 text-black" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">New Reminder</p>
                <h3 className="text-lg font-semibold">Add Reminder</h3>
              </div>
            </div>
          </Button>
          
          <Button
            variant="ghost"
            className="h-20 flex items-center justify-start p-4 bg-white hover:bg-accent/50"
            onClick={() => setIsDrawingMode(true)}
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
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedColor(null)}
                className="text-lg md:text-xl font-semibold hover:opacity-80 transition-opacity"
              >
                All Notes
              </button>
              <div className="flex items-center gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                    className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${
                      selectedColor === color ? 'ring-2 ring-offset-2 ring-black scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <span className="text-sm text-muted-foreground">
              {filteredNotes?.length || 0} Notes
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
            {filteredNotes?.map((note, index) => (
              <div 
                key={note.id}
                className="animate-fade-in"
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
                  onNoteUpdated={refetch}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Drawer.Root open={isDrawingMode} onOpenChange={setIsDrawingMode}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0 h-[85vh]">
            <DrawingPanel
              isVisible={isDrawingMode}
              onClose={() => {
                setIsDrawingMode(false);
                refetch();
              }}
            />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <NoteFormDrawer
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsTaskMode(false);
        }}
        onNoteAdded={refetch}
        initialData={{
          title: isTaskMode ? "New Task" : "New Note",
          description: isTaskMode ? "Task details..." : "Start writing your thoughts here...",
          background_color: '#ff9b74'
        }}
        isTaskMode={isTaskMode}
      />

      <ReminderFormModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        triggerRef={addButtonRef}
      />
    </div>
  );
};

export default Notes;
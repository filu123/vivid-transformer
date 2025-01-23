import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NoteFormDrawer } from "@/components/notes/NoteFormDrawer";
import { DrawingPanel } from "@/components/notes/drawing/DrawingPanel";
import { Drawer } from "vaul";
import { ReminderFormModal } from "@/components/reminders/ReminderFormModal";
import { NoteActionButtons } from "@/components/notes/actions/NoteActionButtons";
import { NoteColorFilters } from "@/components/notes/filters/NoteColorFilters";
import { NotesGrid } from "@/components/notes/grid/NotesGrid";
import { ContentTypeFilter } from "@/components/notes/filters/ContentTypeFilter";
import { TasksSection } from "@/components/notes/sections/TasksSection";

type ContentType = "notes" | "tasks" | "reminders";

const Notes = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isTaskMode, setIsTaskMode] = useState(false);
  const [selectedType, setSelectedType] = useState<ContentType>("notes");
  const addButtonRef = useRef<HTMLButtonElement>(null);

  const { data: notes, refetch: refetchNotes } = useQuery({
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
    ? notes?.filter((note) => note.background_color === selectedColor)
    : notes;

  const renderContent = () => {
    switch (selectedType) {
      case "tasks":
        return (
          <TasksSection
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />
        );
      case "reminders":
        return (
          <RemindersSection
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />
        );
      default:
        return (
          <>
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
              onColorSelect={setSelectedColor}
              notesCount={filteredNotes?.length || 0}
            />
            <NotesGrid notes={filteredNotes || []} onNoteUpdated={refetchNotes} />
          </>
        );
    }
  };

  return (
    <div className="relative min-h-screen container mx-auto">
      <div className="space-y-6">
        <ContentTypeFilter
          selectedType={selectedType}
          onTypeSelect={setSelectedType}
        />

        <NoteActionButtons
          onNoteClick={() => {
            setIsTaskMode(false);
            setIsAddModalOpen(true);
          }}
          onTaskClick={() => {
            setIsTaskMode(true);
            setIsAddModalOpen(true);
          }}
          onReminderClick={() => setIsReminderModalOpen(true)}
          onDrawingClick={() => setIsDrawingMode(true)}
          addButtonRef={addButtonRef}
        />

        {renderContent()}
      </div>

      <Drawer.Root open={isDrawingMode} onOpenChange={setIsDrawingMode}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 h-[85vh]">
            <DrawingPanel
              isVisible={isDrawingMode}
              onClose={() => {
                setIsDrawingMode(false);
                refetchNotes();
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
        onNoteAdded={refetchNotes}
        initialData={{
          title: isTaskMode ? "New Task" : "New Note",
          description: isTaskMode
            ? "Task details..."
            : "Start writing your thoughts here...",
          background_color: "#ff9b74",
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

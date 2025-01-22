import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NoteFormDrawer } from "@/components/notes/NoteFormDrawer";
import { DrawingPanel } from "@/components/notes/drawing/DrawingPanel";
import { Drawer } from "vaul";
import { ReminderFormModal } from "@/components/reminders/ReminderFormModal";
import { NoteActionButtons } from "@/components/notes/actions/NoteActionButtons";
import { NoteColorFilters } from "@/components/notes/filters/NoteColorFilters";
import { NotesGrid } from "@/components/notes/grid/NotesGrid";
import { ContentTypeFilter } from "@/components/notes/filters/ContentTypeFilter";
import { TaskCard } from "@/components/notes/cards/TaskCard";
import { ReminderCard } from "@/components/notes/cards/ReminderCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COLORS = [
  '#ff9b74',
  '#fdc971',
  '#ebc49a',
  '#322a2f',
  '#c15626',
  '#ebe3d6',
  '#a2a8a5'
];

type ContentType = "notes" | "tasks" | "reminders";

const Notes = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
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

  const { data: tasks, refetch: refetchTasks } = useQuery({
    queryKey: ["tasks_notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks_notes")
        .select("*, task_labels(name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: reminders, refetch: refetchReminders } = useQuery({
    queryKey: ["reminders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: labels } = useQuery({
    queryKey: ["task_labels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("task_labels")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredNotes = selectedColor 
    ? notes?.filter(note => note.background_color === selectedColor)
    : notes;

  const filteredTasks = tasks?.filter(task => {
    if (selectedColor && task.background_color !== selectedColor) return false;
    if (selectedLabelId && task.label_id !== selectedLabelId) return false;
    return true;
  });

  const filteredReminders = selectedColor
    ? reminders?.filter(reminder => reminder.background_color === selectedColor)
    : reminders;

  const renderContent = () => {
    switch (selectedType) {
      case "tasks":
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <NoteColorFilters
                colors={COLORS}
                selectedColor={selectedColor}
                onColorSelect={setSelectedColor}
                notesCount={filteredTasks?.length || 0}
              />
              <Select
                value={selectedLabelId || "all"}
                onValueChange={(value) => setSelectedLabelId(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by label" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All labels</SelectItem>
                  {labels?.map((label) => (
                    <SelectItem key={label.id} value={label.id}>
                      {label.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
              {filteredTasks?.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onUpdate={refetchTasks}
                />
              ))}
            </div>
          </>
        );
      case "reminders":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
            {filteredReminders?.map((reminder) => (
              <ReminderCard 
                key={reminder.id} 
                reminder={reminder} 
                onUpdate={refetchReminders}
              />
            ))}
          </div>
        );
      default:
        return (
          <>
            <NoteColorFilters
              colors={COLORS}
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
              notesCount={filteredNotes?.length || 0}
            />
            <NotesGrid
              notes={filteredNotes || []}
              onNoteUpdated={refetchNotes}
            />
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
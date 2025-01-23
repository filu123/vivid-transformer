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
import { ReminderCard } from "@/components/notes/cards/ReminderCard";
import { TasksSection } from "@/components/notes/sections/TasksSection";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, CheckSquare, ListTodo } from "lucide-react";

type ContentType = "notes" | "tasks" | "reminders";
type ReminderCategory = "all" | "today" | "scheduled" | "completed";

const Notes = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isTaskMode, setIsTaskMode] = useState(false);
  const [selectedType, setSelectedType] = useState<ContentType>("notes");
  const [reminderCategory, setReminderCategory] = useState<ReminderCategory>("all");
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

  const filteredNotes = selectedColor 
    ? notes?.filter(note => note.background_color === selectedColor)
    : notes;

  const filteredReminders = selectedColor
    ? reminders?.filter(reminder => reminder.background_color === selectedColor)
    : reminders;

  const categorizedReminders = filteredReminders?.filter(reminder => {
    switch (reminderCategory) {
      case "completed":
        return reminder.is_completed;
      case "today":
        return !reminder.is_completed && reminder.category === "today";
      case "scheduled":
        return !reminder.is_completed && reminder.category === "scheduled";
      default:
        return !reminder.is_completed;
    }
  });

  const categories = [
    {
      id: "all",
      name: "All",
      count: reminders?.filter((r) => !r.is_completed).length || 0,
      icon: ListTodo,
      color: "bg-card-yellow",
    },
    {
      id: "today",
      name: "Today",
      count: reminders?.filter((r) => !r.is_completed && r.category === "today").length || 0,
      icon: Calendar,
      color: "bg-card-blue",
    },
    {
      id: "scheduled",
      name: "Scheduled",
      count: reminders?.filter((r) => !r.is_completed && r.category === "scheduled").length || 0,
      icon: Bell,
      color: "bg-card-purple",
    },
    {
      id: "completed",
      name: "Completed",
      count: reminders?.filter((r) => r.is_completed).length || 0,
      icon: CheckSquare,
      color: "bg-card-green",
    },
  ];

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
          <>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <NoteColorFilters
                  colors={['#F2FCE2', '#FEF7CD', '#FEC6A1', '#9b87f5', '#7E69AB', '#6E59A5', '#8E9196']}
                  selectedColor={selectedColor}
                  onColorSelect={setSelectedColor}
                  notesCount={categorizedReminders?.length || 0}
                  title="All reminders"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    className={`h-24 flex items-center justify-start p-4 ${category.color} hover:opacity-90 ${
                      reminderCategory === category.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setReminderCategory(category.id as ReminderCategory)}
                  >
                    <div className="flex items-center space-x-4 w-full">
                      <div className="bg-white/80 rounded-full p-3">
                        <category.icon className="h-6 w-6 text-black" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-left">{category.name}</h3>
                        <p className="text-sm text-muted-foreground text-left">
                          {category.count} tasks
                        </p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                {categorizedReminders?.map((reminder) => (
                  <ReminderCard 
                    key={reminder.id} 
                    reminder={reminder} 
                    onUpdate={refetchReminders}
                  />
                ))}
              </div>
            </div>
          </>
        );
      default:
        return (
          <>
            <NoteColorFilters
              colors={['#ff9b74', '#fdc971', '#ebc49a', '#322a2f', '#c15626', '#ebe3d6', '#a2a8a5']}
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

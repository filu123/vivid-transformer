import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { NoteFormDrawer } from "./notes/NoteFormDrawer";
import { HabitFormModal } from "./habits/HabitFormModal";
import { ReminderFormModal } from "./reminders/ReminderFormModal";
import { UserProfile } from "./header/UserProfile";
import { SearchBar } from "./header/SearchBar";
import { MobileMenu } from "./header/MobileMenu";
import { ActionButtons } from "./header/ActionButtons";

interface HeaderProps {
  onViewChange?: React.Dispatch<React.SetStateAction<"today" | "calendar">>;
  activeView?: "today" | "calendar";
}

interface InitialNoteData {
  title: string;
  description?: string;
  background_color?: string;
}

interface InitialHabitData {
  name: string;
  frequency: string;
}

interface InitialReminderData {
  message: string;
  time: string;
}

export const Header = ({ onViewChange, activeView }: HeaderProps) => {
  const isMobile = useIsMobile();

  // State for NoteFormDrawer
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteInitialData, setNoteInitialData] = useState<InitialNoteData | null>(null);

  // State for HabitFormModal
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [habitInitialData, setHabitInitialData] = useState<InitialHabitData | null>(null);

  // State for ReminderFormModal
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderInitialData, setReminderInitialData] = useState<InitialReminderData | null>(null);

  // State for Task Modal (NoteFormDrawer in task mode)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskInitialData, setTaskInitialData] = useState<InitialNoteData | null>(null);

  // Handlers to open modals with initial data
  const openNoteModal = (initialData?: InitialNoteData) => {
    setNoteInitialData(initialData || { title: "", description: "", background_color: "#" });
    setIsNoteModalOpen(true);
  };

  const openHabitModal = (initialData?: InitialHabitData) => {
    setHabitInitialData(initialData || { name: "", frequency: "Daily" });
    setIsHabitModalOpen(true);
  };

  const openReminderModal = (initialData?: InitialReminderData) => {
    setReminderInitialData(initialData || { message: "", time: "08:00" });
    setIsReminderModalOpen(true);
  };

  const openTaskModal = (initialData?: InitialNoteData) => {
    setTaskInitialData(initialData || { title: "", description: "", background_color: "#" });
    setIsTaskModalOpen(true);
  };

  return (
    <>
      <header className="pt-10 md:pb-10">
        <div className="flex items-center justify-between mx-auto container">
          <div className="flex gap-6">
            <UserProfile />
            <div className="flex-1 max-w-xl mx-4 hidden md:flex">
              <SearchBar />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isMobile ? (
              <MobileMenu />
            ) : (
              <ActionButtons 
                onNoteClick={() => openNoteModal()}
                onHabitClick={() => openHabitModal()}
                onTaskClick={() => openTaskModal()}
                onReminderClick={() => openReminderModal()}
              />
            )}
          </div>
        </div>
      </header>

      <NoteFormDrawer
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onNoteAdded={() => setIsNoteModalOpen(false)}
        initialData={{
          title:  "New Note",
          description:
            "Start writing your thoughts here...",
          background_color: "#ff9b74",
        }}
      />

      <HabitFormModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        onHabitAdded={() => setIsHabitModalOpen(false)}
        
      />

      <ReminderFormModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        triggerRef={null}
      />

      <NoteFormDrawer
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onNoteAdded={() => setIsTaskModalOpen(false)}
        initialData={{
          title:  "New Task",
          description:
            "Start writing description here...",
          background_color: "#ff9b74",
        }}
        isTaskMode={true}
        
      />
    </>
  );
};
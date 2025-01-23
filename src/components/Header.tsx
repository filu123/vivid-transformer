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

export const Header = ({ onViewChange, activeView }: HeaderProps) => {
  const isMobile = useIsMobile();
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

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
                onNoteClick={() => setIsNoteModalOpen(true)}
                onHabitClick={() => setIsHabitModalOpen(true)}
                onTaskClick={() => setIsTaskModalOpen(true)}
                onReminderClick={() => setIsReminderModalOpen(true)}
              />
            )}
          </div>
        </div>
      </header>

      <NoteFormDrawer
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onNoteAdded={() => setIsNoteModalOpen(false)}
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
        isTaskMode={true}
      />
    </>
  );
};
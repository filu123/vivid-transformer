
import { useRef } from "react";
import { NoteFormDrawer } from "../notes/NoteFormDrawer";

interface ReminderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

export const ReminderFormModal = ({
  isOpen,
  onClose,
  triggerRef,
}: ReminderFormModalProps) => {
  const handleReminderAdded = () => {
    onClose();
  };

  return (
    <NoteFormDrawer
      isOpen={isOpen}
      onClose={onClose}
      onNoteAdded={handleReminderAdded}
      initialData={{
        title: "New reminder",
      }}
      isReminderMode={true}
    />
  );
};


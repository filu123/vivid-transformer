
import { NoteFormDrawer } from "../NoteFormDrawer";

interface ReminderDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  reminder: {
    id: string;
    title: string;
    due_date?: string;
    is_completed: boolean;
    category: string;
    background_color?: string;
  };
  onUpdate: () => void;
}

export const ReminderDetailsDrawer = ({ open, onClose, reminder, onUpdate }: ReminderDetailsDrawerProps) => {
  return (
    <NoteFormDrawer
      isOpen={open}
      onClose={onClose}
      onNoteAdded={onUpdate}
      initialData={{
        id: reminder.id,
        title: reminder.title,
        date: reminder.due_date,
        background_color: reminder.background_color,
      }}
      isReminderMode={true}
    />
  );
};



import { NoteFormDrawer } from "../NoteFormDrawer";

interface TaskDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  task: {
    id: string;
    title: string;
    description?: string;
    date?: string;
    background_color?: string;
    label_id?: string;
    status?: string;
    frequency?: "daily" | "three_times" | "custom";
    custom_days?: number[];
  };
  onUpdate: () => void;
}

export const TaskDetailsDrawer = ({ open, onClose, task, onUpdate }: TaskDetailsDrawerProps) => {
  return (
    <NoteFormDrawer
      isOpen={open}
      onClose={onClose}
      onNoteAdded={onUpdate}
      initialData={{
        title: task.title,
        description: task.description,
        date: task.date,
        background_color: task.background_color,
        label_id: task.label_id,
        frequency: task.frequency,
        custom_days: task.custom_days,
        id: task.id
      }}
      isTaskMode={true}
    />
  );
};

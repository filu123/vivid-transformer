
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
    first_occurrence_date?: string;
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
        id: task.id,
        title: task.title,
        description: task.description || "",
        date: task.first_occurrence_date || task.date,
        background_color: task.background_color,
        label_id: task.label_id,
        frequency: task.frequency,
        custom_days: task.custom_days,
      }}
      isTaskMode={true}
    />
  );
};

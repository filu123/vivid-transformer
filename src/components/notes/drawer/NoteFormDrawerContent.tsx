
import { NoteForm } from "../form/NoteForm";
import { NoteFormData, FormSubmitData } from "../types/NoteFormTypes";

interface NoteFormDrawerContentProps {
  initialData: NoteFormData;
  onSubmit: (formData: FormSubmitData) => Promise<void>;
  onClose: () => void;
  isTaskMode: boolean;
  isReminderMode: boolean;
}

export const NoteFormDrawerContent = ({
  initialData,
  onSubmit,
  onClose,
  isTaskMode,
  isReminderMode,
}: NoteFormDrawerContentProps) => {
  return (
    <div className="p-4 bg-background rounded-t-[10px] flex-1">
      <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
      <div className="max-w-3xl mx-auto">
        <NoteForm
          onSubmit={onSubmit}
          initialData={{
            ...initialData,
            image_url: initialData?.image_url
          }}
          onClose={onClose}
          isTaskMode={isTaskMode}
          isReminderMode={isReminderMode}
        />
      </div>
    </div>
  );
};

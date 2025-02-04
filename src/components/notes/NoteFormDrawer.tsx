
import { Drawer } from "vaul";
import { NoteFormData } from "./types/NoteFormTypes";
import { useNoteFormSubmit } from "./hooks/useNoteFormSubmit";
import { NoteFormDrawerContent } from "./drawer/NoteFormDrawerContent";

interface NoteFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNoteAdded: () => void;
  editNote?: NoteFormData;
  initialData?: NoteFormData;
  isTaskMode?: boolean;
  isReminderMode?: boolean;
}

export const NoteFormDrawer = ({
  isOpen,
  onClose,
  onNoteAdded,
  editNote,
  initialData,
  isTaskMode = false,
  isReminderMode = false,
}: NoteFormDrawerProps) => {
  const isEditing = initialData?.id != null;
  const { handleSubmit, isUploading } = useNoteFormSubmit(
    onNoteAdded,
    onClose,
    isReminderMode,
    isTaskMode,
    isEditing,
    initialData?.id
  );

  return (
    <Drawer.Root open={isOpen} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content 
          className="bg-background flex flex-col rounded-t-[10px] fixed bottom-0 left-0 right-0 h-[85vh] mt-24"
        >
          <NoteFormDrawerContent
            initialData={initialData || { title: "" }}
            onSubmit={handleSubmit}
            onClose={onClose}
            isTaskMode={isTaskMode}
            isReminderMode={isReminderMode}
          />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

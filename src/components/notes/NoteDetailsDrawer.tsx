import { Drawer } from "vaul";
import { NoteDetails } from "./NoteDetails";

interface Note {
  id: string;
  title: string;
  description?: string;
  date?: string;
  image_url?: string;
  background_color?: string;
}

interface NoteDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  note: Note;
  onNoteUpdated: () => void; // Add this line
}

export const NoteDetailsDrawer = ({ open, onClose, note, onNoteUpdated }: NoteDetailsDrawerProps) => {
  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0 h-[85vh]">
          <div className="p-4 bg-background rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
            <div className="max-w-3xl mx-auto">
              <NoteDetails note={note} onUpdate={onNoteUpdated} />
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
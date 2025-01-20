import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Drawer } from "vaul";

interface NoteDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  note: {
    id: string;
    title: string;
    description?: string;
    date?: string;
    image_url?: string;
  };
}

export const NoteDetailsDrawer = ({ open, onClose, note }: NoteDetailsDrawerProps) => {
  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 " />
        <Drawer.Content className="bg-background flex flex-col  w-[75vw] mx-auto rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0 h-[85vh]">
          <div className="p-4 bg-background rounded-t-[10px] flex-1 h-full overflow-hidden">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
            <div className="max-w-3xl mx-auto h-full">
              <div className="flex flex-col h-full">
                <h2 className="text-2xl font-semibold mb-4">{note.title}</h2>
                {note.date && (
                  <div className="flex items-center gap-2 text-muted-foreground mb-6">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(note.date), "MMM d, yyyy")}</span>
                  </div>
                )}
                {note.image_url && (
                  <div className="relative w-full h-48 mb-6">
                    <img
                      src={note.image_url}
                      alt={note.title}
                      className="absolute inset-0 w-full h-full object-cover rounded-md"
                    />
                  </div>
                )}
                {note.description && (
                  <div className="prose prose-sm max-w-none flex-1 overflow-y-auto">
                    <div dangerouslySetInnerHTML={{ __html: note.description }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
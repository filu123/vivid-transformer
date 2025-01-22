import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReminderForm } from "@/hooks/useReminderForm";
import { ReminderDateTime } from "./ReminderDateTime";
import { ReminderListSelect } from "./ReminderListSelect";

interface ReminderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReminderFormModal = ({
  isOpen,
  onClose,
}: ReminderFormModalProps) => {
  const {
    title,
    setTitle,
    listId,
    setListId,
    date,
    setDate,
    time,
    setTime,
    handleSubmit,
  } = useReminderForm(onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden animate-in fade-in-0 zoom-in-95">
        <DialogHeader className="px-4 pt-5 pb-4">
          <DialogTitle className="text-2xl font-semibold">Add Reminder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 px-4 pb-6">
          <div className="space-y-2">
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg border-none bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
              placeholder="Reminder title"
              required
            />
          </div>
          
          <div className="space-y-4 rounded-lg bg-muted/50 p-4">
            <ReminderListSelect 
              value={listId} 
              onChange={setListId}
              className="border-none bg-background focus-visible:ring-0"
            />
            <ReminderDateTime
              date={date}
              time={time}
              onDateChange={setDate}
              onTimeChange={setTime}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="hover:bg-muted/50"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-primary hover:bg-primary/90"
            >
              Add Reminder
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Reminder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <ReminderListSelect value={listId} onChange={setListId} />
          <ReminderDateTime
            date={date}
            time={time}
            onDateChange={setDate}
            onTimeChange={setTime}
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Reminder</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
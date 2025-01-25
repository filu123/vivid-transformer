import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { PriorityForm } from "./PriorityForm";
import { usePriorities } from "@/hooks/use-priorities";

interface DayItem {
  id: string;
  title: string;
  type: "task" | "habit" | "reminder" | "note";
  startTime?: string;
  endTime?: string;
  duration?: string;
  note?: string;
  isDone?: boolean;
}

interface PriorityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onPriorityAdded: () => void;
  editItem?: DayItem | null;
}

export const PriorityFormModal = ({
  isOpen,
  onClose,
  selectedDate,
  onPriorityAdded,
  editItem,
}: PriorityFormModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editItem ? "Edit Priority" : "Add Priority"} for {format(selectedDate, "MMMM d, yyyy")}
          </DialogTitle>
        </DialogHeader>
        <PriorityForm
          selectedDate={selectedDate}
          onPriorityAdded={onPriorityAdded}
          onClose={onClose}
          editItem={editItem}
        />
      </DialogContent>
    </Dialog>
  );
};
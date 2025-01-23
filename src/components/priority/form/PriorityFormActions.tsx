import { Button } from "@/components/ui/button";

interface PriorityFormActionsProps {
  onClose: () => void;
  isEditing: boolean;
}

export const PriorityFormActions = ({ onClose, isEditing }: PriorityFormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" type="button" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit">
        {isEditing ? "Update" : "Add"} Priority
      </Button>
    </div>
  );
};
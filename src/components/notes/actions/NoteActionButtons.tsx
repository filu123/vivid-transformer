import { Button } from "@/components/ui/button";
import { FileText, ListTodo, Bell, PenTool } from "lucide-react";

interface NoteActionButtonsProps {
  onNoteClick: () => void;
  onTaskClick: () => void;
  onReminderClick: () => void;
  onDrawingClick: () => void;
  addButtonRef: React.RefObject<HTMLButtonElement>;
}

export const NoteActionButtons = ({
  onNoteClick,
  onTaskClick,
  onReminderClick,
  onDrawingClick,
  addButtonRef,
}: NoteActionButtonsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
      <Button
        variant="ghost"
        className="h-20 flex items-center justify-start p-4 bg-white hover:bg-accent/50"
        onClick={onNoteClick}
      >
        <div className="flex items-center space-x-4">
          <div className="bg-[#f3f3f3] rounded-full p-3 flex-shrink-0">
            <FileText className="h-6 w-6 text-black" />
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-500">New Note</p>
            <h3 className="text-lg font-semibold">Take a Note</h3>
          </div>
        </div>
      </Button>
      
      <Button
        variant="ghost"
        className="h-20 flex items-center justify-start p-4 bg-white hover:bg-accent/50"
        onClick={onTaskClick}
      >
        <div className="flex items-center space-x-4">
          <div className="bg-[#f3f3f3] rounded-full p-3 flex-shrink-0">
            <ListTodo className="h-6 w-6 text-black" />
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-500">New Task</p>
            <h3 className="text-lg font-semibold">Add Task</h3>
          </div>
        </div>
      </Button>

      <Button
        variant="ghost"
        className="h-20 flex items-center justify-start p-4 bg-white hover:bg-accent/50"
        onClick={onReminderClick}
        ref={addButtonRef}
      >
        <div className="flex items-center space-x-4">
          <div className="bg-[#f3f3f3] rounded-full p-3 flex-shrink-0">
            <Bell className="h-6 w-6 text-black" />
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-500">New Reminder</p>
            <h3 className="text-lg font-semibold">Add Reminder</h3>
          </div>
        </div>
      </Button>
      
      <Button
        variant="ghost"
        className="h-20 flex items-center justify-start p-4 bg-white hover:bg-accent/50"
        onClick={onDrawingClick}
      >
        <div className="flex items-center space-x-4">
          <div className="bg-[#f3f3f3] rounded-full p-3 flex-shrink-0">
            <PenTool className="h-6 w-6 text-black" />
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-500">New Note</p>
            <h3 className="text-lg font-semibold">With Drawing</h3>
          </div>
        </div>
      </Button>
    </div>
  );
};
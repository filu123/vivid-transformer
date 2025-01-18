import { Plus } from "lucide-react";

interface AddPriorityButtonProps {
  onClick: () => void;
}

export const AddPriorityButton = ({ onClick }: AddPriorityButtonProps) => {
  return (
    <div 
      className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-gray-400 transition-colors mt-4"
      onClick={onClick}
    >
      <Plus className="h-8 w-8 text-gray-400 mb-2" />
      <p className="text-gray-600">Add a priority for this day</p>
    </div>
  );
};
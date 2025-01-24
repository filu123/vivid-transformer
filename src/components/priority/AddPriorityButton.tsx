import { Plus } from "lucide-react";

interface AddPriorityButtonProps {
  onClick: () => void;
  bgClass: string;
}

export const AddPriorityButton = ({ onClick, bgClass }: AddPriorityButtonProps) => {
  return (
    <div 
      className={`flex flex-col min-h-[199px] max-h-[199px] items-center justify-center ${bgClass} rounded-xl p-8 cursor-pointer hover:border-gray-400 transition-colors `}
      onClick={onClick}
    >
      <Plus className="h-8 w-8 text-black mb-2" /> {/* Adjusted text color for better contrast */}
      <p className="text-gray-800">Add a priority</p> {/* Adjusted text color for better contrast */}
    </div>
  );
};
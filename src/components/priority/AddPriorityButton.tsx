import { Plus } from "lucide-react";
import { CardAnimation } from "../notes/animations/CardAnimation";
import { Card } from "../ui/card";

interface AddPriorityButtonProps {
  onClick: () => void;
  bgClass: string;
  index: number;
}

export const AddPriorityButton = ({ onClick, bgClass, index }: AddPriorityButtonProps) => {
  return (
    <CardAnimation index={index}>
    <Card 
      className={`transition-all duration-200 hover:scale-[1.02] flex flex-col min-h-[199px] max-h-[199px] items-center justify-center ${bgClass} rounded-xl p-8 cursor-pointer   `}
      onClick={onClick}
    >
      <Plus className="h-8 w-8 text-black mb-2" /> {/* Adjusted text color for better contrast */}
      <p className="text-gray-800">Add a priority</p> {/* Adjusted text color for better contrast */}
    </Card>
    </CardAnimation>
  );
};
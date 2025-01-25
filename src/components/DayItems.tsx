import { useState } from "react";
import { PriorityFormModal } from "./priority/PriorityFormModal";
import { PriorityCard } from "./priority/PriorityCard";
import { AddPriorityButton } from "./priority/AddPriorityButton";

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

interface DayItemsProps {
  date: Date;
  items: DayItem[];
  onItemsChange: () => void;
  onToggleDone: (id: string, newIsDone: boolean) => void;
}

const MAX_PRIORITIES = 4;

// Define an array of background color classes
const addButtonBgColors = [
  "bg-[#ff9b74]",
  "bg-[#fdc971]",
  "bg-[#ebc49a]",
  "bg-[#ebe3d6]"

  // "#ff9b74",
  // "#fdc971",
  // "#ebc49a",
  // "#322a2f",
  // "#c15626",
  // "#ebe3d6",
  // "#a2a8a5",
];

export const DayItems = ({ date, items, onItemsChange, onToggleDone }: DayItemsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<DayItem | null>(null);

  const remainingAddButtons = MAX_PRIORITIES - items.length;

  return (
    <div className="space-y-1">
      <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 min-h-full">
        {items.map((item, index) => (
          <PriorityCard
            key={item.id}
            id={item.id}
            title={item.title}
            startTime={item.startTime}
            endTime={item.endTime}
            duration={item.duration}
            note={item.note}
            isDone={item.isDone}
            onToggleDone={onToggleDone}
            index={index}
            onPriorityUpdated={onItemsChange} // Ensure this callback is passed

          />
        ))}

        {remainingAddButtons > 0 &&
          Array.from({ length: remainingAddButtons }).map((_, idx) => (
            <AddPriorityButton
              key={idx}
              onClick={() => setIsModalOpen(true)}
              bgClass={addButtonBgColors[idx % addButtonBgColors.length]} // Assign bgClass based on index
            />
          ))}
      </div>

      {/* {items.length === 0 && (
        <div className="mt-8 text-center text-gray-500">
          Nothing for today
        </div>
      )} */}

      <PriorityFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditItem(null);
        }}
        selectedDate={date}
        onPriorityAdded={onItemsChange}
        editItem={editItem}
      />
    </div>
  );
};
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
}

export const DayItems = ({ date, items, onItemsChange }: DayItemsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<DayItem | null>(null);

  const canAddMorePriorities = items.length < 3;

  return (
    <div className="space-y-4">
      <div className="space-y-4 ">
        {items.map((item) => (
          <PriorityCard
            key={item.id}
            id={item.id}
            title={item.title}
            startTime={item.startTime}
            endTime={item.endTime}
            duration={item.duration}
            note={item.note}
            isDone={item.isDone}
            onPriorityUpdated={onItemsChange}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className="mt-8 text-center text-gray-500">
          Nothing for today
        </div>
      )}

      {canAddMorePriorities && (
        <AddPriorityButton onClick={() => setIsModalOpen(true)} />
      )}

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
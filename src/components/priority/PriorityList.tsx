import { TaskCard } from "../TaskCard";

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

interface PriorityListProps {
  items: DayItem[];
  onEdit: (item: DayItem) => void;
  onDelete: (id: string) => void;
  onToggleDone: (id: string, isDone: boolean) => void;
}

export const PriorityList = ({
  items,
  onEdit,
  onDelete,
  onToggleDone,
}: PriorityListProps) => {
  const getVariant = (type: DayItem["type"]) => {
    switch (type) {
      case "task":
        return "yellow";
      case "habit":
        return "blue";
      case "reminder":
        return "purple";
      case "note":
        return "green";
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item) => (
        <div key={item.id} className="w-full">
          <TaskCard
            id={item.id}
            title={item.title}
            startTime={item.startTime}
            endTime={item.endTime}
            duration={item.duration}
            variant={getVariant(item.type)}
            note={item.note}
            isDone={item.isDone}
            onDelete={() => onDelete(item.id)}
            onEdit={() => onEdit(item)}
            onToggleDone={() => onToggleDone(item.id, !!item.isDone)}
          />
        </div>
      ))}
    </div>
  );
};
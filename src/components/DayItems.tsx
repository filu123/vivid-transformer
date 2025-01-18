import { TaskCard } from "./TaskCard";

interface DayItem {
  id: string;
  title: string;
  type: "task" | "habit" | "reminder" | "note";
  startTime?: string;
  endTime?: string;
  duration?: string;
}

interface DayItemsProps {
  date: Date;
  items: DayItem[];
}

export const DayItems = ({ date, items }: DayItemsProps) => {
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

  if (items.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No items scheduled for this day
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <TaskCard
          key={item.id}
          title={item.title}
          startTime={item.startTime || ""}
          endTime={item.endTime || ""}
          duration={item.duration || ""}
          variant={getVariant(item.type)}
        />
      ))}
    </div>
  );
};
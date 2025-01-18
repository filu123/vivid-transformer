import { format } from "date-fns";

export const DateDisplay = () => {
  const today = new Date();
  
  return (
    <div className="mb-8 px-4">
      <div className="text-lg text-secondary">{format(today, "EEEE")}</div>
      <div className="flex items-baseline gap-2">
        <div className="text-6xl font-bold">
          {format(today, "dd.MM")}
        </div>
        <div className="text-4xl font-bold text-primary">
          {format(today, "MMM").toUpperCase()}
        </div>
      </div>
      <div className="mt-2 space-y-1">
        <div className="text-sm text-secondary">
          {format(today, "h:mm a")} New York
        </div>
        <div className="text-sm text-secondary">
          {format(new Date(today.getTime() + 5 * 60 * 60 * 1000), "h:mm a")} United Kingdom
        </div>
      </div>
    </div>
  );
};
import { format } from "date-fns";

export const DateDisplay = () => {
  const today = new Date();
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full">
      <div className="text-lg text-secondary">{format(today, "EEEE")}</div>
      <div className="flex items-baseline gap-2 mt-2">
        <div className="text-5xl font-bold text-primary">
          {format(today, "dd")}
        </div>
        <div className="text-3xl font-bold text-secondary">
          {format(today, "MMM").toUpperCase()}
        </div>
      </div>
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm text-secondary border-b border-gray-100 pb-2">
          <span>New York</span>
          <span>{format(today, "h:mm a")}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-secondary">
          <span>United Kingdom</span>
          <span>{format(new Date(today.getTime() + 5 * 60 * 60 * 1000), "h:mm a")}</span>
        </div>
      </div>
    </div>
  );
};
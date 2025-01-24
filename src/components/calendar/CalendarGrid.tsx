import { isSameDay } from "date-fns";

interface CalendarGridProps {
  days: (Date | null)[];
  selectedDate: Date;
  onDateClick: (date: Date) => void;
}

export const CalendarGrid = ({
  days,
  selectedDate,
  onDateClick,
}: CalendarGridProps) => {
  const getCircleColor = (date: Date) => {
    if (isSameDay(date, new Date())) return "bg-white";
    const day = date.getDate();
    if (day % 3 === 0) return "bg-white";
    if (day % 5 === 0) return "bg-white";
    if (day % 7 === 0) return "bg-white";
    return "bg-white";
  };

  return (
    <>
      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
          <div key={day} className="text-sm font-bold text-black">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 ">
        {days.map((date, index) => (
          <div
            key={index}
            className="aspect-square flex items-center justify-center relative"
          >
            {date && (
              <button
                onClick={() => onDateClick(date)}
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all
                  ${getCircleColor(date)} text-black hover:opacity-90
                  ${isSameDay(date, new Date()) ? 'ring-2 ring-offset-2 ring-primary hover:ring-4' : ''}
                  ${isSameDay(date, selectedDate) ? 'ring-4 ring-offset-2 ring-primary' : ''}
                `}
              >
                {date.getDate()}
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
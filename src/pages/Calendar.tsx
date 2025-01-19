import { WeekView } from "@/components/Calendar/WeekView";

const Calendar = () => {
  return (
    <div className="w-full p-4 md:p-8">
      <div className="container mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Calendar</h1>
        <WeekView />
      </div>
    </div>
  );
};

export default Calendar;
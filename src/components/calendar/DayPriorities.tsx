import { Card } from "@/components/ui/card";
import { format } from "date-fns";

interface Priority {
  id: string;
  title: string;
  startTime?: string;
  endTime?: string;
  duration?: string;
  note?: string;
}

interface DayPrioritiesProps {
  priorities: Priority[];
}

export const DayPriorities = ({ priorities }: DayPrioritiesProps) => {
  return (
    <div className="space-y-4 grid grid-cols-2">
      {priorities.map((priority) => (
        <Card key={priority.id} className="p-6">
          <h3 className="text-xl font-semibold mb-4">{priority.title}</h3>
          {priority.startTime && priority.endTime && (
            <div className="flex items-center justify-between text-gray-600">
              <div>
                <div className="text-sm font-medium">Start</div>
                <div className="text-lg">{priority.startTime}</div>
              </div>
              <div className="px-4 py-1.5 rounded-full bg-gray-100">
                {priority.duration}
              </div>
              <div>
                <div className="text-sm font-medium">End</div>
                <div className="text-lg">{priority.endTime}</div>
              </div>
            </div>
          )}
          {priority.note && (
            <div className="mt-4 text-gray-600">
              <div className="text-sm font-medium">Note</div>
              <p>{priority.note}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
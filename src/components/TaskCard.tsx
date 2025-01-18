import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TaskCardProps {
  title: string;
  startTime: string;
  endTime: string;
  duration: string;
  variant: "yellow" | "blue";
  participants?: Array<{
    name: string;
    avatar: string;
  }>;
}

export const TaskCard = ({
  title,
  startTime,
  endTime,
  duration,
  variant,
  participants,
}: TaskCardProps) => {
  return (
    <div className={`p-6 rounded-xl bg-card-${variant} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        {participants && (
          <div className="flex -space-x-2">
            {participants.map((participant, index) => (
              <Avatar key={index} className="w-8 h-8 border-2 border-white">
                <AvatarImage src={participant.avatar} alt={participant.name} />
                <AvatarFallback>{participant.name[0]}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-600">Start</div>
          <div className="text-lg">{startTime}</div>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-black/10 text-sm font-medium">
          {duration}
        </div>
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-600">End</div>
          <div className="text-lg">{endTime}</div>
        </div>
      </div>
    </div>
  );
};
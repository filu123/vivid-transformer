import { useState } from "react";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/TaskCard";

interface TimeboxPlannerProps {
  date: Date;
}

export const TimeboxPlanner = ({ date }: TimeboxPlannerProps) => {
  const [tasks] = useState([
    {
      title: "Morning Planning",
      startTime: "09:00 AM",
      endTime: "09:30 AM",
      duration: "30 Min",
      variant: "yellow" as const,
      participants: [
        { name: "John Doe", avatar: "/placeholder.svg" },
      ],
    },
    {
      title: "Team Standup",
      startTime: "10:00 AM",
      endTime: "10:30 AM",
      duration: "30 Min",
      variant: "blue" as const,
      participants: [
        { name: "Jane Smith", avatar: "/placeholder.svg" },
        { name: "Bob Wilson", avatar: "/placeholder.svg" },
      ],
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          Schedule for {format(date, "MMMM d, yyyy")}
        </h2>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="grid gap-4">
        {tasks.map((task, index) => (
          <TaskCard key={index} {...task} />
        ))}
      </div>
    </div>
  );
};
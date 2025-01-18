import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckSquare } from "lucide-react";

interface ProjectCardProps {
  title: string;
  status: string;
  dueDate: string;
  tasksCount: number;
}

export const ProjectCard = ({
  title,
  status,
  dueDate,
  tasksCount,
}: ProjectCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">{title}</h3>
          <Badge className={getStatusColor(status)} variant="secondary">
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">Due {dueDate}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <CheckSquare className="h-4 w-4 mr-2" />
            <span className="text-sm">{tasksCount} tasks</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
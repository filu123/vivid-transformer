import { format } from "date-fns";
import { Calendar } from "lucide-react";

interface NoteDetailsProps {
  title: string;
  description?: string;
  date?: string;
}

export const NoteDetails = ({ title, description, date }: NoteDetailsProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        {date && (
          <div className="flex items-center gap-2 text-muted-foreground mb-6">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(date), "MMM d, yyyy")}</span>
          </div>
        )}
        {description && (
          <p className="text-gray-600 whitespace-pre-wrap">{description}</p>
        )}
      </div>
      <div className="p-8 flex justify-center">
        <img
          src="/lovable-uploads/1a8e758d-1e9d-46ff-b73d-4c1711306b91.png"
          alt="Note taking illustration"
          className="max-w-[400px] w-full opacity-50"
        />
      </div>
    </div>
  );
};
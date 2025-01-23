import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Calendar, CheckSquare, ListTodo, StickyNote } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  type: 'note' | 'habit' | 'task' | 'reminder';
  date?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  onSelect: (result: SearchResult) => void;
}

export const SearchResults = ({ results = [], onSelect }: SearchResultsProps) => {
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <StickyNote className="h-4 w-4" />;
      case 'habit':
        return <Calendar className="h-4 w-4" />;
      case 'task':
        return <CheckSquare className="h-4 w-4" />;
      case 'reminder':
        return <ListTodo className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleSelect = (result: SearchResult) => {
    switch (result.type) {
      case 'note':
        navigate('/notes');
        break;
      case 'habit':
        navigate('/habits');
        break;
      case 'task':
        navigate('/notes?type=tasks');
        break;
      case 'reminder':
        navigate('/reminders');
        break;
    }
    onSelect(result);
  };

  return (
    <Card className="w-[369px] absolute top-full mt-1 z-50">
      <Command>
        <CommandEmpty>No results found.</CommandEmpty>
        {results && results.length > 0 && (
          <CommandGroup>
            {results.map((result) => (
              <CommandItem
                key={`${result.type}-${result.id}`}
                onSelect={() => handleSelect(result)}
                className="flex items-center gap-2 cursor-pointer"
              >
                {getIcon(result.type)}
                <div>
                  <p className="text-sm font-medium">{result.title}</p>
                  {result.date && (
                    <p className="text-xs text-gray-500">{result.date}</p>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </Command>
    </Card>
  );
};
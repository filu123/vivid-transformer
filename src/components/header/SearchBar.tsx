import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchResults } from "@/components/search/SearchResults";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { format } from "date-fns";

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const { data: searchResults = [] } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];

      const [notesRes, habitsRes, tasksRes, remindersRes] = await Promise.all([
        supabase
          .from("notes")
          .select("id, title, date")
          .ilike("title", `%${searchQuery}%`)
          .limit(3),
        supabase
          .from("habits")
          .select("id, title, start_date")
          .ilike("title", `%${searchQuery}%`)
          .limit(3),
        supabase
          .from("tasks_notes")
          .select("id, title, date")
          .ilike("title", `%${searchQuery}%`)
          .eq("status", "pending")
          .limit(3),
        supabase
          .from("reminders")
          .select("id, title, due_date")
          .ilike("title", `%${searchQuery}%`)
          .eq("is_completed", false)
          .limit(3),
      ]);

      const results = [
        ...(notesRes.data?.map(note => ({
          ...note,
          type: 'note' as const,
          date: note.date ? format(new Date(note.date), 'MMM dd, yyyy') : undefined
        })) || []),
        ...(habitsRes.data?.map(habit => ({
          ...habit,
          type: 'habit' as const,
          date: format(new Date(habit.start_date), 'MMM dd, yyyy')
        })) || []),
        ...(tasksRes.data?.map(task => ({
          ...task,
          type: 'task' as const,
          date: task.date ? format(new Date(task.date), 'MMM dd, yyyy') : undefined
        })) || []),
        ...(remindersRes.data?.map(reminder => ({
          ...reminder,
          type: 'reminder' as const,
          date: reminder.due_date ? format(new Date(reminder.due_date), 'MMM dd, yyyy') : undefined
        })) || [])
      ];

      return results;
    },
    enabled: searchQuery.length > 0
  });

  const handleSearchFocus = () => {
    setShowResults(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowResults(false), 200);
  };

  return (
    <div className="relative w-full" style={{ maxWidth: '237px' }}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-5 w-5 ml-2 text-black" />
      </div>
      <Input 
        type="search" 
        placeholder="Search anything..." 
        className="w-[369px] h-12 pl-14 border-0 rounded-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={handleSearchFocus}
        onBlur={handleSearchBlur}
      />
      {showResults && searchQuery && (
        <SearchResults 
          results={searchResults} 
          onSelect={() => setShowResults(false)} 
        />
      )}
    </div>
  );
};
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Menu, Plus, RefreshCw, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dispatch, SetStateAction, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NoteFormDrawer } from "./notes/NoteFormDrawer";
import { HabitFormModal } from "./habits/HabitFormModal";
import { ReminderFormModal } from "./reminders/ReminderFormModal";
import { SearchResults } from "./search/SearchResults";
import { format } from "date-fns";

interface HeaderProps {
  onViewChange?: Dispatch<SetStateAction<"today" | "calendar">>;
  activeView?: "today" | "calendar";
}

export const Header = ({ onViewChange, activeView }: HeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      return data;
    },
  });

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

  const navigateAndCloseMobileMenu = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="pt-10 md:pb-10">
        <div className="flex items-center justify-between mx-auto container">
          <div className="flex gap-6">
            <div className="flex items-center gap-2 md:gap-4">
              <Avatar>
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="font-medium">{profile?.username || "User"}</p>
                <p className="text-sm text-gray-500">user@example.com</p>
              </div>
            </div>

            <div className="flex-1 max-w-xl mx-4 hidden md:flex">
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
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isMobile ? (
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 mt-6">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => navigateAndCloseMobileMenu("/notes")}
                    >
                      Notes
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => navigateAndCloseMobileMenu("/habits")}
                    >
                      Habits
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => navigateAndCloseMobileMenu("/reminders")}
                    >
                      Reminders
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => navigateAndCloseMobileMenu("/calendar")}
                    >
                      Calendar
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <>
                <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                  <RefreshCw className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate("/calendar")}
                >
                  <Calendar className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Plus className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsNoteModalOpen(true)}>
                      Notes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsHabitModalOpen(true)}>
                      Habits
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsTaskModalOpen(true)}>
                      Tasks
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsReminderModalOpen(true)}>
                      Reminders
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </header>

      <NoteFormDrawer
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onNoteAdded={() => setIsNoteModalOpen(false)}
      />

      <HabitFormModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        onHabitAdded={() => setIsHabitModalOpen(false)}
      />

      <ReminderFormModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        triggerRef={null}
      />

      <NoteFormDrawer
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onNoteAdded={() => setIsTaskModalOpen(false)}
        isTaskMode={true}
      />
    </>
  );
};
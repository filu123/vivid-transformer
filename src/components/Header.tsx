import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, MoreHorizontal, RefreshCw, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dispatch, SetStateAction } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onViewChange?: Dispatch<SetStateAction<"today" | "calendar">>;
  activeView?: "today" | "calendar";
}

export const Header = ({ onViewChange, activeView }: HeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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

  return (
    <header className="pt-10 md:pb-10">
      <div className="flex items-center justify-between  mx-auto container ">
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
                className="w-[369px] h-12 pl-14  border-0 rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
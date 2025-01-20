import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, MoreHorizontal, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dispatch, SetStateAction } from "react";

interface HeaderProps {
  onViewChange?: Dispatch<SetStateAction<"today" | "calendar">>;
  activeView?: "today" | "calendar";
}

export const Header = ({ onViewChange, activeView }: HeaderProps) => {
  const navigate = useNavigate();

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
    <header className="border-b">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="font-medium">{profile?.username || "User"}</p>
            <p className="text-sm text-gray-500">user@example.com</p>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-8">
          <Input 
            type="search" 
            placeholder="Search anything..." 
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
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
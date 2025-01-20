import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, MoreHorizontal, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback>
            {user?.email?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {user?.user_metadata?.full_name || "User"}
          </span>
          <span className="text-xs text-muted-foreground">
            {user?.email}
          </span>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-8">
        <Input 
          type="search" 
          placeholder="Search anything..." 
          className="bg-muted/50"
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
  );
};
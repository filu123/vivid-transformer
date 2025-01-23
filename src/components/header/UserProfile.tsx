import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const UserProfile = () => {
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
  );
};
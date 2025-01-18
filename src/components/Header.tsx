import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Bell, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface HeaderProps {
  onViewChange: (view: "today" | "calendar") => void;
  activeView: "today" | "calendar";
}

export const Header = ({ onViewChange, activeView }: HeaderProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <Button
          variant={activeView === "today" ? "default" : "ghost"}
          className="rounded-lg"
          onClick={() => onViewChange("today")}
        >
          Today
        </Button>
        <Button
          variant={activeView === "calendar" ? "default" : "ghost"}
          className="rounded-lg"
          onClick={() => onViewChange("calendar")}
        >
          Calendar
        </Button>
      </div>
      <div className="flex gap-2">
        <Button size="icon" variant="ghost" className="rounded-lg">
          <Bell className="h-5 w-5" />
        </Button>
        <Button size="icon" className="rounded-lg">
          <Plus className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="ghost" className="rounded-lg" onClick={handleSignOut}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
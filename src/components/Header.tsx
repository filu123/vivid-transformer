import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Bell } from "lucide-react";

export const Header = () => {
  const [activeTab, setActiveTab] = useState<"today" | "calendar">("today");

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <Button
          variant={activeTab === "today" ? "default" : "ghost"}
          className="rounded-lg"
          onClick={() => setActiveTab("today")}
        >
          Today
        </Button>
        <Button
          variant={activeTab === "calendar" ? "default" : "ghost"}
          className="rounded-lg"
          onClick={() => setActiveTab("calendar")}
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
      </div>
    </div>
  );
};
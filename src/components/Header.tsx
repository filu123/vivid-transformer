import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const Header = () => {
  const [activeTab, setActiveTab] = useState<"today" | "calendar">("today");

  return (
    <div className="flex justify-between items-center mb-6 px-4">
      <div className="flex gap-2">
        <Button
          variant={activeTab === "today" ? "default" : "ghost"}
          className="rounded-full"
          onClick={() => setActiveTab("today")}
        >
          Today
        </Button>
        <Button
          variant={activeTab === "calendar" ? "default" : "ghost"}
          className="rounded-full"
          onClick={() => setActiveTab("calendar")}
        >
          Calendar
        </Button>
      </div>
      <Button size="icon" className="rounded-full">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
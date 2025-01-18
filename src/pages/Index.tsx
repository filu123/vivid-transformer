import { Header } from "@/components/Header";
import { WeekView } from "@/components/Calendar/WeekView";
import { TimeboxPlanner } from "@/components/TimeboxPlanner";
import { useState } from "react";

const Index = () => {
  const [activeView, setActiveView] = useState<"today" | "calendar">("today");

  return (
    <main className="flex-1 p-8">
      <div className="max-w-[1200px] mx-auto">
        <Header onViewChange={setActiveView} activeView={activeView} />
        
        {activeView === "today" ? (
          <div className="mt-6">
            <TimeboxPlanner />
          </div>
        ) : (
          <div className="mt-6">
            <WeekView />
          </div>
        )}
      </div>
    </main>
  );
};

export default Index;
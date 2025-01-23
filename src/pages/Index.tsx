import { Header } from "@/components/Header";
import { TimeboxPlanner } from "@/components/TimeboxPlanner";
import { useState } from "react";

const Index = () => {
  const [activeView, setActiveView] = useState<"today" | "calendar">("today");

  return (
    <main className="w-full min-h-screen">
      <div className="container mx-auto">
        <div className="mt-6">
          <TimeboxPlanner />
        </div>
      </div>
    </main>
  );
};

export default Index;
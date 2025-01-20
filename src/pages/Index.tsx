import { Header } from "@/components/Header";
import { TimeboxPlanner } from "@/components/TimeboxPlanner";
import { useState } from "react";

const Index = () => {
  const [activeView, setActiveView] = useState<"today" | "calendar">("today");

  return (
    <main className="w-full p-4 md:p-8">
      <div className="container mx-auto">
        <Header />
        <div className="mt-6">
          <TimeboxPlanner />
        </div>
      </div>
    </main>
  );
};

export default Index;
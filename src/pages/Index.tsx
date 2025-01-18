import { Header } from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { WeekView } from "@/components/Calendar/WeekView";
import { TimeboxPlanner } from "@/components/TimeboxPlanner/TimeboxPlanner";
import { useState } from "react";

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-[1200px] mx-auto">
            <Header />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
              <div className="lg:col-span-4">
                <div className="sticky top-8">
                  <WeekView onDaySelect={setSelectedDate} selectedDate={selectedDate} />
                </div>
              </div>
              
              <div className="lg:col-span-8">
                <TimeboxPlanner date={selectedDate} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
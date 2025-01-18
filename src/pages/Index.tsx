import { Header } from "@/components/Header";
import { DateDisplay } from "@/components/DateDisplay";
import { TaskCard } from "@/components/TaskCard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { WeekView } from "@/components/Calendar/WeekView";
import { useState } from "react";

const Index = () => {
  const [activeView, setActiveView] = useState<"today" | "calendar">("today");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-[1200px] mx-auto">
            <Header onViewChange={setActiveView} activeView={activeView} />
            
            {activeView === "today" ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
                <div className="md:col-span-4">
                  <DateDisplay />
                </div>
                <div className="md:col-span-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-primary">Today's Tasks</h2>
                    <div className="text-sm text-secondary">Reminders</div>
                  </div>
                  
                  <div className="space-y-4">
                    <TaskCard
                      title="You Have A Meeting"
                      startTime="3:00 PM"
                      endTime="3:30 PM"
                      duration="30 Min"
                      variant="yellow"
                      participants={[
                        { name: "John Doe", avatar: "/placeholder.svg" },
                        { name: "Jane Smith", avatar: "/placeholder.svg" },
                      ]}
                    />
                    
                    <TaskCard
                      title="Call Wiz For Update"
                      startTime="4:20 PM"
                      endTime="4:45 PM"
                      duration="25 Min"
                      variant="blue"
                      participants={[
                        { name: "Wiz Johnson", avatar: "/placeholder.svg" },
                        { name: "Sam Wilson", avatar: "/placeholder.svg" },
                      ]}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <WeekView />
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
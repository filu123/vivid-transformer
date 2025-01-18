import { Header } from "@/components/Header";
import { DateDisplay } from "@/components/DateDisplay";
import { TaskCard } from "@/components/TaskCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto pt-6">
        <Header />
        <DateDisplay />
        
        <div className="px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Today's tasks</h2>
            <div className="text-sm text-secondary">Reminders</div>
          </div>
          
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
  );
};

export default Index;
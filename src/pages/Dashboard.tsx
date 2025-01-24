import { Card } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Quick Stats</h2>
          <p className="text-gray-600">View your activity overview here.</p>
        </Card>
        {/* Add more dashboard content as needed */}
      </div>
    </div>
  );
};

export default Dashboard;
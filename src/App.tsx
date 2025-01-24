import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import Auth from "@/pages/Auth";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import ProjectDetails from "@/pages/ProjectDetails";
import Notes from "@/pages/Notes";
import Reminders from "@/pages/Reminders";
import Calendar from "@/pages/Calendar";
import Habits from "@/pages/Habits";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <SidebarProvider>
          <Toaster />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div className="flex min-h-screen w-full overflow-hidden">
                    <AppSidebar />
                    <div className="flex-1 flex flex-col min-w-0 bg-[#fff7ea]">
                      <Header />
                      <main className="flex-1 overflow-auto">
                        <Outlet />
                      </main>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:id" element={<ProjectDetails />} />
              <Route path="notes" element={<Notes />} />
              <Route path="reminders" element={<Reminders />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="habits" element={<Habits />} />
            </Route>
          </Routes>
        </SidebarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
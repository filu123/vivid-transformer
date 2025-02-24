import { useEffect, useState } from "react";
import { Calendar, LayoutDashboard, FileText, ListTodo, Settings, LogOut, StickyNote, Activity } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { toast } from "sonner";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  // {
  //   title: "Calendar",
  //   url: "/calendar",
  //   icon: Calendar,
  // },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: FileText,
  },
  {
    title: "Habits",
    url: "/dashboard/habits",
    icon: Activity,
  },
  {
    title: "Reminders",
    url: "/dashboard/reminders",
    icon: ListTodo,
  },
  {
    title: "Notes",
    url: "/dashboard/notes",
    icon: StickyNote,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      navigate("/auth");
    }
  };

  return (
    <Sidebar className="border-r border-border/10 mt-10 w-24"> {/* Increased width for better icon visibility */}
      <SidebarContent>
        <div className="flex items-center justify-center p-4">
          <Calendar className="h-8 w-8" /> {/* Increased icon size */}
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={`flex items-center justify-center p-7 ${
                      location.pathname === item.url ? "bg-accent rounded-full" : ""
                    }`}
                  >
                    <a
                      href={item.url}
                      className="flex items-center  justify-center"
                      onClick={(e) => {
                        if (item.url !== "#") {
                          e.preventDefault();
                          navigate(item.url);
                        }
                      }}
                    >
                      <item.icon className="h-8 w-8" /> {/* Increased icon size */}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/10 p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          className="w-full flex items-center justify-center"
        >
          <LogOut className="h-5 w-5" /> {/* Increased icon size */}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
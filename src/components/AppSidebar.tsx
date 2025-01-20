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
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FileText,
  },
  {
    title: "Habits",
    url: "/habits",
    icon: Activity,
  },
  {
    title: "Reminders",
    url: "/reminders",
    icon: ListTodo,
  },
  {
    title: "Notes",
    url: "/notes",
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
    <Sidebar className="border-r border-border/10 w-[4rem]">
      <SidebarContent>
        <div className="flex items-center justify-center p-4">
          <Calendar className="h-6 w-6" />
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={location.pathname === item.url ? "bg-accent" : ""}
                  >
                    <a
                      href={item.url}
                      className="flex items-center justify-center p-2"
                      onClick={(e) => {
                        if (item.url !== "#") {
                          e.preventDefault();
                          navigate(item.url);
                        }
                      }}
                    >
                      <item.icon className="h-5 w-5" />
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
          className="w-full"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
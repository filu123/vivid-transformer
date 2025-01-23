import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const MobileMenu = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navigateAndClose = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-6">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigateAndClose("/notes")}
          >
            Notes
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigateAndClose("/habits")}
          >
            Habits
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigateAndClose("/reminders")}
          >
            Reminders
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigateAndClose("/calendar")}
          >
            Calendar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
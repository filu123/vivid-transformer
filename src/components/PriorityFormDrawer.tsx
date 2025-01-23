import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format, isValid, parse } from "date-fns";
import { Drawer } from "vaul";
import { PriorityFormFields } from "./priority/form/PriorityFormFields";
import { PriorityFormActions } from "./priority/form/PriorityFormActions";

interface DayItem {
  id: string;
  title: string;
  type: "task" | "habit" | "reminder" | "note";
  startTime?: string;
  endTime?: string;
  duration?: string;
  note?: string;
  isDone?: boolean;
  background_color?: string;
}

interface PriorityFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onPriorityAdded: () => void;
  editItem?: DayItem | null;
}

export const PriorityFormDrawer = ({
  isOpen,
  onClose,
  selectedDate,
  onPriorityAdded,
  editItem,
}: PriorityFormDrawerProps) => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [note, setNote] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#ff9b74");
  const { toast } = useToast();

  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title);
      setBackgroundColor(editItem.background_color || "#ff9b74");
      
      if (editItem.startTime) {
        try {
          const parsedStartTime = parse(editItem.startTime, 'HH:mm:ss', new Date());
          if (isValid(parsedStartTime)) {
            setStartTime(format(parsedStartTime, 'HH:mm'));
          }
        } catch (error) {
          console.error('Invalid start time:', error);
          setStartTime('');
        }
      } else {
        setStartTime('');
      }

      if (editItem.endTime) {
        try {
          const parsedEndTime = parse(editItem.endTime, 'HH:mm:ss', new Date());
          if (isValid(parsedEndTime)) {
            setEndTime(format(parsedEndTime, 'HH:mm'));
          }
        } catch (error) {
          console.error('Invalid end time:', error);
          setEndTime('');
        }
      } else {
        setEndTime('');
      }

      setNote(editItem.note || "");
    } else {
      setTitle("");
      setStartTime("");
      setEndTime("");
      setNote("");
      setBackgroundColor("#ff9b74");
    }
  }, [editItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      if (editItem) {
        const { error } = await supabase
          .from("priorities")
          .update({
            title,
            start_time: startTime || null,
            end_time: endTime || null,
            note: note || null,
            date: format(selectedDate, "yyyy-MM-dd"),
            background_color: backgroundColor,
          })
          .eq('id', editItem.id);

        if (error) throw error;

        toast({
          title: "Priority updated successfully",
          description: "Your priority has been updated.",
        });
      } else {
        const { error } = await supabase.from("priorities").insert({
          title,
          start_time: startTime || null,
          end_time: endTime || null,
          note: note || null,
          date: format(selectedDate, "yyyy-MM-dd"),
          user_id: user.id,
          background_color: backgroundColor,
        });

        if (error) throw error;

        toast({
          title: "Priority added successfully",
          description: "Your new priority has been created.",
        });
      }

      onPriorityAdded();
      onClose();
    } catch (error) {
      toast({
        title: editItem ? "Error updating priority" : "Error adding priority",
        description: "There was an error. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-[50%] translate-x-[-50%] w-[90%] max-w-[500px] h-[85vh]">
          <div className="p-4 bg-background rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
            <form onSubmit={handleSubmit} className="space-y-4">
              <PriorityFormFields
                title={title}
                setTitle={setTitle}
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
                note={note}
                setNote={setNote}
                backgroundColor={backgroundColor}
                setBackgroundColor={setBackgroundColor}
              />
              <PriorityFormActions
                onClose={onClose}
                isEditing={!!editItem}
              />
            </form>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
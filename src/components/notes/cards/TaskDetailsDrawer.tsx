import { Drawer } from "vaul";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TaskLabelSelect } from "../form/TaskLabelSelect";

interface TaskDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  task: {
    id: string;
    title: string;
    description?: string;
    date?: string;
    background_color?: string;
    label_id?: string;
    status?: string;
  };
  onUpdate: () => void;
}

export const TaskDetailsDrawer = ({ open, onClose, task, onUpdate }: TaskDetailsDrawerProps) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(task.label_id || null);
  const [backgroundColor, setBackgroundColor] = useState(task.background_color || "#ff9b74");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("tasks_notes")
        .update({
          title,
          description,
          label_id: selectedLabelId,
          background_color: backgroundColor,
        })
        .eq("id", task.id);

      if (error) throw error;

      toast.success("Task updated successfully");
      onUpdate();
      onClose();
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-background flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-[50%] translate-x-[-50%] w-[90%] max-w-[500px] h-[85vh]">
          <div className="p-4 bg-background rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

             

                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    {["#ff9b74", "#fdc971", "#ebc49a", "#322a2f", "#c15626", "#ebe3d6", "#a2a8a5"].map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                          backgroundColor === color ? "ring-2 ring-offset-2 ring-black" : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setBackgroundColor(color)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" type="button" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Task</Button>
                </div>
              </form>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
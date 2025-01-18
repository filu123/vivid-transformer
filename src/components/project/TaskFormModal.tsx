import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface TaskFormModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  editTask?: {
    id: string;
    title: string;
    note?: string;
    status: string;
  };
}

export const TaskFormModal = ({
  projectId,
  isOpen,
  onClose,
  editTask,
}: TaskFormModalProps) => {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("will do");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setNote(editTask.note || "");
      setStatus(editTask.status);
    } else {
      setTitle("");
      setNote("");
      setStatus("will do");
    }
  }, [editTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editTask) {
        const { error } = await supabase
          .from("tasks")
          .update({
            title,
            note,
            status,
          })
          .eq('id', editTask.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Task updated successfully!",
        });
      } else {
        const { error } = await supabase.from("tasks").insert({
          project_id: projectId,
          title,
          note,
          status,
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Task created successfully!",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      onClose();
      setTitle("");
      setNote("");
      setStatus("will do");
    } catch (error) {
      toast({
        title: "Error",
        description: editTask 
          ? "Failed to update task. Please try again."
          : "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editTask ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Note (optional, max 100 characters)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={100}
            />
          </div>
          <div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="will do">Will Do</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editTask ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
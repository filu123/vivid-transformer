import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parse } from "date-fns";

interface ProjectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    id: string;
    name: string;
    status: string;
    dueDate: string;
  };
  onProjectUpdated: () => void;
}

export const ProjectEditModal = ({
  isOpen,
  onClose,
  project,
  onProjectUpdated,
}: ProjectEditModalProps) => {
  const [name, setName] = useState(project.name);
  const [status, setStatus] = useState(project.status);
  const [dueDate, setDueDate] = useState(() => {
    const date = parse(project.dueDate, "MMM d, yyyy", new Date());
    return format(date, "yyyy-MM-dd");
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("projects")
        .update({
          name,
          status,
          due_date: dueDate,
        })
        .eq('id', project.id);

      if (error) throw error;

      toast({
        title: "Project updated successfully",
        description: "Your project has been updated.",
      });

      onProjectUpdated();
      onClose();
    } catch (error) {
      toast({
        title: "Error updating project",
        description: "There was an error. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={70}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date *</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
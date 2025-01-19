import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface HabitTitleInputProps {
  title: string;
  setTitle: (title: string) => void;
}

export const HabitTitleInput = ({ title, setTitle }: HabitTitleInputProps) => {
  return (
    <div>
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
    </div>
  );
};
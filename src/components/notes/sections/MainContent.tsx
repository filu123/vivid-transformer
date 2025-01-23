import { NotesSection } from "./NotesSection";
import { TasksSection } from "./TasksSection";
import { RemindersSection } from "./RemindersSection";
import { ContentTypeFilter } from "../filters/ContentTypeFilter";

type ContentType = "notes" | "tasks" | "reminders";

interface MainContentProps {
  selectedType: ContentType;
  onTypeSelect: (type: ContentType) => void;
  notes: any[];
  selectedColor: string | null;
  onColorSelect: (color: string | null) => void;
  onNotesUpdated: () => void;
}

export const MainContent = ({
  selectedType,
  onTypeSelect,
  notes,
  selectedColor,
  onColorSelect,
  onNotesUpdated,
}: MainContentProps) => {
  return (
    <div className="space-y-6">
      <ContentTypeFilter selectedType={selectedType} onTypeSelect={onTypeSelect} />
      
      <div className="animate-spring-in">
        {selectedType === "notes" && (
          <NotesSection
            notes={notes}
            selectedColor={selectedColor}
            onColorSelect={onColorSelect}
            onNotesUpdated={onNotesUpdated}
          />
        )}
        {selectedType === "tasks" && (
          <TasksSection
            selectedColor={selectedColor}
            onColorSelect={onColorSelect}
          />
        )}
        {selectedType === "reminders" && (
          <RemindersSection
            selectedColor={selectedColor}
            onColorSelect={onColorSelect}
          />
        )}
      </div>
    </div>
  );
};
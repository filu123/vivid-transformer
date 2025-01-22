import { cn } from "@/lib/utils";

type ContentType = "notes" | "tasks" | "reminders";

interface ContentTypeFilterProps {
  selectedType: ContentType;
  onTypeSelect: (type: ContentType) => void;
}

export const ContentTypeFilter = ({
  selectedType,
  onTypeSelect,
}: ContentTypeFilterProps) => {
  return (
    <div className="flex items-center gap-6 mb-8">
      {[
        { id: "notes" as const, label: "Notes" },
        { id: "tasks" as const, label: "Tasks" },
        { id: "reminders" as const, label: "Reminders" },
      ].map((type) => (
        <button
          key={type.id}
          onClick={() => onTypeSelect(type.id)}
          className={cn(
            "text-lg transition-all",
            selectedType === type.id
              ? "font-bold text-foreground"
              : "font-medium text-muted-foreground hover:text-foreground"
          )}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
};
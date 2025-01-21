import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface Category {
  id: string;
  name: string;
  count: number;
  icon: LucideIcon;
  color: string;
}

interface ReminderCategoriesProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const ReminderCategories = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: ReminderCategoriesProps) => {
  return (
    <>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant="ghost"
          className={`h-24 flex items-center justify-start p-4 ${category.color} hover:opacity-90 ${
            selectedCategory === category.id ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onSelectCategory(category.id)}
        >
          <div className="flex items-center space-x-4 w-full">
            <div className="bg-white/80 rounded-full p-3">
              <category.icon className="h-6 w-6 text-black" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-left">{category.name}</h3>
              <p className="text-sm text-muted-foreground text-left">
                {category.count} tasks
              </p>
            </div>
          </div>
        </Button>
      ))}
    </>
  );
};
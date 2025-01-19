import { Card } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  count: number;
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
    <div className="space-y-2">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      {categories.map((category) => (
        <Card
          key={category.id}
          className={`p-4 hover:bg-accent cursor-pointer ${
            selectedCategory === category.id ? "bg-accent" : ""
          }`}
          onClick={() => onSelectCategory(category.id)}
        >
          <div className="flex justify-between items-center">
            <span>{category.name}</span>
            <span className="text-muted-foreground">{category.count}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export interface NoteFormData {
  id?: string;
  title: string;
  description?: string;
  date?: string;
  image_url?: string;
  background_color?: string;
  label_id?: string;
  frequency?: "daily" | "three_times" | "custom" | null;
  custom_days?: number[];
}

export interface FormSubmitData {
  title: string;
  description: string;
  date?: Date;
  image?: File;
  selectedColor: string;
  labelId?: string | null;
  frequency?: "daily" | "three_times" | "custom" | null;
  customDays?: number[];
}

import { Database } from "./types";

export interface DailyData {
  priorities: Array<{
    id: string;
    title: string;
    start_time: string | null;
    end_time: string | null;
    note: string | null;
    is_done: boolean | null;
    background_color?: string;
    created_at: string;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    description: string | null;
    is_done: boolean | null;
  }>;
  notes: Array<{
    id: string;
    title: string;
    description: string | null;
    date: string;
    background_color?: string;
  }>;
  habits: Array<{
    id: string;
    title: string;
    duration_minutes: number;
    isCompleted?: boolean;
    frequency: Database["public"]["Enums"]["habit_frequency"]
    custom_days: number[]; 
  }>;
  reminders: Array<{
    id: string;
    title: string;
    due_date: string | null;
    is_completed: boolean;
    background_color?: string;
  }>;
}

export interface DayItem {
  id: string;
  title: string;
  type: "task" | "habit" | "reminder" | "note";
  startTime?: string;
  endTime?: string;
  duration?: string;
  note?: string;
  isDone?: boolean;
}
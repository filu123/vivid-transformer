
CREATE OR REPLACE FUNCTION public.get_daily_data(p_user_id uuid, p_date date)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN json_build_object(
    'priorities', (
      SELECT json_agg(row_to_json(p))
      FROM (
        SELECT id, user_id, title, start_time, end_time, note, date, is_done, created_at, background_color
        FROM priorities 
        WHERE user_id = p_user_id AND date = p_date
      ) p
    ),
    'notes', (
      SELECT json_agg(row_to_json(n))
      FROM (
        SELECT id, user_id, title, description, date, image_url, background_color, created_at
        FROM notes 
        WHERE user_id = p_user_id AND date = p_date
      ) n
    ),
    'reminders', (
      SELECT json_agg(row_to_json(r))
      FROM (
        SELECT id, user_id, title, is_completed, due_date, category, background_color, created_at
        FROM reminders 
        WHERE user_id = p_user_id AND DATE(due_date) = p_date
      ) r
    ),
    'habits', (
      SELECT json_agg(row_to_json(h))
      FROM (
        SELECT id, user_id, title, frequency, custom_days, duration_months, start_date, duration_minutes, background_color
        FROM habits 
        WHERE user_id = p_user_id
      ) h
    ),
    'tasks', (
      SELECT json_agg(row_to_json(t))
      FROM (
        SELECT id, user_id, title, date, background_color, label_id, status, description, is_done, frequency, custom_days, first_occurrence_date
        FROM tasks_notes 
        WHERE user_id = p_user_id 
        AND (
          -- Regular non-recurring tasks
          (frequency IS NULL AND date = p_date)
          OR
          -- Daily tasks that started on or before p_date and within 365 days
          (frequency = 'daily' 
           AND first_occurrence_date <= p_date 
           AND p_date <= first_occurrence_date + INTERVAL '365 days')
          OR
          -- Three times per week (Monday, Wednesday, Friday)
          (frequency = 'three_times' 
           AND first_occurrence_date <= p_date
           AND p_date <= first_occurrence_date + INTERVAL '365 days'
           AND EXTRACT(DOW FROM p_date) IN (1, 3, 5))
          OR
          -- Custom days
          (frequency = 'custom' 
           AND first_occurrence_date <= p_date
           AND p_date <= first_occurrence_date + INTERVAL '365 days'
           AND EXTRACT(DOW FROM p_date) = ANY(custom_days))
        )
      ) t
    )
  );
END;
$function$

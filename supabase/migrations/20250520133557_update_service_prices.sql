-- Обновляем формат цен для услуг
-- Меняем тип price на INTEGER для услуг
ALTER TABLE public.items 
ALTER COLUMN price TYPE INTEGER USING (
  CASE 
    WHEN is_service THEN 
      NULLIF(REGEXP_REPLACE(price, '[^0-9]', '', 'g'), '')::INTEGER
    ELSE 
      price::TEXT
  END
);

-- Обновляем политики RLS (оставляем без изменений)

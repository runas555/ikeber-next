-- Добавляем поле is_service для разделения товаров и услуг
ALTER TABLE public.items 
ADD COLUMN is_service BOOLEAN DEFAULT FALSE;

-- Обновляем существующие услуги
UPDATE public.items 
SET is_service = TRUE 
WHERE name LIKE 'Услуга:%';

-- Обновляем политики RLS (Row Level Security)
-- Существующие политики остаются без изменений

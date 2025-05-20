-- Обновляем цены услуг: оставляем только числовое значение
UPDATE public.items 
SET price = REGEXP_REPLACE(price, '[^0-9]', '', 'g')
WHERE is_service = TRUE;

-- Добавляем комментарий для фронтенда
COMMENT ON COLUMN public.items.price IS 'Для услуг фронтенд должен добавлять "от" и "р" при отображении';

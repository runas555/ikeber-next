-- Обновляем цены услуг для хранения числового значения
UPDATE public.items 
SET price = REGEXP_REPLACE(price, '[^0-9]', '', 'g')::integer
WHERE is_service = TRUE AND price LIKE 'от%';

-- Комментарий для разработчиков:
-- На фронтенде нужно форматировать цену услуг как "от {price} р"
-- Для товаров оставить текущее форматирование

-- Добавляем статус 'canceled' в существующую таблицу orders
ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('new', 'processing', 'delivered', 'canceled'));

-- Обновляем комментарий к колонке status
COMMENT ON COLUMN public.orders.status IS 'Статус заказа: new, processing, delivered, canceled';

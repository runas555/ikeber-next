-- Создаем таблицу заказов
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  address text NOT NULL,
  items jsonb NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'processing', 'delivered')),
  created_at timestamp with time zone DEFAULT now()
);

-- Создаем индекс для быстрого поиска заказов пользователя
CREATE INDEX idx_orders_user_id ON public.orders(user_id);

-- Добавляем комментарии к таблице и полям
COMMENT ON TABLE public.orders IS 'Таблица заказов пользователей';
COMMENT ON COLUMN public.orders.user_id IS 'ID пользователя, оформившего заказ';
COMMENT ON COLUMN public.orders.address IS 'Адрес доставки';
COMMENT ON COLUMN public.orders.items IS 'Товары в заказе в формате JSON';
COMMENT ON COLUMN public.orders.status IS 'Статус заказа: new, processing, delivered';

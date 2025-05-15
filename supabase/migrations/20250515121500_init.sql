-- Создание таблицы для профилей пользователей
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  phone_number TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Включение RLS (Row Level Security) для таблицы профилей
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Политики доступа для профилей
CREATE POLICY "Пользователи могут читать свои профили" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Пользователи могут обновлять свои профили"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Функция для автоматического создания профиля при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, phone_number)
  VALUES (NEW.id, NEW.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для вызова функции после регистрации
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Таблица товаров
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  old_price NUMERIC(10,2),
  description TEXT,
  full_description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  brand TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT TRUE,
  stock_quantity INTEGER DEFAULT 0,
  images TEXT[],
  specifications JSONB,
  is_featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX idx_products_name ON public.products USING gin (name gin_trgm_ops);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_price ON public.products(price);

-- Включение RLS для таблицы товаров
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Политики доступа для товаров
CREATE POLICY "Все пользователи могут читать товары"
ON public.products FOR SELECT
USING (true);

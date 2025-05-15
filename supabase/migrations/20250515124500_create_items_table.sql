-- Создание таблицы для товаров из items.ts
CREATE TABLE public.items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price TEXT NOT NULL,
  image TEXT NOT NULL,
  provider TEXT NOT NULL,
  description TEXT NOT NULL,
  discount TEXT,
  expiry TEXT,
  is_promotion BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Включение RLS (Row Level Security)
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Политики доступа
CREATE POLICY "Все пользователи могут читать товары" 
ON public.items FOR SELECT 
USING (true);

-- Вставка данных из items.ts
INSERT INTO public.items (
  id, name, category, price, image, provider, description, discount, expiry, is_promotion
) VALUES
(1, 'Ваза ''Лазурь''', 'Товары для дома', '2800 ₽', 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNlcmFtaWN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60', 'Керамика ''Тепло''', 'Элегантная керамическая ваза ручной работы, покрытая лазурной глазурью. Идеально дополнит ваш интерьер.', '10%', 'до 15 июня', true),
(2, 'Набор отверток ''Мастер''', 'Ремонт и услуги', '1200 ₽', 'https://images.unsplash.com/photo-1566937169390-7be4c63b8a0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG9vbHNldHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60', 'ИнструментыПрофи', 'Профессиональный набор из 12 отверток различного типа. Высококачественная сталь, удобные рукоятки.', '10%', NULL, false),
(3, 'Картина ''Закат в горах''', 'Хендмейд и творчество', '5500 ₽', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFpbnRpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60', 'Арт-студия ''Вдохновение''', 'Акриловая живопись на холсте, передающая красоту заката в горах. Размер 40x60 см.', '10%', NULL, false),
(4, 'Беспроводные наушники ''AirSound''', 'Электроника', '3990 ₽', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60', 'ТехноГаджет', 'Стильные беспроводные наушники с отличным качеством звука и длительным временем работы. Bluetooth 5.0.', '15%', 'до 20 июня', true),
(5, 'Футболка ''Минимализм''', 'Одежда и аксессуары', '1500 ₽', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dCUyMHNoaXJ0fGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60', 'СтильГород', 'Базовая хлопковая футболка унисекс с минималистичным принтом. Доступна в разных цветах.', '10%', NULL, false),
(6, 'Книга ''Основы программирования''', 'Книги и хобби', '950 ₽', 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60', 'Книжный Мир', 'Понятное руководство для начинающих программистов. Охватывает основные концепции и языки.', '10%', NULL, false),
(7, 'Набор для ухода за кожей ''Сияние''', 'Красота и здоровье', '3200 ₽', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2tpbmNhcmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60', 'БьютиЛаб', 'Комплексный набор для ежедневного ухода за кожей лица. Включает очищающее средство, тоник и увлажняющий крем.', '10%', NULL, false),
(8, 'Декоративная подушка ''Геометрия''', 'Товары для дома', '1800 ₽', 'https://images.unsplash.com/photo-1588058365548-68365341593d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3VzaGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60', 'УютДекор', 'Стильная декоративная подушка с геометрическим узором. Отлично подойдет для дивана или кресла.', '10%', NULL, false),
(9, 'Услуга: Уборка квартиры', 'Ремонт и услуги', 'от 2500 ₽', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xlYW5pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60', 'Чистый Дом Сервис', 'Профессиональная уборка квартир и домов. Используем экологичные средства.', '10%', NULL, false),
(10, 'Кофемолка ''Аромат Утра''', 'Товары для дома', '2200 ₽', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29mZmVlfGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60', 'КухняПрофи', 'Электрическая кофемолка с регулировкой степени помола. Начните утро с идеального кофе!', '20%', 'до 30 июня', true),
(11, 'Набор для рисования ''Юный Художник''', 'Книги и хобби', '1850 ₽', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFpbnRpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60', 'АртМастер', 'Большой набор для творчества: краски, кисти, карандаши и альбом. Идеально для детей и начинающих.', '15%', 'до 25 июня', true);

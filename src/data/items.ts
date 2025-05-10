export interface Item {
  id: number;
  name: string;
  category: string; // Consider using an enum or a more specific type
  price: string; // Consider number for calculations, then format for display
  image: string;
  provider: string;
  description: string;
  discount?: string; // Optional: Discount percentage (e.g., "20%")
  expiry?: string;   // Optional: Promotion expiry date (e.g., "до 31 мая")
  isPromotion?: boolean; // Optional: Flag to explicitly mark as promotion
}

export const itemsData: Item[] = [
  {
      id: 1,
      name: "Ваза 'Лазурь'",
      category: "Товары для дома",
      price: "2800 ₽",
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNlcmFtaWN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60",
      provider: "Керамика 'Тепло'",
      description: "Элегантная керамическая ваза ручной работы, покрытая лазурной глазурью. Идеально дополнит ваш интерьер.",
      discount: "10%",
      expiry: "до 15 июня",
      isPromotion: true
  },
  {
      id: 2,
      name: "Набор отверток 'Мастер'",
      category: "Ремонт и услуги",
      price: "1200 ₽",
      image: "https://images.unsplash.com/photo-1566937169390-7be4c63b8a0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG9vbHNldHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60",
      provider: "ИнструментыПрофи",
      description: "Профессиональный набор из 12 отверток различного типа. Высококачественная сталь, удобные рукоятки.",
      discount: "10%"
  },
  {
      id: 3,
      name: "Картина 'Закат в горах'",
      category: "Хендмейд и творчество",
      price: "5500 ₽",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFpbnRpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60",
      provider: "Арт-студия 'Вдохновение'",
      description: "Акриловая живопись на холсте, передающая красоту заката в горах. Размер 40x60 см.",
      discount: "10%"
  },
  {
      id: 4,
      name: "Беспроводные наушники 'AirSound'",
      category: "Электроника",
      price: "3990 ₽",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60",
      provider: "ТехноГаджет",
      description: "Стильные беспроводные наушники с отличным качеством звука и длительным временем работы. Bluetooth 5.0.",
      discount: "15%",
      expiry: "до 20 июня",
      isPromotion: true
  },
  {
      id: 5,
      name: "Футболка 'Минимализм'",
      category: "Одежда и аксессуары",
      price: "1500 ₽",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dCUyMHNoaXJ0fGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60",
      provider: "СтильГород",
      description: "Базовая хлопковая футболка унисекс с минималистичным принтом. Доступна в разных цветах.",
      discount: "10%"
  },
  {
      id: 6,
      name: "Книга 'Основы программирования'",
      category: "Книги и хобби",
      price: "950 ₽",
      image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60",
      provider: "Книжный Мир",
      description: "Понятное руководство для начинающих программистов. Охватывает основные концепции и языки.",
      discount: "10%"
  },
  {
      id: 7,
      name: "Набор для ухода за кожей 'Сияние'",
      category: "Красота и здоровье",
      price: "3200 ₽",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2tpbmNhcmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60",
      provider: "БьютиЛаб",
      description: "Комплексный набор для ежедневного ухода за кожей лица. Включает очищающее средство, тоник и увлажняющий крем.",
      discount: "10%"
  },
  {
      id: 8,
      name: "Декоративная подушка 'Геометрия'",
      category: "Товары для дома",
      price: "1800 ₽",
      image: "https://images.unsplash.com/photo-1588058365548-68365341593d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3VzaGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=400&q=60",
      provider: "УютДекор",
      description: "Стильная декоративная подушка с геометрическим узором. Отлично подойдет для дивана или кресла.",
      discount: "10%"
  },
  {
      id: 9,
      name: "Услуга: Уборка квартиры",
      category: "Ремонт и услуги",
      price: "от 2500 ₽",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xlYW5pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60",
      provider: "Чистый Дом Сервис",
      description: "Профессиональная уборка квартир и домов. Используем экологичные средства.",
      discount: "10%"
  },
  {
    id: 10,
    name: "Кофемолка 'Аромат Утра'",
    category: "Товары для дома",
    price: "2200 ₽",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29mZmVlfGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60",
    provider: "КухняПрофи",
    description: "Электрическая кофемолка с регулировкой степени помола. Начните утро с идеального кофе!",
    discount: "20%",
    expiry: "до 30 июня",
    isPromotion: true
  },
  {
    id: 11,
    name: "Набор для рисования 'Юный Художник'",
    category: "Книги и хобби",
    price: "1850 ₽",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFpbnRpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=400&q=60",
    provider: "АртМастер",
    description: "Большой набор для творчества: краски, кисти, карандаши и альбом. Идеально для детей и начинающих.",
    discount: "15%",
    expiry: "до 25 июня",
    isPromotion: true
  }
];

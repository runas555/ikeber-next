import { Item } from '@/types/item';

export const itemsData: Item[] = [
  {
    id: '1',
    name: 'Декоративная подушка "Геометрия"',
    price: 2490,
    description: 'Стильная подушка с геометрическим рисунком, размер 45x45 см',
    category: 'Декор',
    provider: 'HomeStyle',
    image: '/images/pillow-geometry.jpg',
    region: 'Буздяк'
  },
  {
    id: '2',
    name: 'Диванная подушка "Цветы"',
    price: 1890,
    description: 'Мягкая подушка с цветочным принтом',
    category: 'Декор',
    provider: 'ComfortHome',
    image: '/images/pillow-flowers.jpg',
    region: 'Буздяк'
  },
  {
    id: '3',
    name: 'Набор подушек "Минимализм"',
    price: 3990,
    description: '2 подушки в стиле минимализм, серые',
    category: 'Декор',
    provider: 'ModernLife',
    image: '/images/pillow-set.jpg',
    region: 'Буздяк'
  }
];

-- Добавляем поле region в таблицу items (с проверкой существования)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name='items' AND column_name='region') THEN
    ALTER TABLE items ADD COLUMN region TEXT NOT NULL DEFAULT 'Буздяк';
  END IF;
END $$;

-- Создаем индекс для ускорения поиска по региону
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_items_region') THEN
    CREATE INDEX idx_items_region ON items(region);
  END IF;
END $$;

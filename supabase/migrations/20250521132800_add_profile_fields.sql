-- Добавляем поля профиля пользователя
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS name varchar(100),
ADD COLUMN IF NOT EXISTS surname varchar(100),
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS address varchar(200);

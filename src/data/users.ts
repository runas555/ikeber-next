export interface User {
  id: number;
  username: string;
  password?: string; // Опционально, если пароли хранятся в другом месте или хешируются
  email?: string;
  // Другие поля пользователя, если необходимо
}

export const usersData: User[] = [
  {
    id: 1,
    username: "testuser",
    password: "password123", // В реальном приложении пароли должны быть хешированы
    email: "testuser@example.com"
  },
  // Можно добавить других пользователей
];

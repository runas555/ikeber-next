import usersFromFile from './users.json';

export interface User {
  id: number;
  username: string;
  password?: string; // Опционально, если пароли хранятся в другом месте или хешируются
  email?: string;
  // Другие поля пользователя, если необходимо
}

export let usersData: User[] = usersFromFile;

// Функция для обновления usersData в памяти, если это потребуется где-то еще,
// хотя основное обновление будет через перезапись файла и перезагрузку данных.
export const updateUserInMemory = (newUsers: User[]) => {
  usersData = newUsers;
};

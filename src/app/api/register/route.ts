import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { User } from '@/data/users'; // Импортируем тип User

// Определяем тип для данных, ожидаемых в теле запроса
interface NewUserPayload {
  username: string;
  password?: string; // Пароль обязателен для регистрации, но может быть опциональным в других контекстах User
  email?: string;    // Email обязателен для регистрации
}

// Определяем путь к файлу users.json
// process.cwd() дает корневую директорию проекта
const usersFilePath = path.join(process.cwd(), 'src', 'data', 'users.json');

async function getUsers(): Promise<User[]> {
  try {
    const jsonData = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(jsonData) as User[];
  } catch (error) {
    // Если файл не существует или пуст, возвращаем пустой массив
    console.error('Error reading users.json:', error);
    return [];
  }
}

async function saveUsers(users: User[]): Promise<void> {
  try {
    const jsonData = JSON.stringify(users, null, 2); // null, 2 для красивого форматирования JSON
    fs.writeFileSync(usersFilePath, jsonData, 'utf-8');
  } catch (error) {
    console.error('Error writing to users.json:', error);
    // В реальном приложении здесь должна быть более надежная обработка ошибок
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Проверка типов и наличия обязательных полей вручную, так как request.json() возвращает any
    if (typeof payload.username !== 'string' || typeof payload.password !== 'string' || typeof payload.email !== 'string' ||
        !payload.username.trim() || !payload.password.trim() || !payload.email.trim()) {
      return NextResponse.json({ message: 'Все поля (username, password, email) обязательны и должны быть строками' }, { status: 400 });
    }

    const newUser: NewUserPayload = {
      username: payload.username,
      password: payload.password,
      email: payload.email,
    };

    const users = await getUsers();

    // Проверка, существует ли пользователь с таким именем
    if (users.find((u) => u.username === newUser.username)) {
      return NextResponse.json({ message: 'Пользователь с таким именем уже существует' }, { status: 409 }); // 409 Conflict
    }
    
    // Проверка, существует ли пользователь с таким email
    if (users.find((u) => u.email === newUser.email)) {
      return NextResponse.json({ message: 'Пользователь с таким email уже существует' }, { status: 409 });
    }

    const userWithId: User = {
      ...newUser,
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    };

    users.push(userWithId);
    await saveUsers(users);

    // Создаем объект пользователя для ответа без пароля
    const userToReturn = { ...userWithId };
    delete userToReturn.password; // Удаляем свойство password из копии

    return NextResponse.json({ message: 'Пользователь успешно зарегистрирован', user: userToReturn }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Ошибка при регистрации пользователя' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { User } from '@/data/users'; // Импортируем тип User

// Определяем тип для данных, ожидаемых в теле запроса
interface NewUserPayload {
  phoneNumber: string; // Изменено на phoneNumber
  password?: string;   // Пароль обязателен для регистрации
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
    
    // Проверка типов и наличия обязательных полей вручную
    if (typeof payload.phoneNumber !== 'string' || typeof payload.password !== 'string' ||
        !payload.phoneNumber.trim() || !payload.password.trim()) {
      return NextResponse.json({ message: 'Номер телефона и пароль обязательны и должны быть строками' }, { status: 400 });
    }

    const newUser: NewUserPayload = {
      phoneNumber: payload.phoneNumber,
      password: payload.password,
    };

    const users = await getUsers();

    // Проверка, существует ли пользователь с таким номером телефона
    if (users.find((u) => u.phoneNumber === newUser.phoneNumber)) {
      return NextResponse.json({ message: 'Пользователь с таким номером телефона уже существует' }, { status: 409 }); // 409 Conflict
    }

    const userWithId: User = {
      phoneNumber: newUser.phoneNumber, // Явно указываем поля
      password: newUser.password,     // так как newUser теперь другого типа
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

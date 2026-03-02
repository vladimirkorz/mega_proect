// src/utils/hashPass.ts
import bcrypt from "bcrypt";

// Функция хэширования (для регистрации)
export async function hashPass(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Функция сравнения (для входа) - ДОБАВЬТЕ ЭТО, ЕСЛИ НЕТ
export async function comparePass(
  password: string, 
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
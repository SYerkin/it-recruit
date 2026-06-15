# Quick Setup Guide

## Первоначальная настройка

### 1. Установите зависимости

```bash
npm install
```

### 2. Настройте переменные окружения

Скопируйте `env.example` в `.env` и настройте:

```bash
cp env.example .env
```

Отредактируйте `.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-secret-key-change-in-production
```

### 3. Создайте базу данных и примените миграции

```bash
# Генерация Prisma Client
npm run prisma:generate

# Создание первой миграции
npm run prisma:migrate

# При запросе имени миграции введите: init
```

### 4. Запустите сервер

```bash
npm run dev
```

Сервер будет доступен на `http://localhost:3000`

### 5. Проверьте работу

```bash
curl http://localhost:3000/api/health
```

Должен вернуться ответ:
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "..."
}
```

## Переключение на PostgreSQL

### 1. Обновите Prisma схему

В `prisma/schema.prisma` измените:

```prisma
datasource db {
  provider = "postgresql"  // было "sqlite"
  url      = env("DATABASE_URL")
}
```

### 2. Обновите `.env`

```env
DATABASE_URL="postgresql://user:password@localhost:5432/it_recruit?schema=public"
```

### 3. Создайте базу данных PostgreSQL

```bash
createdb it_recruit
# или через psql:
# psql -U postgres
# CREATE DATABASE it_recruit;
```

### 4. Примените миграции

```bash
npm run prisma:generate
npm run prisma:migrate
```

## Полезные команды

```bash
# Открыть Prisma Studio (GUI для базы)
npm run prisma:studio

# Просмотреть статус миграций
npx prisma migrate status

# Сбросить базу данных (ОСТОРОЖНО!)
npx prisma migrate reset
```


# IT Recruit Backend - Prisma Architecture

Backend сервер для системы управления рекрутингом IT-специалистов на базе Prisma ORM.

## Технологии

- **Runtime**: Node.js + Express
- **ORM**: Prisma ORM
- **Database**: 
  - Dev: SQLite (`./dev.db`)
  - Prod: PostgreSQL (через ENV)
- **Validation**: Zod
- **Auth**: JWT + bcryptjs

## Структура проекта

```
backend/
├── prisma/
│   └── schema.prisma          # Prisma схема
├── src/
│   ├── app.js                 # Express app конфигурация
│   ├── server.js              # Точка входа
│   ├── controllers/           # Контроллеры
│   ├── routes/                 # Маршруты API
│   ├── middlewares/            # Middleware (auth, validation)
│   └── utils/                  # Утилиты (prisma client, helpers)
├── package.json
└── .env                        # Переменные окружения
```

## Установка

```bash
# Установка зависимостей
npm install

# Генерация Prisma Client
npm run prisma:generate

# Создание миграций и применение к базе
npm run prisma:migrate
```

## Настройка

### 1. Создайте файл `.env`:

```env
PORT=3000
NODE_ENV=development

# Database URL
# Dev: SQLite
DATABASE_URL="file:./dev.db"

# Prod: PostgreSQL (раскомментируйте для production)
# DATABASE_URL="postgresql://user:password@localhost:5432/it_recruit?schema=public"

# JWT settings
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

### 2. Переключение между SQLite и PostgreSQL

Для **разработки** (SQLite):
```env
DATABASE_URL="file:./dev.db"
```

Для **production** (PostgreSQL):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/it_recruit?schema=public"
```

После изменения `DATABASE_URL` обновите Prisma схему:

```bash
# Обновите provider в prisma/schema.prisma:
# datasource db {
#   provider = "postgresql"  # или "sqlite"
#   url      = env("DATABASE_URL")
# }

# Затем создайте новую миграцию
npm run prisma:migrate
```

## Запуск

### Development режим
```bash
npm run dev
```

### Production режим
```bash
npm start
```

## Prisma команды

```bash
# Генерация Prisma Client
npm run prisma:generate

# Создание и применение миграций
npm run prisma:migrate

# Открыть Prisma Studio (GUI для базы данных)
npm run prisma:studio

# Запустить seed (если настроен)
npm run prisma:seed
```

## Модели данных

### User
- Роли: ADMIN, HR, CANDIDATE
- Идентификация: email или phone (обязательно один из них)
- Связи: Profession, Technologies (many-to-many), Jobs (created), Applications

### Profession
- Справочник профессий (Backend Developer, Frontend Developer и т.д.)
- Связи: Users, Jobs

### Technology
- Справочник технологий (стэк)
- Категории: FRONTEND, BACKEND, DATABASE, DEVOPS, MOBILE, OTHER
- Связи: Users (many-to-many), Jobs (many-to-many)

### Job
- Вакансии
- Статусы: DRAFT, ACTIVE, CLOSED, ARCHIVED
- Типы занятости: FULL_TIME, PART_TIME, CONTRACT, FREELANCE, INTERNSHIP
- Связи: Profession, Technologies (many-to-many), Creator (User), Applications

### Application
- Заявки на вакансии
- Статусы: PENDING, REVIEWED, INTERVIEW, OFFER, ACCEPTED, REJECTED
- Связи: Job, Candidate (User)

## API Endpoints

(Будут добавлены в следующих шагах)

- `/api/health` - Health check
- `/api/auth/*` - Авторизация
- `/api/users/*` - Пользователи
- `/api/jobs/*` - Вакансии
- `/api/applications/*` - Заявки
- `/api/professions/*` - Профессии
- `/api/technologies/*` - Технологии

## Валидация

Используется Zod для валидации запросов. Схемы находятся в `src/utils/validation.js`.

Пример использования:
```javascript
import { validate, createJobSchema } from '../utils/validation.js';

router.post('/', validate(createJobSchema), createJob);
```

## Авторизация

JWT токены используются для аутентификации. Middleware находится в `src/middlewares/auth.middleware.js`.

Пример использования:
```javascript
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

router.get('/protected', authenticate, authorize('ADMIN', 'HR'), handler);
```

## Миграции

При изменении схемы Prisma:

```bash
# Создать миграцию
npm run prisma:migrate

# Имя миграции будет запрошено
```

## Prisma Studio

Визуальный редактор базы данных:

```bash
npm run prisma:studio
```

Откроется на `http://localhost:5555`

## Production Deployment

1. Установите PostgreSQL
2. Обновите `DATABASE_URL` в `.env`
3. Измените `provider` в `prisma/schema.prisma` на `postgresql`
4. Запустите миграции:
   ```bash
   npm run prisma:migrate
   ```
5. Запустите сервер:
   ```bash
   npm start
   ```

## Примечания

- SQLite используется для разработки и тестирования
- PostgreSQL рекомендуется для production
- Prisma автоматически генерирует типы TypeScript (если используется)
- Все миграции сохраняются в `prisma/migrations/`


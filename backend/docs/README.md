# IT Recruit Backend

Backend сервер для системы управления рекрутингом IT-специалистов.

## Технологии

- Node.js
- Express.js
- MongoDB (Mongoose) - для production
- SQLite (better-sqlite3) - для ручных тестов
- JavaScript (ES6+)
- JWT (JSON Web Tokens)
- bcryptjs (хеширование паролей)

## Структура проекта

```
backend/
├── config/          # Конфигурация (база данных)
├── controllers/     # Контроллеры (бизнес-логика)
├── models/          # Модели данных (Mongoose схемы)
│   └── sqlite/      # SQLite модели для тестирования
├── routes/          # Маршруты API
├── services/        # Сервисы (авторизация)
├── middleware/      # Middleware (аутентификация, авторизация)
├── server.js        # Точка входа
└── .env             # Переменные окружения
```

## Модели данных

- **User** - Пользователи с ролями (admin, hr, candidate)
- **Job** - Вакансии
- **Application** - Заявки на вакансии
- **Profession** - Профессии (бэкенд разработчик, фронтенд и т.д.)
- **Technology** - Технологии (стэк)

## Установка

```bash
npm install
```

## Настройка

Создайте файл `.env` на основе `env.example`:

```env
PORT=3000

# Database type: 'mongodb' or 'sqlite'
DB_TYPE=mongodb

# MongoDB settings
MONGODB_URI=mongodb://localhost:27017/it-recruit

# SQLite settings (for manual testing)
SQLITE_DB_PATH=./data/test.db

# JWT settings
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

## Запуск

### Development режим (с автоперезагрузкой)
```bash
npm run dev
```

### Production режим
```bash
npm start
```

## Переключение между базами данных

### MongoDB (по умолчанию)
```bash
DB_TYPE=mongodb npm run dev
```

### SQLite (для ручных тестов)
```bash
DB_TYPE=sqlite npm run dev
```

Или установите `DB_TYPE=sqlite` в файле `.env`.

## Ручное тестирование через терминал

Для ручного тестирования API используйте SQLite базу данных:

```bash
# Запуск с SQLite
DB_TYPE=sqlite npm run dev

# Примеры запросов через curl:
# Регистрация пользователя
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"candidate","firstName":"John","lastName":"Doe"}'

# Вход
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@example.com","password":"password123"}'

# Получить текущего пользователя (нужен токен)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## API Endpoints

### Health Check
- `GET /api/health` - Проверка работы сервера

### Авторизация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход (по email или phone)
- `GET /api/auth/me` - Получить текущего пользователя (требует токен)

### Пользователи (Candidates)
- `GET /api/candidates` - Получить всех кандидатов
- `GET /api/candidates/:id` - Получить кандидата по ID
- `POST /api/candidates` - Создать нового кандидата
- `PUT /api/candidates/:id` - Обновить кандидата
- `DELETE /api/candidates/:id` - Удалить кандидата

### Вакансии (Jobs)
- `GET /api/jobs` - Получить все вакансии (публичный)
- `GET /api/jobs/:id` - Получить вакансию по ID (публичный)
- `POST /api/jobs` - Создать вакансию (HR, Admin)
- `PUT /api/jobs/:id` - Обновить вакансию (HR, Admin)
- `DELETE /api/jobs/:id` - Удалить вакансию (HR, Admin)

### Заявки (Applications)
- `GET /api/applications` - Получить заявки (требует токен)
- `GET /api/applications/:id` - Получить заявку по ID (требует токен)
- `POST /api/applications` - Создать заявку (Candidate)
- `PUT /api/applications/:id` - Обновить заявку (требует токен)
- `DELETE /api/applications/:id` - Удалить заявку (требует токен)

### Профессии (Professions)
- `GET /api/professions` - Получить все профессии (публичный)
- `GET /api/professions/:id` - Получить профессию по ID (публичный)
- `POST /api/professions` - Создать профессию (Admin)
- `PUT /api/professions/:id` - Обновить профессию (Admin)
- `DELETE /api/professions/:id` - Удалить профессию (Admin)

### Технологии (Technologies)
- `GET /api/technologies` - Получить все технологии (публичный)
- `GET /api/technologies/:id` - Получить технологию по ID (публичный)
- `POST /api/technologies` - Создать технологию (Admin)
- `PUT /api/technologies/:id` - Обновить технологию (Admin)
- `DELETE /api/technologies/:id` - Удалить технологию (Admin)

## Авторизация

Система использует JWT токены. Для доступа к защищенным endpoints необходимо:

1. Зарегистрироваться или войти через `/api/auth/login`
2. Получить токен в ответе
3. Добавить заголовок `Authorization: Bearer <token>` в запросы

### Роли пользователей

- **admin** - Полный доступ ко всем операциям
- **hr** - Может создавать и управлять вакансиями, просматривать заявки
- **candidate** - Может создавать заявки на вакансии, просматривать свои заявки

### Идентификация пользователей

Для HR и Candidate основным идентификатором является **email или phone** (обязательно один из них).

## Базы данных

### MongoDB (Production)

Убедитесь, что MongoDB запущен локально или укажите URI в `.env` файле.

### SQLite (Ручные тесты)

SQLite база данных создается автоматически в папке `data/` при первом запуске с `DB_TYPE=sqlite`. Файл базы данных исключен из git через `.gitignore`.

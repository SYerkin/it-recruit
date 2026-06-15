# Документация Backend API

## Общая информация

Backend сервер для системы управления рекрутингом IT-специалистов.

**Технологии:**
- Node.js
- Express.js
- MongoDB (Mongoose) / SQLite (better-sqlite3)
- JWT авторизация
- bcryptjs для хеширования паролей

**База данных:**
- MongoDB - для production
- SQLite - для ручных тестов (переключение через `DB_TYPE=sqlite`)

---

## Модели данных

### 1. User (Пользователь)

Универсальная модель пользователя с поддержкой ролей: admin, hr, candidate.

#### Поля модели

| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| `_id` | ObjectId | Автоматически | Уникальный идентификатор |
| `email` | String | Условно* | Email адрес (уникальный, sparse index) |
| `phone` | String | Условно* | Номер телефона (уникальный, sparse index) |
| `password` | String | ✅ Да | Хешированный пароль (min 6 символов, не возвращается по умолчанию) |
| `role` | String | ✅ Да | Роль: `'admin'`, `'hr'`, `'candidate'` |
| `firstName` | String | Нет | Имя |
| `lastName` | String | Нет | Фамилия |
| `isActive` | Boolean | Нет | Активен ли аккаунт (по умолчанию `true`) |
| `company` | String | Нет | Компания (для HR) |
| `position` | String | Нет | Должность (для HR) |
| `skills` | Array[ObjectId] | Нет | Массив ID технологий (для Candidate) |
| `profession` | ObjectId | Нет | ID профессии (для Candidate, ссылка на Profession) |
| `experience` | Number | Нет | Опыт работы в годах (по умолчанию `0`) |
| `createdAt` | Date | Автоматически | Дата создания |
| `updatedAt` | Date | Автоматически | Дата обновления |

\* **Обязательно указать либо `email`, либо `phone` (хотя бы один из них)**

#### Валидация

- Email: формат email адреса (`/^\S+@\S+\.\S+$/`)
- Phone: формат телефона (`/^\+?[\d\s-()]+$/`)
- Password: минимум 6 символов
- Обязательно наличие email или phone

#### Индексы

- `email` - уникальный, sparse
- `phone` - уникальный, sparse

#### Методы

- `comparePassword(candidatePassword)` - сравнение пароля
- `getIdentifier()` - получение идентификатора (email или phone)

#### Связи

- `skills` → `Technology` (многие ко многим)
- `profession` → `Profession` (один ко многим)

---

### 2. Profession (Профессия)

Справочник профессий (бэкенд разработчик, фронтенд разработчик и т.д.).

#### Поля модели

| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| `_id` | ObjectId | Автоматически | Уникальный идентификатор |
| `name` | String | ✅ Да | Название профессии (уникальное) |
| `slug` | String | ✅ Да | URL-friendly версия названия (уникальное, автоматически генерируется) |
| `description` | String | Нет | Описание профессии |
| `isActive` | Boolean | Нет | Активна ли профессия (по умолчанию `true`) |
| `createdAt` | Date | Автоматически | Дата создания |
| `updatedAt` | Date | Автоматически | Дата обновления |

#### Автоматическая генерация

- `slug` автоматически создается из `name` при сохранении:
  - Преобразуется в lowercase
  - Специальные символы заменяются на дефисы
  - Удаляются дефисы в начале и конце

#### Примеры профессий

- Backend Developer
- Frontend Developer
- Full Stack Developer
- DevOps Engineer
- Mobile Developer
- QA Engineer

---

### 3. Technology (Технология)

Справочник технологий (стэк).

#### Поля модели

| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| `_id` | ObjectId | Автоматически | Уникальный идентификатор |
| `name` | String | ✅ Да | Название технологии (уникальное) |
| `slug` | String | ✅ Да | URL-friendly версия названия (уникальное, автоматически генерируется) |
| `category` | String | Нет | Категория: `'frontend'`, `'backend'`, `'database'`, `'devops'`, `'mobile'`, `'other'` (по умолчанию `'other'`) |
| `description` | String | Нет | Описание технологии |
| `isActive` | Boolean | Нет | Активна ли технология (по умолчанию `true`) |
| `createdAt` | Date | Автоматически | Дата создания |
| `updatedAt` | Date | Автоматически | Дата обновления |

#### Категории технологий

- `frontend` - React, Vue, Angular, HTML/CSS
- `backend` - Node.js, Python, Java, Go
- `database` - MongoDB, PostgreSQL, MySQL
- `devops` - Docker, Kubernetes, AWS, CI/CD
- `mobile` - React Native, Flutter, Swift, Kotlin
- `other` - Прочие технологии

#### Автоматическая генерация

- `slug` автоматически создается из `name` при сохранении

---

### 4. Job (Вакансия)

Модель вакансии работы.

#### Поля модели

| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| `_id` | ObjectId | Автоматически | Уникальный идентификатор |
| `title` | String | ✅ Да | Название вакансии |
| `description` | String | ✅ Да | Описание вакансии |
| `company` | String | ✅ Да | Название компании |
| `location` | String | Нет | Локация (город, страна) |
| `salary` | Object | Нет | Информация о зарплате |
| `salary.min` | Number | Нет | Минимальная зарплата |
| `salary.max` | Number | Нет | Максимальная зарплата |
| `salary.currency` | String | Нет | Валюта (по умолчанию `'USD'`) |
| `profession` | ObjectId | ✅ Да | ID профессии (ссылка на Profession) |
| `technologies` | Array[ObjectId] | Нет | Массив ID технологий (ссылка на Technology) |
| `experience` | Object | Нет | Требуемый опыт |
| `experience.min` | Number | Нет | Минимальный опыт в годах (по умолчанию `0`) |
| `experience.max` | Number | Нет | Максимальный опыт в годах |
| `employmentType` | String | Нет | Тип занятости: `'full-time'`, `'part-time'`, `'contract'`, `'freelance'`, `'internship'` (по умолчанию `'full-time'`) |
| `status` | String | Нет | Статус: `'draft'`, `'active'`, `'closed'`, `'archived'` (по умолчанию `'draft'`) |
| `createdBy` | ObjectId | ✅ Да | ID создателя (ссылка на User, роль HR или Admin) |
| `requirements` | Array[String] | Нет | Массив требований |
| `benefits` | Array[String] | Нет | Массив преимуществ |
| `createdAt` | Date | Автоматически | Дата создания |
| `updatedAt` | Date | Автоматически | Дата обновления |

#### Статусы вакансии

- `draft` - Черновик
- `active` - Активная вакансия
- `closed` - Закрыта
- `archived` - В архиве

#### Типы занятости

- `full-time` - Полная занятость
- `part-time` - Частичная занятость
- `contract` - Контракт
- `freelance` - Фриланс
- `internship` - Стажировка

#### Индексы

- `profession` - для быстрого поиска по профессии
- `status` - для фильтрации по статусу
- `createdBy` - для поиска вакансий HR

#### Связи

- `profession` → `Profession` (один ко многим)
- `technologies` → `Technology` (многие ко многим)
- `createdBy` → `User` (один ко многим)

---

### 5. Application (Заявка на вакансию)

Модель заявки кандидата на вакансию.

#### Поля модели

| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| `_id` | ObjectId | Автоматически | Уникальный идентификатор |
| `job` | ObjectId | ✅ Да | ID вакансии (ссылка на Job) |
| `candidate` | ObjectId | ✅ Да | ID кандидата (ссылка на User) |
| `status` | String | Нет | Статус заявки: `'pending'`, `'reviewed'`, `'interview'`, `'offer'`, `'accepted'`, `'rejected'` (по умолчанию `'pending'`) |
| `coverLetter` | String | Нет | Сопроводительное письмо |
| `resume` | String | Нет | Резюме (путь к файлу или текст) |
| `notes` | String | Нет | Заметки кандидата |
| `hrNotes` | String | Нет | Заметки HR |
| `rating` | Number | Нет | Оценка кандидата (от 1 до 5) |
| `createdAt` | Date | Автоматически | Дата создания |
| `updatedAt` | Date | Автоматически | Дата обновления |

#### Статусы заявки

- `pending` - Ожидает рассмотрения
- `reviewed` - Рассмотрена
- `interview` - Назначено собеседование
- `offer` - Предложен оффер
- `accepted` - Принята
- `rejected` - Отклонена

#### Индексы

- `(job, candidate)` - уникальный составной индекс (один кандидат может подать заявку на вакансию только один раз)
- `candidate` - для поиска заявок кандидата
- `status` - для фильтрации по статусу

#### Связи

- `job` → `Job` (один ко многим)
- `candidate` → `User` (один ко многим)

---

### 6. Candidate (Кандидат) - Legacy модель

Старая модель кандидата. Рекомендуется использовать модель `User` с ролью `candidate`.

#### Поля модели

| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| `_id` | ObjectId | Автоматически | Уникальный идентификатор |
| `firstName` | String | ✅ Да | Имя |
| `lastName` | String | ✅ Да | Фамилия |
| `email` | String | ✅ Да | Email (уникальный) |
| `phone` | String | Нет | Телефон |
| `position` | String | ✅ Да | Позиция |
| `experience` | Number | Нет | Опыт работы (по умолчанию `0`) |
| `skills` | Array[String] | Нет | Навыки (массив строк) |
| `status` | String | Нет | Статус: `'new'`, `'interview'`, `'offer'`, `'hired'`, `'rejected'` (по умолчанию `'new'`) |
| `resume` | String | Нет | Резюме |
| `notes` | String | Нет | Заметки |
| `createdAt` | Date | Автоматически | Дата создания |
| `updatedAt` | Date | Автоматически | Дата обновления |

---

## Схема связей моделей

```
User (admin/hr/candidate)
├── profession → Profession
├── skills → Technology[]
└── createdBy (Job) → Job[]

Job
├── profession → Profession
├── technologies → Technology[]
└── createdBy → User (hr/admin)

Application
├── job → Job
└── candidate → User (candidate)

Profession
└── (используется в User и Job)

Technology
├── (используется в User.skills)
└── (используется в Job.technologies)
```

---

## Роли пользователей

### Admin
- Полный доступ ко всем операциям
- Управление профессиями и технологиями
- Управление всеми вакансиями и заявками
- Управление пользователями

### HR
- Создание и управление вакансиями
- Просмотр и управление заявками на свои вакансии
- Добавление заметок и оценок кандидатам

### Candidate
- Просмотр вакансий
- Создание заявок на вакансии
- Просмотр своих заявок
- Редактирование своего профиля

---

## Авторизация

### JWT токены

Все защищенные endpoints требуют заголовок:
```
Authorization: Bearer <token>
```

### Идентификация пользователей

Для HR и Candidate основным идентификатором является **email или phone** (обязательно указать хотя бы один).

### Регистрация

```json
POST /api/auth/register
{
  "email": "user@example.com",  // или "phone": "+79991234567"
  "password": "password123",
  "role": "candidate",  // или "hr", "admin"
  "firstName": "Иван",
  "lastName": "Иванов"
}
```

### Вход

```json
POST /api/auth/login
{
  "identifier": "user@example.com",  // или номер телефона
  "password": "password123"
}
```

---

## API Endpoints

### Авторизация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Текущий пользователь (требует токен)

### Пользователи
- `GET /api/candidates` - Список кандидатов
- `GET /api/candidates/:id` - Кандидат по ID
- `POST /api/candidates` - Создать кандидата
- `PUT /api/candidates/:id` - Обновить кандидата
- `DELETE /api/candidates/:id` - Удалить кандидата

### Вакансии
- `GET /api/jobs` - Список вакансий (публичный)
- `GET /api/jobs/:id` - Вакансия по ID (публичный)
- `POST /api/jobs` - Создать вакансию (HR, Admin)
- `PUT /api/jobs/:id` - Обновить вакансию (HR, Admin)
- `DELETE /api/jobs/:id` - Удалить вакансию (HR, Admin)

### Заявки
- `GET /api/applications/me` - Мои заявки (Candidate)
- `GET /api/applications/my` - Заявки по моим вакансиям (HR, Admin)
- `GET /api/applications/jobs/:id` - Заявки по вакансии (HR, Admin)
- `GET /api/applications/:id` - Заявка по ID (участник: HR или кандидат)
- `POST /api/applications/jobs/:id/apply` - Подать заявку (Candidate)
- `PUT /api/applications/:id/status` - Обновить статус заявки (HR, Admin). Статусы: `APPLIED`, `SCREENING`, `INTERVIEW`, `OFFER`, `REJECTED`, `HIRED`
- `POST /api/applications/:id/feedback` - Оставить отзыв о процессе (HR или Candidate; только для заявок со статусом `HIRED` или `REJECTED`). Тело: `{ "rating": 1-5, "comment": "..." }`
- `GET /api/applications/:id/feedback` - Список отзывов по заявке (участник)

### Профессии
- `GET /api/professions` - Список профессий (публичный)
- `GET /api/professions/:id` - Профессия по ID (публичный)
- `POST /api/professions` - Создать профессию (Admin)
- `PUT /api/professions/:id` - Обновить профессию (Admin)
- `DELETE /api/professions/:id` - Удалить профессию (Admin)

### Технологии
- `GET /api/technologies` - Список технологий (публичный)
- `GET /api/technologies/:id` - Технология по ID (публичный)
- `POST /api/technologies` - Создать технологию (Admin)
- `PUT /api/technologies/:id` - Обновить технологию (Admin)
- `DELETE /api/technologies/:id` - Удалить технологию (Admin)

---

## Переменные окружения

```env
PORT=3000

# Тип базы данных: 'mongodb' или 'sqlite'
DB_TYPE=mongodb

# MongoDB
MONGODB_URI=mongodb://localhost:27017/it-recruit

# SQLite (для тестирования)
SQLITE_DB_PATH=./data/test.db

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

---

## Примеры использования

### Создание вакансии (HR)

```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Senior Backend Developer",
    "description": "Ищем опытного бэкенд разработчика",
    "company": "IT Company",
    "location": "Москва",
    "profession": "<profession_id>",
    "technologies": ["<tech_id1>", "<tech_id2>"],
    "experience": {
      "min": 3,
      "max": 5
    },
    "employmentType": "full-time",
    "status": "active"
  }'
```

### Создание заявки (Candidate)

```bash
curl -X POST http://localhost:3000/api/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "job": "<job_id>",
    "coverLetter": "Я заинтересован в этой позиции...",
    "resume": "https://example.com/resume.pdf"
  }'
```

---

## Примечания

- Все даты в формате ISO 8601
- Пароли хешируются автоматически при сохранении
- Timestamps (`createdAt`, `updatedAt`) добавляются автоматически
- SQLite поддерживается для ручных тестов, но не все функции могут быть реализованы (например, populate)


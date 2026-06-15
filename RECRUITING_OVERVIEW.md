# IT Recruit — Обзор платформы

IT-рекрутинговая платформа для рынка Казахстана. Связывает кандидатов, HR-специалистов и менторов. Основной продукт — полный цикл найма: от публикации вакансии до выхода сотрудника на работу.

---

## Роли пользователей

| Роль | Описание |
|------|----------|
| `CANDIDATE` | Соискатель. Создаёт профиль, откликается на вакансии, получает приглашения, общается с HR в чате. |
| `HR` | Рекрутер / HR-специалист. Создаёт компанию, публикует вакансии, просматривает кандидатов, управляет откликами через Kanban. |
| `ADMIN` | Администратор платформы. Полный доступ: верификация компаний, модерация менторов, просмотр всех данных. |

---

## Ключевые рекрутинговые флоу

### 1. Кандидат откликается на вакансию

```
Кандидат видит вакансию (/jobs) → открывает детали (/jobs/:id)
→ нажимает "Откликнуться" (POST /api/applications/jobs/:id/apply, cover letter)
→ отклик появляется в списке HR (GET /api/applications/my)
→ HR двигает кандидата по статусам через Kanban (/jobs/:jobId/hiring)
→ Кандидат видит прогресс в таймлайне (/applications/:id/tracking)
→ Чат открывается автоматически при смене статуса
→ Итог: HIRED или REJECTED → обе стороны оставляют отзыв
```

**Статусы заявки:** `APPLIED → SCREENING → INTERVIEW → OFFER → HIRED / REJECTED`

### 2. HR приглашает кандидата

```
HR просматривает список кандидатов (/candidates)
→ открывает профиль (/candidates/:id)
→ отправляет приглашение (POST /api/invitations, с личным сообщением)
→ кандидат видит входящие приглашения в дашборде
→ принимает (PUT /api/invitations/:id/accept) или отклоняет
→ принятое приглашение конвертируется в заявку
```

**Статусы приглашения:** `PENDING → ACCEPTED / DECLINED / EXPIRED`

### 3. Публикация вакансии

```
HR создаёт компанию (/company/create) → верифицирует её через документы
→ создаёт вакансию (/jobs/create): название, описание, зарплата, навыки, формат работы
→ вакансия публикуется (статус ACTIVE) и появляется на /jobs
→ HR управляет откликами через Kanban доску (/jobs/:jobId/hiring)
```

**Статусы вакансии:** `DRAFT → ACTIVE → CLOSED`

### 4. HR-Kanban (управление наймом)

```
Страница /jobs/:jobId/hiring — Kanban-доска по одной вакансии
Колонки = статусы заявок: APPLIED | SCREENING | INTERVIEW | OFFER | HIRED | REJECTED
HR перетаскивает карточки → PUT /api/applications/:id/status
Каждое изменение статуса пишется в историю (application_status_history)
```

### 5. Верификация компании

```
HR создаёт компанию → загружает документы (POST /api/companies/upload-document)
→ подаёт заявку на верификацию (POST /api/companies/verification-request)
→ Админ рассматривает в /admin/verification → одобряет или отклоняет
→ После одобрения у компании флаг isVerified = true
```

---

## Файловая структура

```
it-recruit/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Схема БД (26 таблиц)
│   │   ├── seed.js             # Начальные данные
│   │   └── migrations/         # История миграций
│   ├── src/                    # Основной код сервера
│   │   ├── app.js              # Express app, middleware, подключение роутов
│   │   ├── server.js           # Точка входа (запуск HTTP-сервера)
│   │   ├── controllers/        # Бизнес-логика (16 контроллеров)
│   │   ├── routes/             # Определение маршрутов (16 файлов)
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js  # JWT аутентификация + проверка роли
│   │   └── utils/
│   │       ├── prisma.js       # Prisma Client singleton
│   │       ├── validation.js   # Joi-схемы валидации входных данных
│   │       ├── response.js     # Хелперы для унифицированного ответа
│   │       └── helpers.js      # Вспомогательные функции
│   ├── uploads/                # Загруженные файлы (логотипы, документы, CV)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── App.tsx         # Корень приложения, QueryClient, auth polling
    │   │   ├── store/
    │   │   │   └── auth.store.ts  # Zustand-стор: токен, роль, checkAuth
    │   │   └── styles/
    │   │       └── GlobalStyles.ts # CSS-переменные, глобальные стили
    │   ├── pages/              # Страницы (роуты)
    │   │   ├── Admin/          # Панель администратора
    │   │   ├── Applications/   # Детали заявки
    │   │   ├── Auth/           # Авторизация (Login, Register, ForgotPassword, UserTypeSelection)
    │   │   ├── Candidates/     # Список и профиль кандидата (для HR)
    │   │   ├── Companies/      # Список и страница компании
    │   │   ├── Company/        # Создание и редактирование своей компании (HR)
    │   │   ├── Dashboard/      # Личный кабинет
    │   │   ├── HiringTracking/ # Kanban (HR) и Timeline (кандидат)
    │   │   ├── HomePage/       # Главная страница
    │   │   ├── Jobs/           # Список, детали, создание вакансии
    │   │   ├── Mentors/        # Список менторов и профиль ментора
    │   │   ├── Recommendations/# Рекомендации по обучению
    │   │   └── ResumeBuilder/  # Конструктор резюме
    │   ├── shared/
    │   │   ├── api/            # API-клиенты (по одному файлу на сущность)
    │   │   ├── components/
    │   │   │   └── ProtectedRoute.tsx  # Защита роутов по роли
    │   │   ├── ui/             # UI kit: Button, Card, Badge, Input, Header, Footer, …
    │   │   └── utils/
    │   │       └── formatSalary.ts
    │   └── widgets/
    │       ├── Layout/         # Основной лейаут с роутингом, Header
    │       └── FeedbackButton/ # Плавающая кнопка обратной связи
    └── package.json
```

### Детальнее про `backend/src/`

| Файл / папка | Что делает |
|---|---|
| `app.js` | Собирает Express-приложение: CORS, JSON-парсер, rate limiting на /auth/login и /auth/register, подключает все роуты, 404 и error handlers |
| `server.js` | Запускает HTTP-сервер на порту из `.env` |
| `controllers/admin.controller.js` | Статистика, управление пользователями/компаниями/заявками, верификация, модерация менторов |
| `controllers/application.controller.js` | Создание отклика, получение заявок (кандидат/HR), смена статуса, получение конкретной заявки |
| `controllers/auth.controller.js` | Регистрация, вход, getMe, updateMe, смена и восстановление пароля |
| `controllers/candidate.controller.js` | Список кандидатов (для HR), профиль кандидата, просмотры профиля |
| `controllers/certificate.controller.js` | CRUD сертификатов кандидата |
| `controllers/chat.controller.js` | Чат по заявке: получить сообщения, отправить, отметить прочитанным |
| `controllers/company.controller.js` | CRUD компании, загрузка лого/документов, верификация, отзывы о HR |
| `controllers/favorite.controller.js` | Избранные вакансии кандидата |
| `controllers/feedback.controller.js` | Обратная связь о платформе, заявки на роль ментора |
| `controllers/invitation.controller.js` | Создание приглашения (HR→кандидат), принять/отклонить (кандидат) |
| `controllers/job.controller.js` | Список вакансий с фильтрами, детали, создание, обновление |
| `controllers/mentor.controller.js` | Список менторов, профиль, запрос сессии, оплата, отзывы; CRUD менторов (Admin) |
| `controllers/profile.controller.js` | Профиль кандидата: получить/обновить, CRUD опыта работы и образования |
| `controllers/recommendation.controller.js` | Категории и элементы обучающих рекомендаций |
| `controllers/skill.controller.js` | Справочник навыков; добавление/обновление/удаление навыков в профиле |
| `controllers/stats.controller.js` | Публичная статистика платформы (кандидаты, вакансии, компании) |
| `middlewares/auth.middleware.js` | `authenticate` — проверяет JWT-токен; `authorize(...roles)` — проверяет роль |
| `utils/validation.js` | Joi-схемы для всех входящих данных (регистрация, создание вакансии, заявки и т.д.) |
| `utils/prisma.js` | Экспортирует singleton `PrismaClient` |
| `utils/response.js` | `success(res, data)` и `error(res, msg, status)` — единый формат ответов |

---

## Эндпоинты API

### Auth — `/api/auth`

| Метод | Путь | Роль | Описание |
|-------|------|------|----------|
| POST | `/register` | — | Регистрация (email, password, role) |
| POST | `/login` | — | Вход, возвращает JWT |
| POST | `/forgot-password` | — | Восстановление пароля |
| GET | `/me` | Все | Профиль текущего пользователя |
| PATCH | `/me` | Все | Обновление telegramUsername и т.п. |
| POST | `/change-password` | Все | Смена пароля |

### Jobs — `/api/jobs`

| Метод | Путь | Роль | Описание |
|-------|------|------|----------|
| GET | `/` | — | Список вакансий (фильтры: workMode, experienceLevel, salary, skills, status) |
| GET | `/:id` | — | Детали вакансии |
| POST | `/` | HR, ADMIN | Создать вакансию |
| PUT | `/:id` | HR, ADMIN | Обновить вакансию (статус, поля) |

### Applications — `/api/applications`

| Метод | Путь | Роль | Описание |
|-------|------|------|----------|
| POST | `/jobs/:id/apply` | CANDIDATE | Откликнуться на вакансию |
| GET | `/me` | CANDIDATE | Мои заявки |
| GET | `/my` | HR, ADMIN | Заявки на мои вакансии |
| GET | `/jobs/:id` | HR, ADMIN | Заявки по конкретной вакансии |
| GET | `/:id` | Все | Детали заявки |
| PUT | `/:id/status` | HR, ADMIN | Сменить статус заявки |
| GET | `/:id/chat` | Все | Получить чат по заявке |
| POST | `/:id/chat/messages` | Все | Отправить сообщение в чат |
| POST | `/:id/chat/read` | Все | Отметить чат прочитанным |
| POST | `/:id/feedback` | Все | Оставить отзыв о процессе найма |
| GET | `/:id/feedback` | Все | Получить отзывы по заявке |

### Invitations — `/api/invitations`

| Метод | Путь | Роль | Описание |
|-------|------|------|----------|
| POST | `/` | HR, ADMIN | Отправить приглашение кандидату |
| GET | `/me` | CANDIDATE | Мои входящие приглашения |
| PUT | `/:id/accept` | CANDIDATE | Принять приглашение |
| PUT | `/:id/decline` | CANDIDATE | Отклонить приглашение |
| GET | `/jobs/:id` | HR, ADMIN | Приглашения по вакансии |

### Candidates — `/api/candidates`

| Метод | Путь | Роль | Описание |
|-------|------|------|----------|
| GET | `/:id/public` | — | Публичный профиль кандидата |
| GET | `/me/profile-viewers` | CANDIDATE | Кто просматривал мой профиль |
| GET | `/` | HR, ADMIN | Список всех кандидатов с фильтрами |
| GET | `/:id` | HR, ADMIN | Профиль кандидата (полный) |
| GET | `/:id/reviews` | HR, ADMIN | Отзывы о кандидате |

### Profile — `/api/profile` (только CANDIDATE)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/me` | Мой профиль |
| PUT | `/me` | Обновить профиль |
| POST | `/experience` | Добавить опыт работы |
| PUT | `/experience/:id` | Обновить опыт работы |
| DELETE | `/experience/:id` | Удалить опыт работы |
| POST | `/education` | Добавить образование |
| PUT | `/education/:id` | Обновить образование |
| DELETE | `/education/:id` | Удалить образование |
| POST | `/skills` | Добавить навык |
| PUT | `/skills/:id` | Обновить уровень навыка |
| DELETE | `/skills/:id` | Удалить навык |

### Companies — `/api/companies`

| Метод | Путь | Роль | Описание |
|-------|------|------|----------|
| GET | `/` | — | Все компании |
| GET | `/featured` | — | Избранные/верифицированные компании |
| GET | `/:id` | — | Страница компании |
| GET | `/:id/hr-reviews` | — | Отзывы о HR этой компании |
| GET | `/:id/verification-status` | — | Статус верификации |
| GET | `/me` | HR, ADMIN | Моя компания |
| POST | `/` | HR, ADMIN | Создать компанию |
| PUT | `/` | HR, ADMIN | Обновить компанию |
| POST | `/upload-logo` | HR, ADMIN | Загрузить логотип |
| POST | `/upload-document` | HR, ADMIN | Загрузить документ для верификации |
| POST | `/verification-request` | HR, ADMIN | Подать заявку на верификацию |

### Certificates — `/api/certificates` (только CANDIDATE)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/` | Мои сертификаты |
| POST | `/` | Добавить сертификат |
| PUT | `/:id` | Обновить сертификат |
| DELETE | `/:id` | Удалить сертификат |

### Favorites — `/api/favorites` (только CANDIDATE)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/` | Избранные вакансии |
| POST | `/` | Добавить в избранное |
| DELETE | `/:jobId` | Убрать из избранного |
| GET | `/check/:jobId` | Проверить, в избранном ли вакансия |

### Skills — `/api/skills`

| Метод | Путь | Роль | Описание |
|-------|------|------|----------|
| GET | `/` | — | Справочник навыков |
| POST | `/` | HR, ADMIN | Создать новый навык |

### Mentors — `/api/mentors`

| Метод | Путь | Роль | Описание |
|-------|------|------|----------|
| GET | `/` | — | Список менторов |
| GET | `/:id` | — | Профиль ментора |
| GET | `/:id/reviews` | — | Отзывы о менторе |
| POST | `/:id/request` | Все | Запросить сессию |
| POST | `/:id/pay` | Все | Оплатить сессию |
| POST | `/:id/reviews` | Все | Оставить отзыв |
| POST | `/` | ADMIN | Создать ментора |
| PUT | `/:id` | ADMIN | Обновить ментора |
| DELETE | `/:id` | ADMIN | Удалить ментора |

### Admin — `/api/admin` (только ADMIN)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/stats` | Общая статистика платформы |
| GET | `/users` | Все пользователи |
| POST | `/users/:id/reset-password` | Сбросить пароль пользователя |
| GET | `/companies` | Все компании |
| GET | `/applications` | Все заявки |
| GET | `/feedback` | Обратная связь от пользователей |
| PATCH | `/feedback/:id/read` | Отметить сообщение прочитанным |
| GET | `/mentor-applications` | Заявки на роль ментора |
| PATCH | `/mentor-applications/:id` | Одобрить/отклонить заявку на ментора |
| GET | `/verification-requests` | Заявки на верификацию компаний |
| PATCH | `/verification-requests/:id` | Одобрить/отклонить верификацию |

### Остальные

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/stats/public` | Публичная статистика (кол-во кандидатов, вакансий, компаний) |
| GET | `/api/recommendations` | Категории обучающих материалов |
| GET | `/api/recommendations/:categoryId` | Материалы категории |
| POST | `/api/feedback` | Отправить обратную связь (доступно всем) |
| POST | `/api/feedback/mentor-applications` | Подать заявку на роль ментора |
| GET | `/api/health` | Health check сервера |

---

## Таблицы базы данных

| Таблица | Описание |
|---------|----------|
| `users` | Аккаунты пользователей. Роль: `CANDIDATE`, `HR`, `ADMIN`. Хранит email, пароль (hash), telegramUsername. |
| `candidate_profiles` | Профиль соискателя (1:1 с users). Имя, резюме, GitHub, LinkedIn, аватар, флаги openToWork и isPublicProfile. |
| `candidate_profile_views` | Кто из HR просматривал профиль кандидата. Хранит счётчик просмотров и дату последнего. |
| `work_experiences` | Опыт работы кандидата. Компания, должность, даты, описание. |
| `educations` | Образование кандидата. Учреждение, степень, специальность, даты. |
| `certificates` | Сертификаты кандидата. Название, кто выдал, даты, URL для проверки. |
| `skills` | Справочник навыков платформы. Имя, категория (FRONTEND, BACKEND, DATABASE, DEVOPS, MOBILE, OTHER). |
| `candidate_skills` | Навыки кандидата (many-to-many с skills). Уровень: BASIC / INTERMEDIATE / ADVANCED, лет опыта. |
| `job_skills` | Требуемые навыки вакансии (many-to-many с skills). |
| `companies` | Компании, созданные HR. Название, описание, адрес, ссылка 2GIS, логотип, соцсети, флаг верификации. |
| `jobs` | Вакансии. Заголовок, описание, обязанности, бенефиты, зарплата, дедлайн, формат (OFFICE/REMOTE/HYBRID), уровень (INTERN-SENIOR), статус (DRAFT/ACTIVE/CLOSED). |
| `favorite_jobs` | Избранные вакансии кандидата (many-to-many). |
| `applications` | Отклики кандидатов на вакансии. Статус: APPLIED → SCREENING → INTERVIEW → OFFER → HIRED / REJECTED. Сопроводительное письмо. |
| `application_status_history` | Журнал смен статуса заявки. Кто изменил, с какого на какой, заметка. |
| `conversations` | Чат-комната, привязанная к заявке (1:1). |
| `chat_messages` | Сообщения в чате по заявке. Текст, вложение, флаг прочитанности. |
| `application_feedbacks` | Отзывы после завершения найма (HIRED/REJECTED). HR и кандидат оценивают процесс по критериям (1–10). |
| `invitations` | Приглашения HR → кандидат. Статус: PENDING / ACCEPTED / DECLINED / EXPIRED. Личное сообщение, срок действия. |
| `mentors` | Профили менторов. Специальность, компания, навыки, стоимость и длительность сессии, рейтинг. |
| `mentor_requests` | Заявки на сессию с ментором. Цель, статус (PENDING/PAID/CONFIRMED/COMPLETED/CANCELLED). |
| `mentor_reviews` | Отзывы о менторах (рейтинг 1–5, комментарий). |
| `payments` | Псевдо-платежи за сессии менторов. Сумма в KZT, замаскированные данные карты. |
| `feedback_messages` | Обратная связь от пользователей о платформе. Тип: SUGGESTION / BUG_REPORT / GENERAL. |
| `mentor_applications` | Заявки на получение роли ментора. Рассматривает Admin. |
| `recommendation_categories` | Категории обучающих материалов (курсы, статьи, видео). |
| `recommendation_items` | Конкретные материалы: название, URL, теги, бесплатный/платный. |
| `verification_requests` | Заявки компании на верификацию с документами. Рассматривает Admin. |

---

## Страницы фронтенда

### Публичные страницы

| Путь | Страница | Описание |
|------|----------|----------|
| `/` | `HomePage` | Главная: краткое описание платформы, статистика, CTA |
| `/jobs` | `Jobs` | Список вакансий с фильтрами (уровень, формат, зарплата, навыки) |
| `/jobs/:id` | `JobDetails` | Детали вакансии. Кандидат может откликнуться. |
| `/companies` | `Companies` | Список компаний |
| `/companies/:id` | `CompanyDetails` | Страница компании: описание, вакансии, карта (2GIS), верификация |
| `/mentors` | `MentorsPage` | Каталог менторов с фильтрами по навыкам и цене |
| `/mentors/:id` | `MentorProfilePage` | Профиль ментора, отзывы, форма записи на сессию |
| `/recommendations` | `RecommendationsPage` | Обучающие материалы по категориям |
| `/resume` | `ResumeBuilder` | Конструктор резюме без авторизации |
| `/candidates/:id/public` | (через API) | Публичный профиль кандидата (если включён) |

### Авторизация

| Путь | Страница | Описание |
|------|----------|----------|
| `/auth` | `UserTypeSelection` | Выбор роли при регистрации: кандидат или HR |
| `/register` | `Register` | Форма регистрации |
| `/login` | `Login` | Форма входа |
| `/forgot-password` | `ForgotPassword` | Восстановление пароля |

### Защищённые страницы (авторизация обязательна)

| Путь | Страница | Роль | Описание |
|------|----------|------|----------|
| `/dashboard` | `Dashboard` | Все | Личный кабинет. Для кандидата: мои заявки, приглашения, профиль. Для HR: статистика, активные вакансии. |
| `/candidates` | `Candidates` | HR, ADMIN | Список кандидатов с поиском и фильтрами |
| `/candidates/:id` | `CandidateDetails` | HR, ADMIN | Полный профиль кандидата: навыки, опыт, образование, сертификаты, кнопка "Пригласить" |
| `/applications/:id` | `ApplicationDetails` | Все | Детали заявки: статус, история, чат с HR/кандидатом, форма отзыва |
| `/applications/:id/tracking` | `CandidateTimeline` | CANDIDATE | Таймлайн заявки для кандидата — визуальный прогресс через статусы |
| `/jobs/:jobId/hiring` | `HRKanban` | HR, ADMIN | Kanban-доска заявок по вакансии. Перетаскивание = смена статуса. |
| `/jobs/create` | `CreateJob` | HR, ADMIN | Форма создания вакансии |
| `/company/create` | `CreateCompany` | HR | Форма создания компании |
| `/company/edit` | `EditCompany` | HR | Редактирование компании, загрузка документов, подача на верификацию |

### Панель администратора (`/admin/*`)

| Путь | Страница | Описание |
|------|----------|----------|
| `/admin` | `AdminDashboard` | Общая статистика: пользователи, вакансии, заявки, компании |
| `/admin/users` | `AdminUsers` | Все пользователи, сброс паролей |
| `/admin/companies` | `AdminCompanies` | Все компании платформы |
| `/admin/applications` | `AdminApplications` | Все заявки на найм |
| `/admin/verification` | `AdminVerification` | Заявки компаний на верификацию — одобрить/отклонить |
| `/admin/mentors` | `AdminMentors` | Управление профилями менторов (создать/редактировать/удалить) |
| `/admin/mentor-applications` | `AdminMentorApplications` | Заявки пользователей на роль ментора |
| `/admin/feedback` | `AdminFeedback` | Обратная связь от пользователей платформы |
| `/admin/recommendations` | `AdminRecommendations` | Управление обучающими материалами |

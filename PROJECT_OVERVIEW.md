# IT Recruit — Обзор проекта

IT Recruit — это платформа для найма IT-специалистов в Казахстане. Кандидаты находят работу, HR-менеджеры размещают вакансии и приглашают кандидатов, а администраторы модерируют всё это.

---

## Стек технологий

### Бэкенд
| Что | Зачем |
|-----|-------|
| **Node.js** | Среда выполнения JavaScript на сервере |
| **Express** | Веб-фреймворк — принимает запросы, отдаёт ответы |
| **Prisma ORM** | Работа с базой данных через понятный JavaScript-код |
| **SQLite** (разработка) / **PostgreSQL** (продакшн) | База данных — хранит всех пользователей, вакансии, отклики |
| **JWT (jsonwebtoken)** | Токены авторизации — чтобы знать, кто вошёл в систему |
| **bcryptjs** | Хэширование паролей — пароли хранятся зашифрованными |
| **multer** | Загрузка файлов — аватары, CV, документы компаний |
| **zod** | Валидация данных — проверяет что пришло правильно |
| **express-rate-limit** | Ограничение запросов — защита от перебора паролей |
| **cors** | Разрешает фронтенду обращаться к серверу с другого адреса |
| **dotenv** | Загружает секретные настройки из файла `.env` |

### Фронтенд
| Что | Зачем |
|-----|-------|
| **React 18** | UI-библиотека — строит интерфейс из компонентов |
| **TypeScript** | JavaScript с типами — меньше ошибок при написании кода |
| **Vite** | Инструмент сборки — быстрый dev-сервер и сборка |
| **React Router v6** | Навигация по страницам без перезагрузки браузера |
| **Zustand** | Глобальное состояние — хранит данные авторизации |
| **TanStack React Query** | Загрузка данных с сервера, кэш, повторные запросы |
| **Styled Components** | CSS написан прямо в JavaScript-компонентах |
| **Framer Motion** | Анимации — плавные появления, переходы |
| **Axios** | HTTP-клиент — отправляет запросы к бэкенду |
| **Zod** | Валидация форм |
| **react-hook-form** | Управление формами |
| **Radix UI** | Готовые доступные UI-примитивы (диалоги, вкладки, меню) |
| **Lucide React** | Иконки |
| **Leaflet / react-leaflet** | Карты для адресов компаний |

---

## Запуск проекта

Проект состоит из двух частей — бэкенд и фронтенд. Каждую нужно запустить в отдельном терминале.

### Терминал 1 — Бэкенд

```bash
cd backend
npm run dev
```

Сервер запустится на `http://localhost:3000`

### Терминал 2 — Фронтенд

```bash
cd frontend
npm run dev
```

Сайт откроется на `http://localhost:5173`

### Альтернатива — запустить всё сразу из корня

```bash
npm run full
```

Это запустит оба сервера одновременно в одном терминале (используется пакет `concurrently`).

---

## Структура проекта

```
it-recruit/
├── backend/          ← Серверная часть (Node.js + Express)
├── frontend/         ← Клиентская часть (React + TypeScript)
├── docs/             ← Документация
├── package.json      ← Корневой скрипт для запуска обеих частей
└── PROJECT_OVERVIEW.md
```

---

## Бэкенд — `/backend`

Сервер отвечает на запросы от фронтенда: регистрация, вакансии, отклики и т.д.

```
backend/
├── src/                  ← Главная папка с кодом
│   ├── server.js         ← Точка входа: запускает сервер на порту 3000
│   ├── app.js            ← Настройка Express: подключает все маршруты
│   ├── routes/           ← Маршруты (эндпоинты)
│   ├── controllers/      ← Логика обработки запросов
│   ├── middlewares/      ← Промежуточные функции (проверка авторизации)
│   └── utils/            ← Вспомогательные функции
│
├── prisma/
│   ├── schema.prisma     ← Схема базы данных: все таблицы и их поля
│   ├── seed.js           ← Заполнение базы тестовыми данными
│   └── dev.db            ← Файл базы данных SQLite (создаётся автоматически)
│
├── uploads/              ← Загруженные файлы (аватары, документы, логотипы)
├── .env                  ← Секретные настройки (пароль БД, JWT-секрет)
├── package.json          ← Зависимости и скрипты
└── node_modules/         ← Установленные библиотеки (не трогать руками)
```

### `backend/src/server.js`

Точка входа. Запускает сервер:
- Подключается к базе данных через Prisma
- Если порт 3000 занят — убивает старый процесс
- Запускает Express-сервер на порту 3000

### `backend/src/app.js`

Настройка приложения Express:
- Подключает CORS (разрешает запросы с фронтенда)
- Подключает все маршруты по адресам типа `/api/auth`, `/api/jobs`
- Задаёт лимит на попытки входа — 50 за 15 минут
- Раздаёт загруженные файлы по адресу `/uploads/...`

### `backend/src/routes/` — Эндпоинты

**Что такое эндпоинт?** Это адрес на сервере, который отвечает на конкретный запрос. Например: `GET /api/jobs` — получить список вакансий, `POST /api/auth/login` — войти в систему.

| Файл | Адрес | Что делает |
|------|-------|-----------|
| `auth.routes.js` | `/api/auth` | Регистрация, вход, смена пароля, данные о себе |
| `job.routes.js` | `/api/jobs` | Список вакансий, создание, обновление |
| `profile.routes.js` | `/api/profile` | Профиль кандидата: имя, навыки, опыт |
| `candidate.routes.js` | `/api/candidates` | Список кандидатов для HR |
| `application.routes.js` | `/api/applications` | Отклики на вакансии |
| `invitation.routes.js` | `/api/invitations` | Приглашения от HR кандидатам |
| `company.routes.js` | `/api/companies` | Создание и управление компанией |
| `skill.routes.js` | `/api/skills` | Навыки (React, Go, Python...) |
| `certificate.routes.js` | `/api/certificates` | Сертификаты кандидата |
| `favorite.routes.js` | `/api/favorites` | Избранные вакансии |
| `mentor.routes.js` | `/api/mentors` | Менторы и запись на сессии |
| `feedback.routes.js` | `/api/feedback` | Обратная связь пользователей |
| `recommendation.routes.js` | `/api/recommendations` | Курсы и материалы для обучения |
| `stats.routes.js` | `/api/stats` | Статистика платформы |
| `admin.routes.js` | `/api/admin` | Административные функции |

**Пример маршрута** (`auth.routes.js`):
```js
router.post('/register', validate(registerSchema), register);   // строка 8
router.post('/login', validate(loginSchema), login);            // строка 9
router.get('/me', authenticate, getMe);                         // строка 11
```

### `backend/src/controllers/` — Логика

Здесь написано, что именно делать при каждом запросе. Контроллер принимает запрос, работает с базой данных через Prisma, и отдаёт ответ.

| Файл | Что делает |
|------|-----------|
| `auth.controller.js` | Регистрация пользователя, хэширование пароля, создание JWT-токена |
| `job.controller.js` | Получение списка вакансий с фильтрами, создание вакансии |
| `candidate.controller.js` | Список кандидатов, просмотр профиля |
| `application.controller.js` | Подача заявки, смена статуса, история изменений |
| `company.controller.js` | Создание компании, загрузка логотипа, верификация |
| `mentor.controller.js` | Список менторов, запись на сессию, отзывы |
| `admin.controller.js` | Управление пользователями, верификация компаний |

### `backend/src/middlewares/auth.middleware.js`

**Что такое middleware (промежуточная функция)?** Это код, который выполняется до того, как запрос попадает в контроллер. Проверяет токен авторизации из заголовка запроса.

- `authenticate` — проверяет JWT-токен. Если токена нет или он неверный — возвращает ошибку 401
- `authorize('HR', 'ADMIN')` — проверяет роль пользователя. Если роль не подходит — 403

### `backend/src/utils/` — Вспомогательные функции

| Файл | Что делает |
|------|-----------|
| `prisma.js` | Создаёт и экспортирует единственный экземпляр Prisma-клиента |
| `validation.js` | Схемы валидации (зод): что обязательно, какая длина пароля |
| `response.js` | Единый формат ответов `{ success: true, data: ... }` |
| `helpers.js` | Мелкие утилиты |

### `backend/prisma/schema.prisma` — База данных

Описывает все таблицы базы данных. Основные модели:

| Модель | Что хранит |
|--------|-----------|
| `User` | Пользователи: email, пароль, роль (CANDIDATE / HR / ADMIN) |
| `CandidateProfile` | Профиль кандидата: имя, резюме, навыки, опыт |
| `Company` | Компания HR-менеджера |
| `Job` | Вакансия: название, зарплата, требуемые навыки |
| `Application` | Отклик кандидата на вакансию |
| `Invitation` | Приглашение от HR кандидату |
| `Skill` | Навыки (React, Python, Docker...) |
| `Mentor` | Ментор: имя, специализация, цена сессии |
| `MentorRequest` | Заявка на сессию с ментором |
| `Certificate` | Сертификат кандидата |
| `Conversation / ChatMessage` | Чат между кандидатом и HR по заявке |
| `ApplicationFeedback` | Отзыв о процессе найма (1–10) |
| `FeedbackMessage` | Обратная связь: баги, предложения |

---

## Фронтенд — `/frontend`

Визуальная часть — то, что видит пользователь в браузере.

```
frontend/
├── src/
│   ├── main.tsx              ← Точка входа: вставляет React в HTML
│   ├── app/
│   │   ├── App.tsx           ← Корневой компонент: оборачивает всё в провайдеры
│   │   ├── store/
│   │   │   └── auth.store.ts ← Хранилище Zustand: кто залогинен
│   │   └── styles/
│   │       └── GlobalStyles.ts ← Глобальные CSS-переменные
│   │
│   ├── pages/                ← Страницы приложения
│   ├── widgets/              ← Крупные составные блоки (шапка, лэйаут)
│   ├── shared/               ← Всё общее: UI-компоненты, API, утилиты
│   │   ├── api/              ← Функции для запросов к бэкенду
│   │   ├── components/       ← Общие компоненты (ProtectedRoute)
│   │   └── ui/               ← Кнопки, карточки, поля ввода, бейджи...
│   │
│   ├── features/             ← Зарезервировано для фич (пока пусто)
│   └── entities/             ← Зарезервировано для сущностей (пока пусто)
│
├── index.html                ← HTML-оболочка, куда React вставляет контент
├── vite.config.ts            ← Настройка Vite: алиасы путей (@pages, @shared...)
├── tsconfig.json             ← Настройки TypeScript
└── package.json              ← Зависимости
```

### `frontend/src/main.tsx` — Точка входа

```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>      // ← Включает навигацию по URL
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

### `frontend/src/app/App.tsx` — Корень приложения

Оборачивает всё приложение в:
- `QueryClientProvider` — провайдер React Query для загрузки данных
- `GlobalStyle` — глобальные стили
- Автоматически проверяет токен авторизации каждые 5 минут

### `frontend/src/app/store/auth.store.ts` — Хранилище авторизации

Глобальное состояние (Zustand). Хранит:
- `user` — данные текущего пользователя
- `token` — JWT-токен (сохраняется в localStorage)
- `isAuthenticated` — вошёл ли пользователь
- Методы: `login`, `register`, `logout`, `checkAuth`

### `frontend/src/widgets/Layout/Layout.tsx` — Лэйаут и роутинг

Главный компонент, который:
1. Показывает или скрывает шапку (на страницах входа и регистрации шапки нет)
2. Определяет все маршруты приложения через `<Routes>`

---

## Страницы фронтенда

### Публичные страницы (доступны всем)

#### `/` — Главная страница
**Файл:** [frontend/src/pages/HomePage/HomePage.tsx](frontend/src/pages/HomePage/HomePage.tsx)

Что есть на странице:
- **Hero-секция** (строки 854–964) — большой заголовок, строка поиска, анимированный фон
- **Бегущая строка компаний** (строки 966–978) — логотипы компаний прокручиваются
- **Статистика** (строки 980–1004) — активные вакансии, компании, кандидаты
- **Преимущества** (строки 1006–1070) — карточки-bento "Почему выбирают нас"
- **Экосистема** (строки 1072–1224) — карточки: конструктор резюме, трекинг найма, менторы
- **Свежие вакансии** (строки 1226–1315) — сетка из 6 актуальных вакансий
- **CTA-секция** (строки 1317–1362) — призыв создать аккаунт

Используемые компоненты:
- `JobCard` — [frontend/src/shared/ui/JobCard/JobCard.tsx](frontend/src/shared/ui/JobCard/JobCard.tsx)
- `useAuthStore` — [frontend/src/app/store/auth.store.ts](frontend/src/app/store/auth.store.ts)
- `jobApi, statsApi, companyApi, applicationApi` — [frontend/src/shared/api/](frontend/src/shared/api/)

---

#### `/jobs` — Все вакансии
**Файл:** [frontend/src/pages/Jobs/Jobs.tsx](frontend/src/pages/Jobs/Jobs.tsx)

Список всех вакансий с фильтрами по стеку, графику работы, уровню опыта.

---

#### `/jobs/:id` — Детали вакансии
**Файл:** [frontend/src/pages/Jobs/JobDetails/JobDetails.tsx](frontend/src/pages/Jobs/JobDetails/JobDetails.tsx)

Полная информация о вакансии: описание, требования, компания, кнопка отклика.

---

#### `/companies` — Список компаний
**Файл:** [frontend/src/pages/Companies/Companies.tsx](frontend/src/pages/Companies/Companies.tsx)

Карточки всех компаний на платформе.

---

#### `/companies/:id` — Страница компании
**Файл:** [frontend/src/pages/Companies/CompanyDetails.tsx](frontend/src/pages/Companies/CompanyDetails.tsx)

Описание компании, её вакансии, адрес на карте (Leaflet), фото офиса.

---

#### `/mentors` — Менторы
**Файл:** [frontend/src/pages/Mentors/MentorsPage.tsx](frontend/src/pages/Mentors/MentorsPage.tsx)

Список менторов с фильтрацией по навыкам. Карточка каждого ментора.

---

#### `/mentors/:id` — Профиль ментора
**Файл:** [frontend/src/pages/Mentors/MentorProfilePage.tsx](frontend/src/pages/Mentors/MentorProfilePage.tsx)

Детальная страница ментора, кнопка записи на сессию.
Модальное окно записи: [frontend/src/pages/Mentors/MentorRequestModal.tsx](frontend/src/pages/Mentors/MentorRequestModal.tsx)

---

#### `/recommendations` — Треки развития
**Файл:** [frontend/src/pages/Recommendations/RecommendationsPage.tsx](frontend/src/pages/Recommendations/RecommendationsPage.tsx)

Подборки курсов, книг и статей, сгруппированных по категориям (Frontend, Backend, DevOps...).

---

#### `/resume` — Конструктор резюме
**Файл:** [frontend/src/pages/ResumeBuilder/ResumeBuilder.tsx](frontend/src/pages/ResumeBuilder/ResumeBuilder.tsx)

Интерактивный редактор резюме с превью в реальном времени и экспортом в PDF.
Шапка на этой странице скрыта (строка 48 в Layout.tsx).

---

### Авторизация

#### `/auth` — Выбор типа аккаунта
**Файл:** [frontend/src/pages/Auth/UserTypeSelection/UserTypeSelection.tsx](frontend/src/pages/Auth/UserTypeSelection/UserTypeSelection.tsx)

Выбор роли: "Ищу работу" (CANDIDATE) или "Нанимаю" (HR).

---

#### `/register` — Регистрация
**Файл:** [frontend/src/pages/Auth/Register/Register.tsx](frontend/src/pages/Auth/Register/Register.tsx)

Форма регистрации. Роль передаётся из предыдущего шага.

---

#### `/login` — Вход
**Файл:** [frontend/src/pages/Auth/Login/Login.tsx](frontend/src/pages/Auth/Login/Login.tsx)

Форма входа по email и паролю.

---

#### `/forgot-password` — Сброс пароля
**Файл:** [frontend/src/pages/Auth/ForgotPassword/ForgotPassword.tsx](frontend/src/pages/Auth/ForgotPassword/ForgotPassword.tsx)

---

### Защищённые страницы (только для авторизованных)

#### `/dashboard` — Личный кабинет
**Файл:** [frontend/src/pages/Dashboard/Dashboard.tsx](frontend/src/pages/Dashboard/Dashboard.tsx)

Страница отображается **по-разному** в зависимости от роли пользователя:

**Для HR (строки 758–1141):**
- Статистика: просмотры вакансий, активные вакансии, заявки, собеседования
- Информация о компании
- Последние отклики кандидатов
- Список своих вакансий

**Для CANDIDATE (строки 1144–1873):**
- Статистика: просмотры профиля, отклики, собеседования, избранные
- Список HR, которые просматривали профиль
- Информация о себе (email, Telegram, смена пароля)
- Баннер конструктора резюме
- Последние отклики с их статусами
- Блок профиля с процентом заполненности
- Избранные вакансии
- Входящие приглашения от HR
- История изменений статусов откликов

---

#### `/candidates` — Список кандидатов
**Файл:** [frontend/src/pages/Candidates/Candidates.tsx](frontend/src/pages/Candidates/Candidates.tsx)

Только для HR. Список кандидатов с фильтрами по навыкам.

---

#### `/candidates/:id` — Профиль кандидата
**Файл:** [frontend/src/pages/Candidates/CandidateDetails.tsx](frontend/src/pages/Candidates/CandidateDetails.tsx)

Полный профиль кандидата для HR: навыки, опыт, образование, сертификаты. Кнопка отправить приглашение.

---

#### `/company/create` — Создать компанию
**Файл:** [frontend/src/pages/Company/CreateCompany/CreateCompany.tsx](frontend/src/pages/Company/CreateCompany/CreateCompany.tsx)

Форма создания компании: название, описание, адрес, логотип, соцсети.

---

#### `/company/edit` — Редактировать компанию
**Файл:** [frontend/src/pages/Company/EditCompany/EditCompany.tsx](frontend/src/pages/Company/EditCompany/EditCompany.tsx)

---

#### `/jobs/create` — Создать вакансию
**Файл:** [frontend/src/pages/Jobs/CreateJob/CreateJob.tsx](frontend/src/pages/Jobs/CreateJob/CreateJob.tsx)

Форма создания вакансии: название, описание, зарплата, требуемые навыки, формат работы.

---

#### `/applications/:id` — Детали заявки
**Файл:** [frontend/src/pages/Applications/ApplicationDetails.tsx](frontend/src/pages/Applications/ApplicationDetails.tsx)

Детальная страница конкретного отклика: статус, чат между HR и кандидатом, история изменений.

---

#### `/jobs/:jobId/hiring` — Канбан-доска найма (для HR)
**Файл:** [frontend/src/pages/HiringTracking/HRKanban.tsx](frontend/src/pages/HiringTracking/HRKanban.tsx)

Канбан-доска по одной вакансии: колонки APPLIED → SCREENING → INTERVIEW → OFFER → HIRED/REJECTED. HR перетаскивает карточки кандидатов между колонками.

---

#### `/applications/:applicationId/tracking` — Трекинг отклика (для кандидата)
**Файл:** [frontend/src/pages/HiringTracking/CandidateTimeline.tsx](frontend/src/pages/HiringTracking/CandidateTimeline.tsx)

Таймлайн прохождения отклика: кандидат видит текущий статус и историю изменений.

---

### Административная панель (`/admin/*`)
**Файл:** [frontend/src/pages/Admin/AdminLayout.tsx](frontend/src/pages/Admin/AdminLayout.tsx)

Доступна только пользователям с ролью ADMIN. Шапка и кнопка обратной связи скрыты.

| Путь | Файл | Что делает |
|------|------|-----------|
| `/admin` | `AdminDashboard.tsx` | Общая статистика платформы |
| `/admin/users` | `AdminUsers.tsx` | Список всех пользователей |
| `/admin/companies` | `AdminCompanies.tsx` | Список компаний |
| `/admin/applications` | `AdminApplications.tsx` | Все отклики |
| `/admin/feedback` | `AdminFeedback.tsx` | Сообщения обратной связи |
| `/admin/mentors` | `AdminMentors.tsx` | Управление менторами |
| `/admin/mentor-applications` | `AdminMentorApplications.tsx` | Заявки на роль ментора |
| `/admin/recommendations` | `AdminRecommendations.tsx` | Редактирование треков развития |
| `/admin/verification` | `AdminVerification.tsx` | Верификация компаний |

---

## Общие UI-компоненты — `frontend/src/shared/ui/`

Готовые переиспользуемые блоки интерфейса:

| Компонент | Файл | Что это |
|-----------|------|---------|
| `Button` | `Button/Button.tsx` | Кнопка с вариантами: primary, ghost, outline |
| `Input` | `Input/Input.tsx` | Поле ввода |
| `Card` | `Card/Card.tsx` | Карточка-контейнер |
| `Badge` | `Badge/Badge.tsx` | Маленький ярлык (статус, тег) |
| `JobCard` | `JobCard/JobCard.tsx` | Карточка вакансии (используется везде) |
| `Header` | `Header/Header.tsx` | Шапка страницы |
| `Footer` | `Footer/Footer.tsx` | Подвал страницы |
| `GlassPanel` | `GlassPanel/GlassPanel.tsx` | Стеклянный полупрозрачный блок |
| `CompanyMap` | `CompanyMap/CompanyMap.tsx` | Карта (Leaflet) для адреса компании |
| `Text` | `Text/Text.tsx` | Типографика |
| `Container` | `Container/Container.tsx` | Контейнер с максимальной шириной |

---

## API-слой — `frontend/src/shared/api/`

Все запросы к бэкенду описаны здесь. Каждый файл отвечает за свою область:

| Файл | Что делает |
|------|-----------|
| `client.ts` | Настройка Axios: базовый URL, автодобавление JWT-токена в заголовок |
| `auth.api.ts` | Вход, регистрация, получение профиля |
| `job.api.ts` | Список вакансий, создание, обновление |
| `company.api.ts` | Данные о компаниях |
| `candidate.api.ts` | Список кандидатов, профиль кандидата |
| `application.api.ts` | Отклики: создать, получить, обновить статус |
| `invitation.api.ts` | Приглашения: отправить, принять, отклонить |
| `mentor.api.ts` | Менторы и запись на сессии |
| `skill.api.ts` | Навыки/технологии |
| `certificate.api.ts` | Сертификаты |
| `favorite.api.ts` | Избранные вакансии |
| `stats.api.ts` | Статистика платформы |
| `feedback.api.ts` | Обратная связь |
| `recommendation.api.ts` | Треки развития |
| `admin.api.ts` | Административные функции |
| `profile.api.ts` | Редактирование профиля кандидата |

---

## Виджеты — `frontend/src/widgets/`

Крупные самодостаточные блоки интерфейса:

| Компонент | Файл | Что это |
|-----------|------|---------|
| `Layout` | `Layout/Layout.tsx` | Главный лэйаут: шапка + роутинг + контент |
| `Header` (в Layout) | `Layout/Header.tsx` | Шапка с навигацией и кнопкой входа |
| `FeedbackButton` | `FeedbackButton/FeedbackButton.tsx` | Плавающая кнопка обратной связи (показывается на всех страницах кроме админки) |

---

## Компонент защиты маршрутов

**Файл:** [frontend/src/shared/components/ProtectedRoute.tsx](frontend/src/shared/components/ProtectedRoute.tsx)

Обёртка для страниц, требующих авторизации. Если пользователь не вошёл — перенаправляет на `/login`. Если у пользователя нет нужной роли — показывает ошибку доступа.

Используется в маршрутах `Layout.tsx` строки 62–167.

---

## Технические файлы (кратко)

| Файл / Папка | Что это |
|--------------|---------|
| `node_modules/` | Установленные пакеты — не редактировать руками |
| `.env` | Секретные переменные: JWT_SECRET, DATABASE_URL |
| `.gitignore` | Файлы, которые не попадают в git (node_modules, .env) |
| `package-lock.json` | Зафиксированные версии зависимостей |
| `tsconfig.json` | Настройки компилятора TypeScript |
| `vite.config.ts` | Алиасы путей: `@pages` → `src/pages`, `@shared` → `src/shared` |
| `prisma/migrations/` | История изменений базы данных |
| `dist/` | Собранный фронтенд (после `npm run build`) |

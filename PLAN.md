# IT Recruit — Полный план доработок

> Дата: 2026-04-23  
> Стек: React 18 + TypeScript (Vite, FSD), Express.js + Prisma (SQLite → PostgreSQL)

---

## Статус выполнения

| # | Задача | Статус |
|---|--------|--------|
| 1 | Карта в разделе компании | ✅ Выполнено (2026-04-23) |
| 2 | Взаимные оценки по завершению | ⚙️ Частично выполнено (2026-04-23) |
| 3 | Улучшения раздела компании + логотип | ⚙️ Частично выполнено (2026-04-23) |
| 4 | Раздел Рекомендации (переработка) | ⚙️ Частично выполнено (2026-04-23) |
| **5** | **Раздел Менторы и наставники** | **✅ Выполнено (2026-04-23)** |
| **6** | **Панель администратора** | **✅ Выполнено (2026-04-23)** |
| **7** | **Блок обратной связи** | **✅ Выполнено (бэкенд+API, 2026-04-23)** |
| **8** | **Псевдо-оплата (менторство)** | **✅ Выполнено (2026-04-23)** |
| 9 | Улучшение флоу отклика | ⚙️ Частично выполнено (2026-04-23) |
| **10** | **Hero-блок: 4–5 вакансий** | **✅ Выполнено (2026-04-23)** |
| 11 | Верификация компании | ⚙️ Частично выполнено (2026-04-23) |
| **12** | **Формат зарплаты 600k–1M ₸** | **✅ Выполнено (2026-04-23)** |
| **13** | **Счётчик просмотров вакансии** | **✅ Выполнено (2026-04-23)** |
| **7-frontend** | **Плавающая кнопка обратной связи** | **✅ Выполнено (2026-04-23)** |
| 14 | Общие улучшения | ⚙️ Частично выполнено (2026-04-23) |

### Что сделано в задаче 5 (Менторы):
- **БД:** модели `Mentor`, `MentorRequest`, `MentorReview`, `Payment`, `FeedbackMessage`, `MentorApplication` — миграция применена
- **Бэкенд:** `mentor.controller.js`, `mentor.routes.js` — CRUD, заявки, оплата, отзывы
- **Бэкенд:** `feedback.controller.js`, `feedback.routes.js` — обратная связь и заявки менторов
- **Фронтенд:** `MentorsPage` (`/mentors`) — список с фильтрами по навыку/цене/поиску
- **Фронтенд:** `MentorProfilePage` (`/mentors/:id`) — полный профиль + отзывы
- **Фронтенд:** `MentorRequestModal` — форма заявки (3 шага) с псевдо-оплатой картой
- **Данные:** 5 тестовых менторов добавлены в БД

### Что сделано в задачах 10, 12, 13, 7-frontend (2026-04-23):
- **Утилита `formatSalary`**: `frontend/src/shared/utils/formatSalary.ts` — формат `600k – 1M ₸` вместо `0.6M – 1.0M ₸`
- **JobCard, JobDetails, HomePage** — используют общую утилиту вместо локальных функций
- **Счётчик просмотров (бэкенд)**: теперь считает анонимных посетителей (исправлено условие — не считает только создателя)
- **Счётчик просмотров (фронтенд)**: отображается в `JobDetails` рядом с датой (иконка Eye)
- **Hero-блок**: вакансии отображаются в сетке 6 штук (limit: 6), floating-карточки показывают 2 первые вакансии
- **FeedbackButton** (`/widgets/FeedbackButton`): плавающая фиолетовая кнопка в правом нижнем углу, открывает модалку с формой (имя, email, тип обращения, сообщение), отправляет на `POST /api/feedback`, показывает экран успеха; скрыта в разделе `/admin`

### Что сделано в задаче 6 (Админ-панель):
- **Бэкенд:** `admin.controller.js`, `admin.routes.js` — все эндпоинты под `authorize('ADMIN')`
- **Фронтенд:** `AdminLayout` — тёмный сайдбар с навигацией (`/admin/*`)
- **Фронтенд:** `AdminDashboard` — 8 метрик + статус платформы + заявки по статусам
- **Фронтенд:** `AdminCompanies` — карточки всех компаний с поиском
- **Фронтенд:** `AdminApplications` — таблица заявок с фильтрацией по статусу
- **Фронтенд:** `AdminUsers` — таблица пользователей + смена пароля через модалку
- **Фронтенд:** `AdminMentors` — CRUD менторов с формой редактирования
- **Фронтенд:** `AdminMentorApplications` — просмотр и одобрение/отклонение заявок на менторство
- **Фронтенд:** `AdminFeedback` — просмотр обратной связи с отметкой «прочитано»
- **API:** `admin.api.ts`, `mentor.api.ts`, `feedback.api.ts` — все клиентские функции

---

## Содержание

1. [Карта в разделе компании](#1-карта-в-разделе-компании)
2. [Взаимные оценки по завершению процесса](#2-взаимные-оценки-по-завершению-процесса)
3. [Улучшения раздела компании + логотип](#3-улучшения-раздела-компании--логотип)
4. [Раздел Рекомендации (полная переработка)](#4-раздел-рекомендации-полная-переработка)
5. [Раздел Менторы и наставники](#5-раздел-менторы-и-наставники) ✅
6. [Панель администратора](#6-панель-администратора) ✅
7. [Блок обратной связи](#7-блок-обратной-связи) ✅ (бэкенд)
8. [Псевдо-оплата услуг (менторство, обучение)](#8-псевдо-оплата-услуг-менторство-обучение) ✅
9. [Улучшение флоу отклика и взаимодействия](#9-улучшение-флоу-отклика-и-взаимодействия)
10. [Hero-блок: 4–5 вакансий](#10-hero-блок-45-вакансий)
11. [Верификация компании](#11-верификация-компании)
12. [Формат зарплаты: 600k–1.0M ₸](#12-формат-зарплаты-600k10m-)
13. [Счётчик просмотров вакансии](#13-счётчик-просмотров-вакансии)
14. [Общие улучшения текущего функционала](#14-общие-улучшения-текущего-функционала)

---

## 1. Карта в разделе компании

### Задача
Если у компании заполнено поле `address` или `address2gis` — показывать интерактивную карту на странице компании.

### Бэкенд
- **Нет изменений в схеме.** Поля `address` и `address2gis` уже есть в модели `Company`.
- При `GET /api/companies/:id` убедиться, что поля возвращаются в ответе.

### Фронтенд
**Файл:** `frontend/src/pages/CompanyDetails/`

1. Установить библиотеку карт: `npm i leaflet react-leaflet` (или `@2gis/mapgl`).
   - Leaflet — открытая, без API-ключа, подходит для OSM.
   - 2GIS mapgl — нативная для Казахстана, лучше покрытие.
   - **Рекомендация:** использовать Leaflet + OpenStreetMap для простоты.

2. Добавить компонент `CompanyMap`:
   ```
   frontend/src/shared/ui/CompanyMap/CompanyMap.tsx
   ```
   - Принимает `address: string`.
   - Геокодирует через Nominatim API (бесплатно, без ключа): 
     `https://nominatim.openstreetmap.org/search?q={address}&format=json`
   - Если координаты получены — рендерит `MapContainer` с маркером.
   - Если нет — показывает текстовый адрес без карты.

3. В `CompanyDetails` рядом с адресом:
   ```tsx
   {company.address && <CompanyMap address={company.address} />}
   ```

4. Стили карты: высота `300px`, скруглённые углы, тень.

---

## 2. Взаимные оценки по завершению процесса

### Задача
- **HR оценивает кандидата** после финального статуса (HIRED / REJECTED).
- **Кандидат оценивает HR** после финального статуса.
- Оценки кандидата видны другим HR (в профиле кандидата).
- Оценки HR видны на странице компании (средний рейтинг HR, список отзывов).

### Бэкенд — изменения схемы

**Файл:** `backend/prisma/schema.prisma`

Текущая модель `ApplicationFeedback` имеет `authorId` и `rating`. Нужно расширить:

```prisma
model ApplicationFeedback {
  id            Int         @id @default(autoincrement())
  applicationId Int
  authorId      Int
  authorRole    Role        // CANDIDATE или HR — кто оставил отзыв
  targetRole    Role        // на кого отзыв
  rating        Int         // 1–5
  criteriaRatings Json?     // { communication, professionalism, speed, transparency }
  comment       String?
  isVisible     Boolean     @default(true)
  createdAt     DateTime    @default(now())

  application Application @relation(fields: [applicationId], references: [id])
  author      User        @relation(fields: [authorId], references: [id])
}
```

Добавить поля `authorRole` и `targetRole` (новая миграция).

**Новые эндпоинты:**

```
POST /api/applications/:id/feedback     — оставить отзыв (существует, расширить)
GET  /api/applications/:id/feedback     — получить отзывы по заявке
GET  /api/candidates/:id/reviews        — все отзывы о кандидате (для HR)
GET  /api/companies/:id/hr-reviews      — средний рейтинг HR компании
```

**Логика:**
- Проверять, что заявка в статусе HIRED или REJECTED.
- Один пользователь — один отзыв на заявку.
- `authorRole` определяется автоматически из `req.user.role`.

### Фронтенд

**Где показывать:**

1. **После смены статуса на HIRED/REJECTED** в `ApplicationDetails` (`/applications/:id`):
   - Модальное окно или inline-блок: «Оцените взаимодействие».
   - Форма: звёзды 1–5 + критерии + комментарий.
   - Если уже оставлен отзыв — показать его без возможности редактировать.

2. **Профиль кандидата** (`/candidates/:id`):
   - Новый таб «Отзывы от HR» — список с оценками и комментариями.
   - Средняя оценка в шапке профиля.

3. **Страница компании** (`/companies/:id`):
   - Блок «Команда и HR» — средний рейтинг HR этой компании.
   - Список отзывов кандидатов об HR (без имён HR, агрегировано по компании).

**Компоненты:**
```
frontend/src/shared/ui/StarRating/StarRating.tsx     — выбор/отображение звёзд
frontend/src/shared/ui/ReviewCard/ReviewCard.tsx      — карточка отзыва
frontend/src/features/feedback/FeedbackModal.tsx      — модалка с формой
```

**API:**
```
frontend/src/shared/api/feedback.api.ts
```

---

## 3. Улучшения раздела компании + логотип

### Задача
Показывать все доступные данные. HR может добавить логотип при редактировании.

### Бэкенд

**Схема — добавить поле:**
```prisma
model Company {
  // ...существующие поля...
  logoUrl       String?   // URL логотипа
  website       String?   // сайт компании
  industry      String?   // отрасль (IT, Fintech, E-commerce...)
  socialLinks   Json?     // { linkedin, hh, telegram, instagram }
  isVerified    Boolean   @default(false)  // верификация (см. пункт 11)
}
```

**Загрузка файлов (логотип):**
- Установить `multer` для обработки `multipart/form-data`.
- Эндпоинт: `POST /api/companies/upload-logo` — возвращает URL файла.
- Файлы хранить в `backend/uploads/logos/` (или подключить S3/Cloudinary позже).
- Добавить раздачу статики: `app.use('/uploads', express.static('uploads'))`.

**Файл:** `backend/src/controllers/company.controller.js`
- В `updateCompany` принимать `logoUrl`, `website`, `industry`, `socialLinks`.
- В `getCompany` возвращать все новые поля.

### Фронтенд — страница компании `/companies/:id`

**Добавить блоки:**

| Блок | Условие показа | Данные |
|------|----------------|--------|
| Логотип | всегда | `logoUrl` (или заглушка) |
| Сайт и соцсети | если заполнены | `website`, `socialLinks` |
| Год основания | если заполнен | `foundedYear` |
| Кол-во сотрудников | если заполнено | `employeeCount` |
| Фотографии офиса | если есть | `officePhotos[]` |
| Документы компании | если есть | `documents[]` |
| Карта | если есть адрес | `address` (см. п.1) |
| Средний рейтинг HR | если есть отзывы | из API (см. п.2) |
| Вакансии компании | всегда | список активных Jobs |

### Фронтенд — редактирование компании `/company/edit`

**Файл:** `frontend/src/pages/EditCompany/`

Добавить поля формы:
- **Логотип:** `<input type="file" accept="image/*">` с превью.
  - При выборе — загружать через `POST /api/companies/upload-logo`.
  - Сохранять полученный URL в `logoUrl`.
- **Сайт:** текстовое поле URL.
- **Отрасль:** `<select>` с вариантами (IT, Fintech, E-commerce, Telecom, Other).
- **Соцсети:** отдельные поля для LinkedIn, hh.ru, Telegram, Instagram.

---

## 4. Раздел Рекомендации (полная переработка)

### Текущее состояние
Страница `/recommendations` — минимальная или пустая.

### Задача
Превратить в полноценный образовательный хаб с несколькими разделами.

### Структура страницы

```
/recommendations
├── Подборки курсов по технологиям (React, Node, DevOps...)
├── Карьерные советы (статьи)
├── Топ книг по IT и карьере
├── YouTube каналы и подкасты
├── Резюме: лучшие практики
├── Как пройти собеседование
└── Ментора найти → ссылка на /mentors
```

### Бэкенд

**Новые модели:**

```prisma
model RecommendationCategory {
  id          Int                @id @default(autoincrement())
  title       String
  icon        String?            // emoji или иконка
  sortOrder   Int                @default(0)
  isActive    Boolean            @default(true)
  items       RecommendationItem[]
}

model RecommendationItem {
  id          Int      @id @default(autoincrement())
  categoryId  Int
  title       String
  description String?
  url         String?
  imageUrl    String?
  tags        Json?    // ["React", "Beginner", "Free"]
  isFree      Boolean  @default(true)
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())

  category RecommendationCategory @relation(fields: [categoryId], references: [id])
}
```

**Эндпоинты:**
```
GET  /api/recommendations                         — все категории с items
GET  /api/recommendations/:categoryId             — items одной категории
POST /api/recommendations/categories              — создать категорию (ADMIN)
PUT  /api/recommendations/categories/:id          — редактировать (ADMIN)
POST /api/recommendations/items                   — добавить item (ADMIN)
PUT  /api/recommendations/items/:id               — редактировать (ADMIN)
DELETE /api/recommendations/items/:id             — удалить (ADMIN)
```

### Фронтенд `/recommendations`

**Компоненты:**

```
frontend/src/pages/Recommendations/
├── RecommendationsPage.tsx        — главная
├── CategorySection.tsx            — секция категории
└── ResourceCard.tsx               — карточка ресурса
```

**Дизайн:**
- Горизонтальные табы по категориям (или сайдбар на десктопе).
- Карточки ресурсов: обложка / иконка, название, описание, теги, кнопка «Открыть».
- Бейдж «Бесплатно» / «Платно».
- Фильтр по тегам.
- CTA-блок: «Нужен наставник? → Найти ментора» (ссылка на `/mentors`).

---

## 5. Раздел Менторы и наставники

### Задача
Новый раздел `/mentors` — список менторов, которые помогают джунам и стажёрам. С возможностью подачи заявки и псевдо-оплатой сессии.

### Бэкенд

**Новые модели:**

```prisma
model Mentor {
  id              Int       @id @default(autoincrement())
  userId          Int?      // если зарегистрированный пользователь
  name            String
  avatarUrl       String?
  title           String    // "Senior Frontend Developer at Kaspi"
  company         String?
  bio             String
  skills          Json      // ["React", "TypeScript", "Career coaching"]
  experience      Int       // лет опыта
  pricePerSession Int       // цена в тенге (0 = бесплатно)
  sessionDuration Int       @default(60) // минут
  isActive        Boolean   @default(true)
  rating          Float     @default(0)
  reviewsCount    Int       @default(0)
  createdAt       DateTime  @default(now())

  user        User?          @relation(fields: [userId], references: [id])
  requests    MentorRequest[]
  reviews     MentorReview[]
}

model MentorRequest {
  id          Int       @id @default(autoincrement())
  mentorId    Int
  userId      Int       // кто запросил
  name        String
  email       String
  message     String
  goal        String    // цель: "найти работу", "вырасти до middle", "сменить стек"
  status      MentorRequestStatus @default(PENDING)
  paymentId   Int?
  createdAt   DateTime  @default(now())

  mentor  Mentor   @relation(fields: [mentorId], references: [id])
  user    User     @relation(fields: [userId], references: [id])
  payment Payment? @relation(fields: [paymentId], references: [id])
}

model MentorReview {
  id        Int      @id @default(autoincrement())
  mentorId  Int
  userId    Int
  rating    Int      // 1–5
  comment   String?
  createdAt DateTime @default(now())

  mentor Mentor @relation(fields: [mentorId], references: [id])
  user   User   @relation(fields: [userId], references: [id])
}

enum MentorRequestStatus {
  PENDING
  PAID
  CONFIRMED
  COMPLETED
  CANCELLED
}
```

**Эндпоинты:**
```
GET  /api/mentors                     — список менторов (фильтры: skill, price, rating)
GET  /api/mentors/:id                 — профиль ментора
POST /api/mentors/:id/request         — подать заявку ментору (требует auth)
POST /api/mentors/:id/reviews         — оставить отзыв (после COMPLETED)
GET  /api/mentors/:id/reviews         — отзывы о менторе

# ADMIN
POST /api/mentors                     — добавить ментора
PUT  /api/mentors/:id                 — редактировать
DELETE /api/mentors/:id               — удалить
```

### Фронтенд `/mentors`

```
frontend/src/pages/Mentors/
├── MentorsPage.tsx           — список менторов
├── MentorCard.tsx            — карточка
├── MentorProfile.tsx         — страница /mentors/:id
├── MentorRequestModal.tsx    — форма заявки + псевдо-оплата
└── MentorReviews.tsx         — отзывы
```

**Карточка ментора:**
- Аватар, имя, должность, компания.
- Теги навыков.
- Рейтинг (звёзды).
- Цена сессии в тенге (или «Бесплатно»).
- Кнопка «Записаться».

**Страница ментора:**
- Детальное bio.
- Список навыков.
- Цена и длительность сессии.
- Кнопка «Записаться на сессию» → открывает форму + оплату (см. п. 8).
- Отзывы предыдущих менти.

---

## 6. Панель администратора

### Маршрут: `/admin` (только для роли ADMIN)

### Структура навигации

```
/admin
├── /admin/dashboard         — сводная статистика
├── /admin/companies         — все компании
├── /admin/applications      — все заявки по стадиям
├── /admin/users             — все пользователи
├── /admin/recommendations   — управление разделом рекомендаций
├── /admin/mentors           — управление менторами
├── /admin/verification      — заявки на верификацию компаний
└── /admin/feedback          — обратная связь пользователей
```

### Бэкенд

**Новые эндпоинты (все под middleware `requireAdmin`):**

```
GET  /api/admin/stats                  — общая статистика платформы
GET  /api/admin/companies              — все компании + статус верификации
GET  /api/admin/applications           — все заявки (фильтр по статусу)
GET  /api/admin/users                  — все пользователи
POST /api/admin/users/:id/reset-password — сбросить/изменить пароль
GET  /api/admin/verification-requests  — заявки на верификацию
PATCH /api/admin/verification-requests/:id — одобрить/отклонить
GET  /api/admin/feedback               — обратная связь
PATCH /api/admin/feedback/:id          — отметить как прочитанное/обработанное
```

**Middleware:** `backend/src/middlewares/requireAdmin.js`
```js
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  next();
};
```

### Фронтенд

```
frontend/src/pages/Admin/
├── AdminLayout.tsx               — сайдбар + контент
├── AdminDashboard.tsx            — метрики: users, jobs, applications, companies
├── AdminCompanies.tsx            — таблица компаний
├── AdminApplications.tsx         — таблица заявок (Kanban или таблица с фильтрами)
├── AdminUsers.tsx                — таблица пользователей + смена пароля
├── AdminRecommendations.tsx      — CRUD категорий и ресурсов
├── AdminMentors.tsx              — CRUD менторов
├── AdminVerification.tsx         — заявки на верификацию компаний
└── AdminFeedback.tsx             — просмотр обратной связи
```

**AdminDashboard — карточки метрик:**
- Всего пользователей (HR / Candidates).
- Всего компаний (из них верифицированных).
- Активные вакансии.
- Заявки по статусам (круговая диаграмма или простые числа).

**AdminApplications:**
- Таблица: кандидат → вакансия → компания → статус → дата.
- Фильтры: по статусу, по компании, по дате.
- Клик на строку → детали заявки.

**AdminUsers — смена пароля:**
- Модальное окно с полями `newPassword` + `confirmPassword`.
- `POST /api/admin/users/:id/reset-password` → захешировать через bcrypt на бэке.

**Защита маршрутов:**
```tsx
// frontend/src/widgets/Layout/Layout.tsx
<Route path="/admin/*" element={<RequireRole role="ADMIN"><AdminLayout /></RequireRole>} />
```

---

## 7. Блок обратной связи

### Два типа обратной связи

**A) Общая обратная связь** — пожелания, предложения, баги.
**B) Заявка на стать ментором** — с контактными данными и опытом.

### Бэкенд

**Новые модели:**

```prisma
model FeedbackMessage {
  id        Int      @id @default(autoincrement())
  userId    Int?     // опционально, если авторизован
  name      String
  email     String
  type      FeedbackType
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  user User? @relation(fields: [userId], references: [id])
}

model MentorApplication {
  id           Int      @id @default(autoincrement())
  userId       Int?
  name         String
  email        String
  currentTitle String   // текущая должность
  experience   Int      // лет опыта
  skills       String   // через запятую
  bio          String   // о себе
  motivation   String   // почему хочу быть ментором
  status       MentorApplicationStatus @default(PENDING)
  createdAt    DateTime @default(now())

  user User? @relation(fields: [userId], references: [id])
}

enum FeedbackType {
  SUGGESTION
  BUG_REPORT
  GENERAL
}

enum MentorApplicationStatus {
  PENDING
  APPROVED
  REJECTED
}
```

**Эндпоинты:**
```
POST /api/feedback                      — отправить обратную связь (публичный)
POST /api/mentor-applications           — подать заявку на ментора (публичный)

# ADMIN
GET  /api/admin/feedback                — список сообщений
PATCH /api/admin/feedback/:id          — отметить прочитанным
GET  /api/admin/mentor-applications     — список заявок
PATCH /api/admin/mentor-applications/:id — одобрить → создать Mentor, или отклонить
```

### Фронтенд

**Где разместить:**
- Плавающая кнопка «Обратная связь» в правом нижнем углу на всех страницах.
- Отдельный раздел в футере: «Стать ментором» и «Написать нам».

**Компоненты:**
```
frontend/src/shared/ui/FeedbackButton/FeedbackButton.tsx   — плавающая кнопка
frontend/src/features/feedback/FeedbackModal.tsx           — модалка: тип + поля
frontend/src/features/feedback/MentorApplicationForm.tsx   — расширенная форма заявки ментора
```

**Форма обратной связи:**
- Тип: `select` (Предложение / Баг / Общее).
- Имя, email (предзаполнены если авторизован).
- Сообщение (textarea).
- Кнопка «Отправить» → toast-уведомление.

**Форма заявки ментора:**
- Имя, email, текущая должность.
- Лет опыта (number).
- Навыки (multi-select или text).
- О себе (textarea).
- Почему хочу стать ментором (textarea).

---

## 8. Псевдо-оплата услуг (менторство, обучение)

### Задача
Платные услуги: сессия с ментором, платные обучающие материалы. Псевдо-оплата картой. Суммы в тенге (₸).

### Бэкенд

**Новая модель:**

```prisma
model Payment {
  id            Int           @id @default(autoincrement())
  userId        Int
  amount        Int           // в тенге
  currency      String        @default("KZT")
  type          PaymentType
  referenceId   Int           // ID сессии/ресурса
  status        PaymentStatus @default(PENDING)
  cardLast4     String        // последние 4 цифры карты (маскировано)
  cardHolder    String
  createdAt     DateTime      @default(now())

  user          User          @relation(fields: [userId], references: [id])
  mentorRequest MentorRequest?
}

enum PaymentType {
  MENTOR_SESSION
  COURSE_ACCESS
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
}
```

**Эндпоинт:**
```
POST /api/payments/process      — "обработать" платёж
  body: { cardNumber, cardExpiry, cvv, cardHolder, amount, type, referenceId }
  
  Логика:
  1. Валидация формата карты (Luhn для UX, но не реальная проверка).
  2. Сохранить Payment с cardLast4 (последние 4 цифры), замаскировать остальное.
  3. Вернуть { success: true, paymentId }.
  4. Обновить статус MentorRequest на PAID.
```

**ВАЖНО:** Никаких реальных платёжных систем. Данные карты НЕ хранятся полностью.

### Фронтенд

**Компонент:**
```
frontend/src/features/payment/PaymentModal.tsx
```

**Форма оплаты:**
- Сумма к оплате (выделена крупно, в ₸).
- Номер карты (маска: `0000 0000 0000 0000`).
- Срок действия (`MM/YY`).
- CVV (3 цифры, `type="password"`).
- Имя держателя карты.
- Кнопка «Оплатить X ₸».
- Лоадер на 1–2 секунды → «Оплата прошла успешно!».

**Интеграция:**
- Открывается из `MentorRequestModal` после заполнения заявки.
- Открывается из карточки платного ресурса в `/recommendations`.

**Цены для менторства (примеры):**
- Junior: 5 000 ₸ / сессия (60 мин).
- Middle: 10 000 ₸ / сессия.
- Senior: 20 000 ₸ / сессия.

---

## 9. Улучшение флоу отклика и взаимодействия

### Текущие проблемы
- Неочевидный процесс прохождения этапов.
- Чат слабо выделен визуально.
- Нет прогресс-индикатора для кандидата.

### Детальный дизайн флоу

#### A. Страница отклика кандидата (`/jobs/:id` → Apply)

**Было:** простая форма с cover letter.
**Стало:**
1. Модальное окно в 3 шага:
   - Шаг 1: «Ваше резюме готово?» — предпросмотр профиля кандидата.
   - Шаг 2: Cover letter (необязательно, но рекомендовано).
   - Шаг 3: Подтверждение — превью того, что увидит HR + кнопка «Откликнуться».
2. Прогресс-бар шагов сверху (1 → 2 → 3).
3. После успеха: анимированный success-экран «Отклик отправлен!» + кнопка «Отслеживать статус».

#### B. Timeline кандидата (`/applications/:id/tracking`)

**Визуальные улучшения:**
- Вертикальный timeline с иконками на каждом этапе.
- Текущий этап выделен цветом (active pulse-анимация).
- Пройденные — зелёные с галочкой.
- Будущие — серые.

```
● APPLIED        ✓ 15 января 10:23
● SCREENING      ✓ 18 января 14:05  — "HR просматривает резюме"
● INTERVIEW      ← текущий (пульсирует) — "Ожидайте приглашения на интервью"
○ OFFER          (будущий, серый)
○ HIRED / REJECTED
```

- На каждом этапе: дата изменения + пояснительный текст.
- Кнопка «Открыть чат с HR» (если есть сообщения — бейдж с кол-вом непрочитанных).

#### C. Чат в заявке (`/applications/:id`)

**Улучшения:**
- Вынести чат в более заметное место (не скрытый таб, а полноценный раздел).
- Визуальное разделение: HR (слева, другой цвет) и кандидат (справа).
- Время сообщений.
- Статус прочтения (галочки).
- Возможность прикрепить файл.

#### D. Kanban HR (`/jobs/:jobId/hiring`)

**Улучшения:**
- Drag & drop карточек между колонками (статусами).
- Карточка кандидата: фото, имя, дата отклика, метки (навыки, источник).
- Быстрые действия: написать, посмотреть резюме, изменить статус.
- Фильтры над доской: по дате, по навыкам, по источнику.

#### E. Уведомления (упрощённая версия)

- Toast-уведомления при изменении статуса заявки.
- Бейдж на иконке «Заявки» в навбаре (количество новых активностей).

---

## 10. Hero-блок: 4–5 вакансий

### Задача
На главной странице в hero-секции сейчас показываются 2 вакансии. Сделать 4–5.

### Бэкенд
**Файл:** `backend/src/controllers/job.controller.js`

Эндпоинт `GET /api/jobs/featured` (или параметр в `GET /api/jobs?featured=true&limit=5`):
- Вернуть 5 последних активных вакансий (сортировка по `createdAt DESC` + `viewsCount DESC`).
- Если такого эндпоинта нет — добавить параметр `limit` к существующему `GET /api/jobs`.

### Фронтенд
**Файл:** `frontend/src/pages/HomePage/`

- Найти блок с featured вакансиями.
- Изменить запрос: `limit=5` вместо `limit=2`.
- Если используется статический массив — переключить на API-запрос.
- Адаптивная сетка: на десктопе 3+2 или 5 в ряд, на мобиле — горизонтальный скролл карточек.

---

## 11. Верификация компании

### Задача
HR подаёт заявку на верификацию с документами → Значок «✓ Проверено» на компании.

### Бэкенд

**Новая модель:**

```prisma
model VerificationRequest {
  id          Int                    @id @default(autoincrement())
  companyId   Int
  submittedById Int                  // userId HR
  documents   Json                   // [{ name, url }]
  comment     String?
  status      VerificationStatus     @default(PENDING)
  adminComment String?               // комментарий при отклонении
  reviewedAt  DateTime?
  reviewedById Int?                  // adminId
  createdAt   DateTime               @default(now())

  company     Company @relation(fields: [companyId], references: [id])
  submittedBy User    @relation("SubmittedBy", fields: [submittedById], references: [id])
  reviewedBy  User?   @relation("ReviewedBy", fields: [reviewedById], references: [id])
}

enum VerificationStatus {
  PENDING
  APPROVED
  REJECTED
}
```

**В модели Company добавить:**
```prisma
isVerified         Boolean  @default(false)
verificationRequests VerificationRequest[]
```

**Эндпоинты:**
```
POST /api/companies/verification-request   — подать заявку (HR, загрузить документы)
GET  /api/companies/:id/verification-status — статус заявки

# ADMIN
GET  /api/admin/verification-requests      — список заявок
PATCH /api/admin/verification-requests/:id — approve / reject
  При approve: company.isVerified = true
  При reject: adminComment сохраняется, уведомление HR
```

**Загрузка документов:**
- Использовать `multer` (как для логотипа, п.3).
- Эндпоинт: `POST /api/companies/upload-document` → сохраняет в `uploads/documents/`.

### Фронтенд

**Бейдж на компании:**
```tsx
// В CompanyCard и CompanyDetails
{company.isVerified && (
  <VerifiedBadge title="Компания проверена администратором">
    <ShieldCheck size={16} /> Проверено
  </VerifiedBadge>
)}
```

**Форма заявки (в `/company/edit` или отдельная страница):**
- Список требуемых документов (пояснение: свидетельство о регистрации, ИНН, etc.).
- Загрузка файлов (drag & drop или кнопка).
- Статус текущей заявки: «На рассмотрении» / «Одобрено» / «Отклонено: [причина]».

**AdminVerification (`/admin/verification`):**
- Таблица заявок: компания, HR, дата, статус.
- Открыть заявку → посмотреть документы (ссылки на скачивание).
- Кнопки «Одобрить» / «Отклонить» (с полем для комментария при отклонении).

---

## 12. Формат зарплаты: 600k–1.0M ₸

### Задача
Изменить отображение: `0.6M ₸` → `600k ₸`, `1.5M ₸` → `1.5M ₸`.

### Логика форматирования

```typescript
// frontend/src/shared/utils/formatSalary.ts

export function formatSalary(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    // Показывать десятые если есть: 1.5M, но не 1.0M → 1M
    return m % 1 === 0 ? `${m}M` : `${m.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}k`;
  }
  return value.toString();
}

// Для диапазона:
export function formatSalaryRange(min: number, max: number, currency = '₸'): string {
  return `${formatSalary(min)} – ${formatSalary(max)} ${currency}`;
}
// Примеры:
// 600000 → "600k"
// 1000000 → "1M"
// 1500000 → "1.5M"
// 600000–1000000 → "600k – 1M ₸"
// 600000–1500000 → "600k – 1.5M ₸"
```

### Где применить
- `frontend/src/shared/ui/JobCard/JobCard.tsx` — карточка вакансии.
- `frontend/src/pages/JobDetails/` — страница вакансии.
- `frontend/src/pages/HomePage/` — featured вакансии в hero.
- `frontend/src/pages/Jobs/` — список вакансий.
- Любое место где рендерится `salaryMin` / `salaryMax`.

Создать утилиту один раз, использовать везде через импорт.

---

## 13. Счётчик просмотров вакансии

### Задача
Показывать количество просмотров на странице вакансии. Поле `viewsCount` уже есть в модели `Job`.

### Бэкенд
**Файл:** `backend/src/controllers/job.controller.js`

В хендлере `GET /api/jobs/:id`:
```js
// Инкрементировать при каждом запросе (кроме запросов самого HR-создателя)
if (req.user?.id !== job.creatorId) {
  await prisma.job.update({
    where: { id },
    data: { viewsCount: { increment: 1 } },
  });
}
```
Убедиться, что `viewsCount` включён в `select` ответа.

**Дополнительно (опционально):** дедупликация по IP/сессии — можно добавить позже.

### Фронтенд
**Файл:** `frontend/src/pages/JobDetails/`

```tsx
<span title="Просмотры">
  <Eye size={14} />
  {job.viewsCount} просмотров
</span>
```

Показывать рядом с датой публикации в шапке вакансии.

---

## 14. Общие улучшения текущего функционала

### A. Производительность и UX

| Проблема | Решение |
|----------|---------|
| Нет skeleton-лоадеров | Добавить `<Skeleton>` при загрузке карточек вакансий и компаний |
| Нет infinite scroll или пагинации | Добавить пагинацию в `/jobs` и `/companies` |
| Фильтры сбрасываются при навигации | Сохранять в URL params (useSearchParams) |
| Нет обработки ошибок API | Добавить error boundaries + toast-уведомления |
| Нет empty state | Показывать «Вакансий не найдено» с иллюстрацией |

### B. Профиль кандидата

- Добавить поле «GitHub» и «LinkedIn» в профиль.
- Поддержка загрузки аватара (аналогично логотипу компании).
- «Процент заполненности профиля» — мотивирует заполнить все поля.
- Публичная ссылка на профиль: `/candidates/:id/public` уже есть — добавить кнопку «Поделиться профилем».

### C. Вакансии

- Похожие вакансии на странице вакансии (по совпадению навыков).
- Поле «Дедлайн подачи» (`applyDeadline: DateTime?`) в модели `Job`.
- Статус «Горячая вакансия» (`isHot: Boolean`) — выделять визуально.

### D. HR-инструменты

- Шаблоны сообщений при смене статуса (SCREENING, INTERVIEW, OFFER).
- Экспорт списка кандидатов в CSV.
- Дублирование вакансии (POST /api/jobs/:id/duplicate).

### E. SEO и мета-теги

- Динамические `<title>` и `<meta description>` на страницах вакансий и компаний.
- Open Graph теги для шаринга в соцсетях.

### F. Безопасность

- Rate limiting на эндпоинты auth (`/api/auth/login`, `/api/auth/register`).
- Валидация размера и типа файлов при загрузке (макс. 5MB, только image/* или PDF).
- CORS origin в переменных окружения (не `*` в production).

---

## Порядок реализации (приоритеты)

### Приоритет 1 — быстрые и видимые улучшения (1–2 дня)
1. Формат зарплаты (`600k–1M ₸`) — чисто фронтенд, 30 мин.
2. Счётчик просмотров вакансий — мало кода.
3. Hero-блок: 5 вакансий вместо 2 — изменение лимита.
4. Логотип компании — загрузка файла + multer.

### Приоритет 2 — улучшения компании и оценок (2–3 дня)
5. Карта на странице компании (Leaflet + геокодинг).
6. Все данные компании + улучшенный дизайн страницы.
7. Взаимные оценки (расширение существующей модели Feedback).

### Приоритет 3 — новые разделы (3–5 дней)
8. Рекомендации — новые модели + CRUD + страница.
9. Менторы — полный раздел.
10. Псевдо-оплата.

### Приоритет 4 — верификация и улучшение флоу (2–3 дня)
11. Верификация компаний — бэк + фронт + админ.
12. Улучшение флоу отклика и чата.

### Приоритет 5 — Админ-панель (3–4 дня)
13. Все страницы AdminPanel + защита маршрутов.
14. Управление рекомендациями и менторами через админку.

### Приоритет 6 — обратная связь (1 день)
15. Форма обратной связи + заявка на ментора.

---

## Необходимые зависимости

### Backend
```bash
npm i multer                   # загрузка файлов
npm i express-rate-limit       # rate limiting
```

### Frontend
```bash
npm i leaflet react-leaflet    # карты
npm i @types/leaflet           # TypeScript типы
npm i react-input-mask         # маска для карты оплаты
```

---

## Структура новых файлов (итоговый список)

```
backend/src/
├── controllers/
│   ├── admin.controller.js
│   ├── mentor.controller.js
│   ├── recommendation.controller.js
│   ├── payment.controller.js
│   ├── feedback.controller.js
│   └── verification.controller.js
├── routes/
│   ├── admin.routes.js
│   ├── mentor.routes.js
│   ├── recommendation.routes.js
│   ├── payment.routes.js
│   ├── feedback.routes.js
│   └── verification.routes.js
├── middlewares/
│   └── requireAdmin.js
└── uploads/
    ├── logos/
    └── documents/

frontend/src/
├── pages/
│   ├── Admin/
│   │   ├── AdminLayout.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminCompanies.tsx
│   │   ├── AdminApplications.tsx
│   │   ├── AdminUsers.tsx
│   │   ├── AdminRecommendations.tsx
│   │   ├── AdminMentors.tsx
│   │   ├── AdminVerification.tsx
│   │   └── AdminFeedback.tsx
│   ├── Mentors/
│   │   ├── MentorsPage.tsx
│   │   ├── MentorCard.tsx
│   │   ├── MentorProfile.tsx
│   │   └── MentorRequestModal.tsx
│   └── Recommendations/
│       ├── RecommendationsPage.tsx (переработка)
│       ├── CategorySection.tsx
│       └── ResourceCard.tsx
├── shared/
│   ├── ui/
│   │   ├── CompanyMap/CompanyMap.tsx
│   │   ├── StarRating/StarRating.tsx
│   │   ├── ReviewCard/ReviewCard.tsx
│   │   └── VerifiedBadge/VerifiedBadge.tsx
│   ├── api/
│   │   ├── admin.api.ts
│   │   ├── mentor.api.ts
│   │   ├── recommendation.api.ts
│   │   ├── payment.api.ts
│   │   └── feedback.api.ts
│   └── utils/
│       └── formatSalary.ts
└── features/
    ├── feedback/
    │   ├── FeedbackModal.tsx
    │   └── MentorApplicationForm.tsx
    └── payment/
        └── PaymentModal.tsx
```

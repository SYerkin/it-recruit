# Промпт для генерации мок-данных IT Recruit платформы

## Промпт для нейросети (ChatGPT/Claude):

```
Создай мок-данные для IT Recruit платформы (рекрутинговая платформа для IT-специалистов).

Нужно создать реалистичные данные для:
1. HR пользователей (3-5 человек) с их компаниями
2. Кандидатов (10-15 человек) с полными профилями
3. Вакансии от HR (15-20 вакансий)
4. Отклики кандидатов на вакансии (20-30 откликов)
5. Приглашения от HR к кандидатам (5-10 приглашений)

Формат: JSON массив для каждой сущности.

## Структура данных:

### 1. HR пользователи и компании

Для каждого HR нужны:
- **User (HR)**:
  - email: уникальный email (например: hr@companyname.com)
  - password: "password123" (будет захеширован)
  - role: "HR"
  
- **Company** (связана с HR):
  - name: название IT компании (например: "TechSolutions", "Digital Innovations", "CloudSoft")
  - description: описание компании (2-3 предложения о деятельности, технологиях, миссии)
  - address: адрес в формате "Город, улица, дом" (например: "Алматы, пр. Абая, 150")
  - employeeCount: один из вариантов: "1-10", "11-50", "51-200", "201-500", "500+"

### 2. Кандидаты (CANDIDATE)

Для каждого кандидата нужны:

- **User**:
  - email: уникальный email
  - password: "password123"
  - role: "CANDIDATE"

- **CandidateProfile**:
  - firstName: имя (русские имена)
  - lastName: фамилия (русские фамилии)
  - phone: телефон в формате "+7 (XXX) XXX-XX-XX"
  - headline: краткий заголовок профессии (например: "Senior Full-Stack Developer", "Junior Frontend Developer", "DevOps Engineer")
  - summary: краткое описание о себе (3-5 предложений)
  - isOpenToWork: true/false (большинство true)
  - isPublicProfile: true/false (50/50)

- **Skills** (3-8 навыков на кандидата):
  - name: название технологии (JavaScript, Python, React, Node.js, PostgreSQL, Docker, Kubernetes, TypeScript, Vue.js, Angular, Java, Spring, Go, Rust, PHP, Laravel, Swift, Kotlin, Flutter, AWS, Azure, Git, etc.)
  - category: "FRONTEND", "BACKEND", "DATABASE", "DEVOPS", "MOBILE", "OTHER"
  - proficiencyLevel: "BASIC", "INTERMEDIATE", "ADVANCED"
  - yearsOfExperience: число от 1 до 10

- **WorkExperience** (2-4 места работы на кандидата):
  - companyName: название компании (IT компании, стартапы, крупные корпорации)
  - position: должность (Junior/Middle/Senior + специальность)
  - startDate: дата начала в формате "YYYY-MM-DD" (от 2015 до 2023)
  - endDate: дата окончания или null (если текущее место работы)
  - description: описание обязанностей и достижений (3-5 предложений)

- **Education** (1-2 образования на кандидата):
  - institution: название университета (например: "КазНУ им. аль-Фараби", "КБТУ", "МУИТ", "Satbayev University")
  - degree: "Бакалавр", "Магистр", "Специалист"
  - fieldOfStudy: специальность (например: "Информатика", "Компьютерные науки", "Программная инженерия")
  - startDate: "YYYY-MM-DD" (от 2010 до 2020)
  - endDate: "YYYY-MM-DD" или null
  - description: опционально, краткое описание

- **Certificates** (0-3 сертификата на кандидата):
  - name: название сертификата (например: "AWS Certified Solutions Architect", "Google Cloud Professional", "Oracle Certified Java Developer", "Microsoft Azure Fundamentals")
  - issuer: организация (AWS, Google, Microsoft, Oracle, etc.)
  - issueDate: "YYYY-MM-DD" (от 2020 до 2024)
  - credentialId: опционально, ID сертификата
  - credentialUrl: опционально, URL для проверки

### 3. Вакансии (Job)

Для каждой вакансии:
- title: название вакансии (например: "Senior React Developer", "Backend Python Engineer", "DevOps Specialist", "Full-Stack JavaScript Developer")
- description: подробное описание вакансии (5-7 предложений о проекте, команде, технологиях)
- responsibilities: список обязанностей (5-8 пунктов, каждый с новой строки)
- benefits: бенефиты (оплачиваемый отпуск, медицинская страховка, обучение, гибкий график, etc.) - опционально
- salaryMin: минимальная зарплата (от 500 до 5000)
- salaryMax: максимальная зарплата (больше salaryMin)
- currency: "USD" или "KZT"
- status: "DRAFT" (30%), "ACTIVE" (60%), "CLOSED" (10%)
- workSchedule: "FULL_TIME" или "PART_TIME"
- workMode: "OFFICE", "REMOTE", или "HYBRID"
- workType: "PERMANENT" или "PROJECT"
- experienceLevel: "INTERN", "JUNIOR", "MIDDLE", или "SENIOR"
- requiredSkills: массив названий навыков (3-6 навыков, должны соответствовать реальным технологиям)

### 4. Отклики (Application)

Для каждого отклика:
- jobId: ID вакансии (ссылка на существующую вакансию)
- candidateProfileId: ID профиля кандидата (ссылка на существующего кандидата)
- status: "APPLIED" (60%), "SCREENING" (20%), "INTERVIEW" (10%), "OFFER" (5%), "REJECTED" (5%)
- coverLetter: сопроводительное письмо (3-5 предложений, почему кандидат хочет работать в этой компании) - опционально
- createdAt: дата отклика (от 1 месяца назад до сегодня)

### 5. Приглашения (Invitation)

Для каждого приглашения:
- jobId: ID вакансии
- candidateProfileId: ID профиля кандидата
- status: "PENDING" (70%), "ACCEPTED" (20%), "DECLINED" (10%)
- message: персональное сообщение от HR (2-3 предложения, почему HR приглашает этого кандидата)
- invitedById: ID HR пользователя
- createdAt: дата приглашения (от 2 недель назад до сегодня)
- expiresAt: опционально, дата истечения (через 1-2 недели после создания)

## Важные требования:

1. **Реалистичность**: все данные должны быть реалистичными и соответствовать IT-индустрии Казахстана
2. **Связность**: 
   - Вакансии должны быть созданы HR из их компаний
   - Отклики должны быть от кандидатов на существующие вакансии
   - Приглашения должны быть от HR на существующие вакансии к существующим кандидатам
3. **Разнообразие**: 
   - Разные уровни опыта (junior, middle, senior)
   - Разные технологии (frontend, backend, full-stack, DevOps, mobile)
   - Разные форматы работы (офис, удаленно, гибрид)
4. **Логика**: 
   - Senior кандидаты не должны откликаться на Junior вакансии
   - Навыки кандидатов должны соответствовать вакансиям, на которые они откликаются
   - Опыт работы должен быть логичным (нельзя работать в будущем)

## Формат вывода:

Верни JSON объект со следующими ключами:
- "users": массив всех пользователей (HR + кандидаты)
- "companies": массив компаний
- "candidateProfiles": массив профилей кандидатов
- "skills": массив всех уникальных навыков
- "candidateSkills": массив связей кандидат-навык
- "workExperiences": массив опыта работы
- "educations": массив образований
- "certificates": массив сертификатов
- "jobs": массив вакансий
- "jobSkills": массив связей вакансия-навык
- "applications": массив откликов
- "invitations": массив приглашений

Каждый объект должен иметь все необходимые поля. ID можно использовать последовательные числа (1, 2, 3...), но важно сохранить связи между сущностями.
```

## Пример структуры JSON:

```json
{
  "users": [
    {
      "id": 1,
      "email": "hr@techsolutions.kz",
      "password": "password123",
      "role": "HR"
    },
    {
      "id": 2,
      "email": "ivan.petrov@email.com",
      "password": "password123",
      "role": "CANDIDATE"
    }
  ],
  "companies": [
    {
      "id": 1,
      "name": "TechSolutions",
      "description": "Ведущая IT-компания в Казахстане, специализирующаяся на разработке корпоративных решений и веб-приложений.",
      "address": "Алматы, пр. Абая, 150",
      "employeeCount": "51-200",
      "ownerId": 1
    }
  ],
  "candidateProfiles": [
    {
      "id": 1,
      "userId": 2,
      "firstName": "Иван",
      "lastName": "Петров",
      "phone": "+7 (777) 123-45-67",
      "headline": "Senior Full-Stack Developer",
      "summary": "Опытный разработчик с 7+ годами опыта в создании масштабируемых веб-приложений. Специализируюсь на JavaScript, React и Node.js.",
      "isOpenToWork": true,
      "isPublicProfile": true
    }
  ],
  "skills": [
    {
      "id": 1,
      "name": "JavaScript",
      "category": "FRONTEND"
    },
    {
      "id": 2,
      "name": "React",
      "category": "FRONTEND"
    }
  ],
  "candidateSkills": [
    {
      "candidateProfileId": 1,
      "skillId": 1,
      "proficiencyLevel": "ADVANCED",
      "yearsOfExperience": 7
    }
  ],
  "workExperiences": [
    {
      "id": 1,
      "candidateProfileId": 1,
      "companyName": "Kazakhstan Digital Solutions",
      "position": "Senior Full-Stack Developer",
      "startDate": "2020-03-01",
      "endDate": null,
      "description": "Разработка и поддержка крупных веб-приложений на React и Node.js. Руководство командой из 5 разработчиков."
    }
  ],
  "educations": [
    {
      "id": 1,
      "candidateProfileId": 1,
      "institution": "КазНУ им. аль-Фараби",
      "degree": "Бакалавр",
      "fieldOfStudy": "Информатика",
      "startDate": "2014-09-01",
      "endDate": "2018-06-30"
    }
  ],
  "certificates": [
    {
      "id": 1,
      "candidateProfileId": 1,
      "name": "AWS Certified Solutions Architect",
      "issuer": "Amazon Web Services",
      "issueDate": "2023-05-15",
      "credentialId": "AWS-123456"
    }
  ],
  "jobs": [
    {
      "id": 1,
      "title": "Senior React Developer",
      "description": "Ищем опытного React разработчика для работы над современным веб-приложением. Проект включает разработку пользовательских интерфейсов с использованием React, TypeScript и современных инструментов разработки.",
      "responsibilities": "Разработка компонентов React\nОптимизация производительности приложения\nCode review и менторинг junior разработчиков\nУчастие в планировании спринтов",
      "benefits": "Медицинская страховка, оплачиваемый отпуск, обучение за счет компании",
      "salaryMin": 2000,
      "salaryMax": 3500,
      "currency": "USD",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "HYBRID",
      "workType": "PERMANENT",
      "experienceLevel": "SENIOR",
      "creatorId": 1,
      "companyId": 1
    }
  ],
  "jobSkills": [
    {
      "jobId": 1,
      "skillId": 2
    }
  ],
  "applications": [
    {
      "id": 1,
      "jobId": 1,
      "candidateProfileId": 1,
      "status": "SCREENING",
      "coverLetter": "Заинтересован в вашей вакансии Senior React Developer. Имею 7+ лет опыта работы с React и современным стеком технологий. Готов внести вклад в развитие вашего проекта.",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "invitations": [
    {
      "id": 1,
      "jobId": 1,
      "candidateProfileId": 1,
      "status": "PENDING",
      "message": "Здравствуйте! Мы изучили ваш профиль и были впечатлены вашим опытом работы с React. Предлагаем рассмотреть нашу вакансию Senior React Developer.",
      "invitedById": 1,
      "createdAt": "2024-01-20T14:00:00Z",
      "expiresAt": "2024-02-03T14:00:00Z"
    }
  ]
}
```

## Дополнительные инструкции:

1. **Пароли**: Все пароли должны быть "password123" (на бэкенде будут захешированы через bcrypt)
2. **Даты**: Используй формат ISO 8601 (YYYY-MM-DD или YYYY-MM-DDTHH:mm:ssZ)
3. **ID**: Начинай с 1 для каждой сущности, но сохраняй связи (foreign keys)
4. **Реалистичность**: 
   - Навыки должны соответствовать уровню кандидата
   - Опыт работы должен быть логичным
   - Вакансии должны требовать навыки, которые есть у кандидатов
5. **Казахстанский контекст**: 
   - Используй казахстанские города (Алматы, Астана, Шымкент)
   - Казахстанские университеты
   - Реалистичные зарплаты для Казахстана (USD: 500-5000, KZT: 200000-2000000)

## После генерации:

1. Сохрани JSON в файл `mock_data.json`
2. Создай скрипт для импорта данных в базу через Prisma
3. Убедись, что все связи корректны (foreign keys)
4. Проверь, что нет циклических зависимостей


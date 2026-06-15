# API Тестовые запросы для терминала

## Настройка

```bash
# Базовый URL
BASE_URL="http://localhost:3001"

# Сохраните токены после регистрации/входа
HR_TOKEN=""
CANDIDATE_TOKEN=""
```

---

## 1. Авторизация

### Регистрация HR
```bash
curl -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hr@test.com",
    "password": "hr123456",
    "role": "HR"
  }' | jq .
```

### Регистрация Candidate
```bash
curl -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@test.com",
    "password": "candidate123456",
    "role": "CANDIDATE"
  }' | jq .
```

### Вход (получить токен)
```bash
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@test.com",
    "password": "candidate123456"
  }' | jq .
```

### Получить текущего пользователя
```bash
curl -X GET $BASE_URL/api/auth/me \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" | jq .
```

---

## 2. Профиль кандидата

### Получить свой профиль
```bash
curl -X GET $BASE_URL/api/profile/me \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" | jq .
```

### Обновить профиль
```bash
curl -X PUT $BASE_URL/api/profile/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" \
  -d '{
    "firstName": "Иван",
    "lastName": "Иванов",
    "phone": "+79991234567",
    "headline": "Senior Full Stack Developer",
    "summary": "Опытный разработчик с 5+ годами опыта",
    "isOpenToWork": true,
    "isPublicProfile": true
  }' | jq .
```

### Добавить навык к профилю
```bash
# Сначала узнайте ID навыка (JavaScript обычно id=5)
curl -X POST $BASE_URL/api/profile/skills \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" \
  -d '{
    "skillId": 5,
    "proficiencyLevel": "ADVANCED",
    "yearsOfExperience": 4
  }' | jq .
```

### Обновить уровень навыка
```bash
curl -X PUT $BASE_URL/api/profile/skills/5 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" \
  -d '{
    "proficiencyLevel": "ADVANCED",
    "yearsOfExperience": 5
  }' | jq .
```

### Удалить навык
```bash
curl -X DELETE $BASE_URL/api/profile/skills/5 \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" | jq .
```

### Добавить опыт работы
```bash
curl -X POST $BASE_URL/api/profile/experience \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" \
  -d '{
    "companyName": "Tech Company",
    "position": "Senior Developer",
    "startDate": "2020-01-01T00:00:00Z",
    "endDate": "2023-12-31T00:00:00Z",
    "description": "Разработка веб-приложений на React и Node.js"
  }' | jq .
```

### Обновить опыт работы
```bash
curl -X PUT $BASE_URL/api/profile/experience/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" \
  -d '{
    "position": "Lead Developer",
    "description": "Руководство командой разработки"
  }' | jq .
```

### Удалить опыт работы
```bash
curl -X DELETE $BASE_URL/api/profile/experience/1 \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" | jq .
```

---

## 3. Вакансии

### Получить все вакансии
```bash
curl -X GET $BASE_URL/api/jobs | jq .
```

### Поиск вакансий по тексту
```bash
curl -X GET "$BASE_URL/api/jobs?search=developer" | jq .
```

### Фильтр по минимальной зарплате
```bash
curl -X GET "$BASE_URL/api/jobs?minSalary=1000" | jq .
```

### Фильтр по навыку
```bash
curl -X GET "$BASE_URL/api/jobs?skill=React" | jq .
```

### Фильтр по статусу
```bash
curl -X GET "$BASE_URL/api/jobs?status=ACTIVE" | jq .
```

### Получить вакансию по ID
```bash
curl -X GET $BASE_URL/api/jobs/1 | jq .
```

### Создать вакансию (HR/Admin)
```bash
curl -X POST $BASE_URL/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $HR_TOKEN" \
  -d '{
    "title": "Senior Full Stack Developer",
    "description": "Ищем опытного разработчика для работы над крупным проектом",
    "salaryMin": 2000,
    "salaryMax": 4000,
    "currency": "USD",
    "status": "ACTIVE",
    "requiredSkillIds": [1, 4, 5]
  }' | jq .
```

### Обновить вакансию (HR/Admin)
```bash
curl -X PUT $BASE_URL/api/jobs/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $HR_TOKEN" \
  -d '{
    "status": "CLOSED"
  }' | jq .
```

---

## 4. Заявки (Applications)

### Подать заявку на вакансию (Candidate)
```bash
curl -X POST $BASE_URL/api/applications/jobs/1/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" \
  -d '{
    "coverLetter": "Заинтересован в этой позиции. Имею опыт работы с указанными технологиями."
  }' | jq .
```

### Получить свои заявки (Candidate)
```bash
curl -X GET $BASE_URL/api/applications/me \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" | jq .
```

### Получить заявки на вакансию (HR/Admin)
```bash
curl -X GET $BASE_URL/api/applications/jobs/1 \
  -H "Authorization: Bearer $HR_TOKEN" | jq .
```

### Обновить статус заявки (HR/Admin)
```bash
curl -X PUT $BASE_URL/api/applications/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $HR_TOKEN" \
  -d '{
    "status": "INTERVIEW"
  }' | jq .
```

---

## 5. Приглашения (Invitations)

### Создать приглашение (HR/Admin)
```bash
curl -X POST $BASE_URL/api/invitations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $HR_TOKEN" \
  -d '{
    "jobId": 1,
    "candidateProfileId": 2,
    "message": "Мы заинтересованы в вашей кандидатуре. Предлагаем рассмотреть нашу вакансию."
  }' | jq .
```

### Получить свои приглашения (Candidate)
```bash
curl -X GET $BASE_URL/api/invitations/me \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" | jq .
```

### Принять приглашение (Candidate)
```bash
curl -X PUT $BASE_URL/api/invitations/1/accept \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" | jq .
```

### Отклонить приглашение (Candidate)
```bash
curl -X PUT $BASE_URL/api/invitations/1/decline \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" | jq .
```

### Получить приглашения по вакансии (HR/Admin)
```bash
curl -X GET $BASE_URL/api/invitations/jobs/1 \
  -H "Authorization: Bearer $HR_TOKEN" | jq .
```

---

## 6. Кандидаты (HR/Admin)

### Получить список кандидатов
```bash
curl -X GET $BASE_URL/api/candidates \
  -H "Authorization: Bearer $HR_TOKEN" | jq .
```

### Фильтр: только открытые к работе
```bash
curl -X GET "$BASE_URL/api/candidates?isOpenToWork=true" \
  -H "Authorization: Bearer $HR_TOKEN" | jq .
```

### Фильтр: по навыку
```bash
curl -X GET "$BASE_URL/api/candidates?skill=React" \
  -H "Authorization: Bearer $HR_TOKEN" | jq .
```

### Получить кандидата по ID
```bash
curl -X GET $BASE_URL/api/candidates/3 \
  -H "Authorization: Bearer $HR_TOKEN" | jq .
```

### Публичный профиль (без авторизации)
```bash
curl -X GET $BASE_URL/api/candidates/3/public | jq .
```

---

## 7. Health Check

### Проверка работы сервера
```bash
curl -X GET $BASE_URL/api/health | jq .
```

---

## Примеры комплексных сценариев

### Сценарий 1: Полный цикл от регистрации до подачи заявки

```bash
# 1. Регистрация
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456","role":"CANDIDATE"}')

TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.data.token')
echo "Token: $TOKEN"

# 2. Обновление профиля
curl -X PUT $BASE_URL/api/profile/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"firstName":"Test","lastName":"User","headline":"Developer"}'

# 3. Добавление навыка
curl -X POST $BASE_URL/api/profile/skills \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"skillId":5,"proficiencyLevel":"ADVANCED","yearsOfExperience":3}'

# 4. Просмотр вакансий
curl -X GET "$BASE_URL/api/jobs?status=ACTIVE"

# 5. Подача заявки (если есть вакансия с id=1)
curl -X POST $BASE_URL/api/applications/jobs/1/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"coverLetter":"Интересуюсь этой позицией"}'
```

### Сценарий 2: HR создает вакансию и приглашает кандидата

```bash
# 1. HR входит
HR_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@example.com","password":"hr123456"}')

HR_TOKEN=$(echo $HR_RESPONSE | jq -r '.data.token')

# 2. Создает вакансию
JOB_RESPONSE=$(curl -s -X POST $BASE_URL/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $HR_TOKEN" \
  -d '{
    "title": "Senior Developer",
    "description": "Ищем опытного разработчика",
    "salaryMin": 3000,
    "salaryMax": 5000,
    "status": "ACTIVE",
    "requiredSkillIds": [1, 5]
  }')

JOB_ID=$(echo $JOB_RESPONSE | jq -r '.data.id')

# 3. Ищет кандидатов
curl -X GET "$BASE_URL/api/candidates?skill=React&isOpenToWork=true" \
  -H "Authorization: Bearer $HR_TOKEN"

# 4. Приглашает кандидата (candidateProfileId=2)
curl -X POST $BASE_URL/api/invitations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $HR_TOKEN" \
  -d "{
    \"jobId\": $JOB_ID,
    \"candidateProfileId\": 2,
    \"message\": \"Приглашаем вас на собеседование\"
  }"
```

---

## Полезные команды

### Сохранить токен в переменную
```bash
export CANDIDATE_TOKEN="ваш_токен_здесь"
export HR_TOKEN="ваш_токен_здесь"
```

### Просмотр ответа в красивом формате
```bash
curl ... | jq .
```

### Просмотр только данных
```bash
curl ... | jq '.data'
```

### Просмотр только ошибок
```bash
curl ... | jq '.error'
```

---

## Примечания

- Замените `$CANDIDATE_TOKEN` и `$HR_TOKEN` на реальные токены после входа
- ID навыков, вакансий и кандидатов могут отличаться в вашей базе
- Для получения ID используйте соответствующие GET запросы
- Все даты в формате ISO 8601: `2020-01-01T00:00:00Z`


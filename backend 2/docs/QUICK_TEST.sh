#!/bin/bash

# Быстрые тестовые запросы к API
# Использование: скопируйте нужную команду и выполните в терминале

BASE_URL="http://localhost:3001"

# ============================================
# 1. АВТОРИЗАЦИЯ
# ============================================

# Регистрация Candidate
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456","role":"CANDIDATE"}' | jq .

# Вход и получение токена (сохраните токен в переменную)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}' | jq .

# Получить текущего пользователя
# TOKEN="ваш_токен"
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJDQU5ESURBVEUiLCJpYXQiOjE3NjUyOTM5NzIsImV4cCI6MTc2NTg5ODc3Mn0.Yz0DSap71jek-6asPdBUdirPsEQexa_-kmCYTh95smY" | jq .

# ============================================
# 2. ПРОФИЛЬ
# ============================================

# Получить свой профиль
curl -X GET http://localhost:3001/api/profile/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJDQU5ESURBVEUiLCJpYXQiOjE3NjUyOTM5NzIsImV4cCI6MTc2NTg5ODc3Mn0.Yz0DSap71jek-6asPdBUdirPsEQexa_-kmCYTh95smY" | jq .

# Обновить профиль
curl -X PUT http://localhost:3001/api/profile/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJDQU5ESURBVEUiLCJpYXQiOjE3NjUyOTM5NzIsImV4cCI6MTc2NTg5ODc3Mn0.Yz0DSap71jek-6asPdBUdirPsEQexa_-kmCYTh95smY" \
  -d '{"firstName":"Имя","lastName":"Фамилия","headline":"Developer","isOpenToWork":true}' | jq .

# Добавить навык (skillId: 1=React, 2=Python, 3=Go, 4=Node.js, 5=JavaScript)
curl -X POST http://localhost:3001/api/profile/skills \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJDQU5ESURBVEUiLCJpYXQiOjE3NjUyOTM5NzIsImV4cCI6MTc2NTg5ODc3Mn0.Yz0DSap71jek-6asPdBUdirPsEQexa_-kmCYTh95smY" \
  -d '{"skillId":5,"proficiencyLevel":"ADVANCED","yearsOfExperience":4}' | jq .

# Добавить опыт работы
curl -X POST http://localhost:3001/api/profile/experience \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJDQU5ESURBVEUiLCJpYXQiOjE3NjUyOTM5NzIsImV4cCI6MTc2NTg5ODc3Mn0.Yz0DSap71jek-6asPdBUdirPsEQexa_-kmCYTh95smY" \
  -d '{"companyName":"Company","position":"Developer","startDate":"2020-01-01T00:00:00Z"}' | jq .

# ============================================
# 3. ВАКАНСИИ
# ============================================

# Получить все вакансии
curl -X GET http://localhost:3001/api/jobs | jq .

# Поиск по тексту
curl -X GET "http://localhost:3001/api/jobs?search=developer" | jq .

# Фильтр по зарплате
curl -X GET "http://localhost:3001/api/jobs?minSalary=1000" | jq .

# Фильтр по навыку
curl -X GET "http://localhost:3001/api/jobs?skill=React" | jq .

# Получить вакансию по ID
curl -X GET http://localhost:3001/api/jobs/1 | jq .

# ============================================
# 4. ЗАЯВКИ
# ============================================

# Подать заявку на вакансию
curl -X POST http://localhost:3001/api/applications/jobs/1/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJDQU5ESURBVEUiLCJpYXQiOjE3NjUyOTM5NzIsImV4cCI6MTc2NTg5ODc3Mn0.Yz0DSap71jek-6asPdBUdirPsEQexa_-kmCYTh95smY" \
  -d '{"coverLetter":"Интересуюсь позицией"}' | jq .

# Получить свои заявки
curl -X GET http://localhost:3001/api/applications/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJDQU5ESURBVEUiLCJpYXQiOjE3NjUyOTM5NzIsImV4cCI6MTc2NTg5ODc3Mn0.Yz0DSap71jek-6asPdBUdirPsEQexa_-kmCYTh95smY" | jq .

# ============================================
# 5. ПРИГЛАШЕНИЯ
# ============================================

# Получить свои приглашения
curl -X GET http://localhost:3001/api/invitations/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJDQU5ESURBVEUiLCJpYXQiOjE3NjUyOTM5NzIsImV4cCI6MTc2NTg5ODc3Mn0.Yz0DSap71jek-6asPdBUdirPsEQexa_-kmCYTh95smY" | jq .

# Принять приглашение
curl -X PUT http://localhost:3001/api/invitations/1/accept \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJDQU5ESURBVEUiLCJpYXQiOjE3NjUyOTM5NzIsImV4cCI6MTc2NTg5ODc3Mn0.Yz0DSap71jek-6asPdBUdirPsEQexa_-kmCYTh95smY" | jq .

# ============================================
# 6. КАНДИДАТЫ (HR только)
# ============================================

# Получить список кандидатов
curl -X GET http://localhost:3001/api/candidates \
  -H "Authorization: Bearer $HR_TOKEN" | jq .

# Фильтр: открытые к работе
curl -X GET "http://localhost:3001/api/candidates?isOpenToWork=true" \
  -H "Authorization: Bearer $HR_TOKEN" | jq .

# Публичный профиль (без авторизации)
curl -X GET http://localhost:3001/api/candidates/3/public | jq .

# ============================================
# 7. HEALTH CHECK
# ============================================

curl -X GET http://localhost:3001/api/health | jq .


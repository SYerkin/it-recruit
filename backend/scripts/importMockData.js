import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const mockData = {
  "users": [
    { "id": 1, "email": "aigerim.t@kaspibank.kz", "password": "admin123", "role": "HR" },
    { "id": 2, "email": "timur.k@kolesa.group", "password": "admin123", "role": "HR" },
    { "id": 3, "email": "elena.kim@chocofamily.kz", "password": "admin123", "role": "HR" },
    { "id": 4, "email": "ruslan.s@halykbank.kz", "password": "admin123", "role": "HR" },
    { "id": 5, "email": "marina.v@beeline.kz", "password": "admin123", "role": "HR" },
    { "id": 6, "email": "saule.n@freedom.kz", "password": "admin123", "role": "HR" },
    { "id": 7, "email": "arman.b@sergek.kz", "password": "admin123", "role": "HR" },
    { "id": 8, "email": "diana.m@kcell.kz", "password": "admin123", "role": "HR" },
    { "id": 9, "email": "kairat.z@nitec.kz", "password": "admin123", "role": "HR" },
    { "id": 10, "email": "julia.o@epam.com", "password": "admin123", "role": "HR" },
    { "id": 11, "email": "azamat.dev@gmail.com", "password": "admin123", "role": "CANDIDATE" },
    { "id": 12, "email": "alina.frontend@mail.ru", "password": "admin123", "role": "CANDIDATE" },
    { "id": 13, "email": "daniyar.java@yandex.kz", "password": "admin123", "role": "CANDIDATE" },
    { "id": 14, "email": "aidana.ux@gmail.com", "password": "admin123", "role": "CANDIDATE" },
    { "id": 15, "email": "roman.devops@outlook.com", "password": "admin123", "role": "CANDIDATE" },
    { "id": 16, "email": "zhandos.mobile@icloud.com", "password": "admin123", "role": "CANDIDATE" },
    { "id": 17, "email": "sofia.qa@list.ru", "password": "admin123", "role": "CANDIDATE" },
    { "id": 18, "email": "berik.go@gmail.com", "password": "admin123", "role": "CANDIDATE" },
    { "id": 19, "email": "gulnaz.pm@gmail.com", "password": "admin123", "role": "CANDIDATE" },
    { "id": 20, "email": "maxim.php@mail.ru", "password": "admin123", "role": "CANDIDATE" },
    { "id": 21, "email": "askar.data@gmail.com", "password": "admin123", "role": "CANDIDATE" },
    { "id": 22, "email": "kamila.analyst@yandex.ru", "password": "admin123", "role": "CANDIDATE" },
    { "id": 23, "email": "yerzhan.security@proton.me", "password": "admin123", "role": "CANDIDATE" },
    { "id": 24, "email": "anastasia.hr@gmail.com", "password": "admin123", "role": "CANDIDATE" },
    { "id": 25, "email": "baktiyar.net@outlook.com", "password": "admin123", "role": "CANDIDATE" },
    { "id": 26, "email": "madi.flutter@gmail.com", "password": "admin123", "role": "CANDIDATE" },
    { "id": 27, "email": "assely.tester@mail.ru", "password": "admin123", "role": "CANDIDATE" },
    { "id": 28, "email": "kirill.admin@gmail.com", "password": "admin123", "role": "CANDIDATE" },
    { "id": 29, "email": "nurzhan.ml@yandex.kz", "password": "admin123", "role": "CANDIDATE" },
    { "id": 30, "email": "vladimir.cpp@gmail.com", "password": "admin123", "role": "CANDIDATE" },
    { "id": 31, "email": "admin@itrecruit.local", "password": "admin123", "role": "ADMIN" },
    { "id": 32, "email": "shatlyk.baltybay@deloitte.kz", "password": "admin123", "role": "HR" },
    { "id": 33, "email": "arsen.abelbayev@gmail.com", "password": "admin123", "role": "CANDIDATE" },
    { "id": 34, "email": "arslan.shakhojaev@mail.ru", "password": "admin123", "role": "CANDIDATE" }
  ],
  "companies": [
    {
      "id": 1,
      "name": "Kaspi.kz",
      "description": "Ведущая финтех-экосистема Казахстана. Мы создаем инновационные продукты, которыми пользуются миллионы.",
      "address": "Алматы, ул. Наурызбай батыра, 154А",
      "employeeCount": "500+",
      "ownerId": 1
    },
    {
      "id": 2,
      "name": "Kolesa Group",
      "description": "IT-компания, развивающая продукты kolesa.kz, krisha.kz, market.kz. Highload проекты и сильная инженерная культура.",
      "address": "Алматы, ул. Шевченко, 157/4",
      "employeeCount": "500+",
      "ownerId": 2
    },
    {
      "id": 3,
      "name": "Choco",
      "description": "Крупнейший IT-холдинг: Chocolife, Chocofood, iDoctor. Строим удобные сервисы для жизни.",
      "address": "Алматы, ул. Байзакова, 280",
      "employeeCount": "201-500",
      "ownerId": 3
    },
    {
      "id": 4,
      "name": "Halyk Bank",
      "description": "Цифровая трансформация крупнейшего банка страны. Разрабатываем Homebank и бизнес-экосистемы.",
      "address": "Алматы, пр. Аль-Фараби, 40",
      "employeeCount": "500+",
      "ownerId": 4
    },
    {
      "id": 5,
      "name": "Beeline Kazakhstan",
      "description": "Телекоммуникационный оператор, активно развивающий направление Big Data и Digital продуктов.",
      "address": "Астана, ул. Кадыргали Жалайыри, 2",
      "employeeCount": "500+",
      "ownerId": 5
    },
    {
      "id": 6,
      "name": "Freedom Finance",
      "description": "Инвестиционная компания и цифровой банк. Строим глобальную экосистему Freedom.",
      "address": "Алматы, пр. Аль-Фараби, 77/7",
      "employeeCount": "500+",
      "ownerId": 6
    },
    {
      "id": 7,
      "name": "Sergek",
      "description": "Разработчики системы 'Сергек'. Smart City решения, Computer Vision и Big Data.",
      "address": "Астана, пр. Мангилик Ел, 55/8",
      "employeeCount": "51-200",
      "ownerId": 7
    },
    {
      "id": 8,
      "name": "Kcell",
      "description": "Оператор сотовой связи. Внедряем 5G и цифровые сервисы для B2B и B2C.",
      "address": "Алматы, ул. Тимирязева, 2Г",
      "employeeCount": "500+",
      "ownerId": 8
    },
    {
      "id": 9,
      "name": "NITEC (АО НИТ)",
      "description": "Оператор электронного правительства eGov.kz. Крупнейшие государственные цифровые проекты.",
      "address": "Астана, пр. Мангилик Ел, 8",
      "employeeCount": "500+",
      "ownerId": 9
    },
    {
      "id": 10,
      "name": "EPAM Kazakhstan",
      "description": "Мировой лидер в области разработки ПО и цифровых платформ.",
      "address": "Караганда, пр. Бухар-Жырау, 49",
      "employeeCount": "500+",
      "ownerId": 10
    },
    {
      "id": 11,
      "name": "Deloitte",
      "description": "Международная сеть компаний в сфере аудита, консалтинга, финансового и юридического сопровождения. В Казахстане — один из лидеров в IT Audit и риск-консалтинге.",
      "address": "Алматы, пр. Достык, 210",
      "employeeCount": "500+",
      "ownerId": 32
    }
  ],
  "candidateProfiles": [
    { "id": 1, "userId": 11, "firstName": "Азамат", "lastName": "Искаков", "phone": "+7 777 111 22 33", "headline": "Senior Java Developer", "summary": "Java разработчик с 6-летним опытом в финтехе. Spring Boot, Microservices, Oracle.", "isOpenToWork": true, "isPublicProfile": true },
    { "id": 2, "userId": 12, "firstName": "Алина", "lastName": "Пак", "phone": "+7 701 222 33 44", "headline": "Middle Frontend Developer (React)", "summary": "Создаю красивые UI на React и Next.js. Опыт работы в e-commerce проектах.", "isOpenToWork": true, "isPublicProfile": true },
    { "id": 3, "userId": 13, "firstName": "Данияр", "lastName": "Ахметов", "phone": "+7 705 333 44 55", "headline": "Lead Backend Engineer", "summary": "Архитектура высоконагруженных систем. Go, Python, PostgreSQL. Тимлид команды из 8 человек.", "isOpenToWork": false, "isPublicProfile": true },
    { "id": 4, "userId": 14, "firstName": "Айдана", "lastName": "Омарова", "phone": "+7 775 444 55 66", "headline": "UI/UX Designer", "summary": "Дизайнер интерфейсов с фокусом на мобильные приложения. Figma, Protopie.", "isOpenToWork": true, "isPublicProfile": true },
    { "id": 5, "userId": 15, "firstName": "Роман", "lastName": "Ким", "phone": "+7 707 555 66 77", "headline": "DevOps Engineer", "summary": "Автоматизация CI/CD, Kubernetes, Docker, AWS. Опыт миграции в облака.", "isOpenToWork": true, "isPublicProfile": true },
    { "id": 6, "userId": 16, "firstName": "Жандос", "lastName": "Ержанов", "phone": "+7 771 666 77 88", "headline": "iOS Developer", "summary": "Swift, UIKit, SwiftUI. Разработка банковских приложений.", "isOpenToWork": false, "isPublicProfile": false },
    { "id": 7, "userId": 17, "firstName": "София", "lastName": "Ли", "phone": "+7 702 777 88 99", "headline": "QA Automation Engineer", "summary": "Автоматизация тестирования на Python + Selenium. Нагрузочное тестирование.", "isOpenToWork": true, "isPublicProfile": true },
    { "id": 8, "userId": 18, "firstName": "Берик", "lastName": "Султанов", "phone": "+7 747 888 99 00", "headline": "Golang Developer", "summary": "Backend разработчик, фанат Go. Микросервисы, gRPC, Kafka.", "isOpenToWork": true, "isPublicProfile": true },
    { "id": 9, "userId": 19, "firstName": "Гульназ", "lastName": "Нургалиева", "phone": "+7 776 999 00 11", "headline": "Project Manager", "summary": "Сертифицированный PMP. Опыт ведения проектов по Agile/Scrum в телекоме.", "isOpenToWork": true, "isPublicProfile": true },
    { "id": 10, "userId": 20, "firstName": "Максим", "lastName": "Иванов", "phone": "+7 708 000 11 22", "headline": "PHP Developer (Laravel)", "summary": "Fullstack на Laravel + Vue.js. Разработка CRM систем.", "isOpenToWork": true, "isPublicProfile": true },
    { "id": 11, "userId": 21, "firstName": "Аскар", "lastName": "Мамыров", "phone": "+7 700 111 22 22", "headline": "Data Scientist", "summary": "ML, Python, Pandas, NLP. Опыт работы с Big Data в банках.", "isOpenToWork": false, "isPublicProfile": true },
    { "id": 12, "userId": 22, "firstName": "Камила", "lastName": "Сабитова", "phone": "+7 701 222 33 33", "headline": "System Analyst", "summary": "Системный анализ, написание ТЗ, UML, BPMN, SQL.", "isOpenToWork": true, "isPublicProfile": true },
    { "id": 13, "userId": 23, "firstName": "Ержан", "lastName": "Болатов", "phone": "+7 702 333 44 44", "headline": "Cyber Security Specialist", "summary": "Пентестинг, аудит безопасности, SIEM. CISSP.", "isOpenToWork": true, "isPublicProfile": false },
    { "id": 14, "userId": 24, "firstName": "Анастасия", "lastName": "Волкова", "phone": "+7 705 444 55 55", "headline": "HR Director / Recruiter", "summary": "Построение HR процессов в IT стартапах. Рекрутинг C-level.", "isOpenToWork": true, "isPublicProfile": true },
    { "id": 15, "userId": 25, "firstName": "Бахтияр", "lastName": "Кусаинов", "phone": "+7 777 555 66 66", "headline": ".NET Developer", "summary": "C#, .NET Core, Azure. Разработка энтерпрайз решений.", "isOpenToWork": true, "isPublicProfile": true },
    { "id": 16, "userId": 26, "firstName": "Мади", "lastName": "Рахимжанов", "phone": "+7 775 666 77 77", "headline": "Flutter Developer", "summary": "Кроссплатформенная разработка. Dart, Bloc, Clean Architecture.", "isOpenToWork": true, "isPublicProfile": true },
    { "id": 17, "userId": 27, "firstName": "Асель", "lastName": "Муратова", "phone": "+7 707 777 88 88", "headline": "Manual QA Engineer", "summary": "Ручное тестирование веб и мобильных приложений. Знание SQL и Postman.", "isOpenToWork": true, "isPublicProfile": true },
    { "id": 18, "userId": 28, "firstName": "Кирилл", "lastName": "Попов", "phone": "+7 747 888 99 99", "headline": "System Administrator", "summary": "Linux, Windows Server, Сети, Виртуализация. Администрирование офисов.", "isOpenToWork": true, "isPublicProfile": true },
    { "id": 19, "userId": 29, "firstName": "Нуржан", "lastName": "Касенов", "phone": "+7 701 999 00 00", "headline": "Junior ML Engineer", "summary": "Выпускник МУИТ. Python, TensorFlow. Интересуюсь CV.", "isOpenToWork": true, "isPublicProfile": true },
    { "id": 20, "userId": 30, "firstName": "Владимир", "lastName": "Цой", "phone": "+7 771 000 11 11", "headline": "C++ Developer", "summary": "Qt, C++. Разработка десктопных приложений и драйверов.", "isOpenToWork": false, "isPublicProfile": true },
    { "id": 21, "userId": 33, "firstName": "Arsen", "lastName": "Abelbayev", "phone": "+7 701 555 12 34", "headline": "Senior IT Audit Specialist", "summary": "IT-аудитор с 5-летним опытом journal entry testing, тестирования ITGC и анализа журналов проводок в SAP. Опыт работы в Big4, сертификат CISA.", "isOpenToWork": true, "isPublicProfile": true },
    { "id": 22, "userId": 34, "firstName": "Arslan", "lastName": "Shakhojaev", "phone": "+7 702 666 78 90", "headline": "Junior IT Auditor", "summary": "Начинающий IT-аудитор. Базовые навыки SQL, Excel и участие в проектах journal entry testing под руководством старших коллег.", "isOpenToWork": true, "isPublicProfile": true }
  ],
  "skills": [
    { "id": 1, "name": "Java", "category": "BACKEND" },
    { "id": 2, "name": "Spring Boot", "category": "BACKEND" },
    { "id": 3, "name": "JavaScript", "category": "FRONTEND" },
    { "id": 4, "name": "React", "category": "FRONTEND" },
    { "id": 5, "name": "Python", "category": "BACKEND" },
    { "id": 6, "name": "Go", "category": "BACKEND" },
    { "id": 7, "name": "Docker", "category": "DEVOPS" },
    { "id": 8, "name": "Kubernetes", "category": "DEVOPS" },
    { "id": 9, "name": "Swift", "category": "MOBILE" },
    { "id": 10, "name": "Flutter", "category": "MOBILE" },
    { "id": 11, "name": "SQL", "category": "DATABASE" },
    { "id": 12, "name": "Figma", "category": "OTHER" },
    { "id": 13, "name": "IT Audit", "category": "OTHER" },
    { "id": 14, "name": "Journal Entry Testing", "category": "OTHER" },
    { "id": 15, "name": "SAP", "category": "OTHER" },
    { "id": 16, "name": "Excel", "category": "OTHER" },
    { "id": 17, "name": "Internal Controls", "category": "OTHER" },
    { "id": 18, "name": "IFRS", "category": "OTHER" }
  ],
  "candidateSkills": [
    { "candidateProfileId": 1, "skillId": 1, "proficiencyLevel": "ADVANCED", "yearsOfExperience": 6 },
    { "candidateProfileId": 1, "skillId": 2, "proficiencyLevel": "ADVANCED", "yearsOfExperience": 5 },
    { "candidateProfileId": 2, "skillId": 3, "proficiencyLevel": "ADVANCED", "yearsOfExperience": 4 },
    { "candidateProfileId": 2, "skillId": 4, "proficiencyLevel": "INTERMEDIATE", "yearsOfExperience": 3 },
    { "candidateProfileId": 3, "skillId": 5, "proficiencyLevel": "ADVANCED", "yearsOfExperience": 8 },
    { "candidateProfileId": 3, "skillId": 6, "proficiencyLevel": "INTERMEDIATE", "yearsOfExperience": 2 },
    { "candidateProfileId": 5, "skillId": 7, "proficiencyLevel": "ADVANCED", "yearsOfExperience": 4 },
    { "candidateProfileId": 5, "skillId": 8, "proficiencyLevel": "INTERMEDIATE", "yearsOfExperience": 2 },
    { "candidateProfileId": 19, "skillId": 5, "proficiencyLevel": "BASIC", "yearsOfExperience": 1 },
    { "candidateProfileId": 12, "skillId": 11, "proficiencyLevel": "ADVANCED", "yearsOfExperience": 4 },
    { "candidateProfileId": 12, "skillId": 16, "proficiencyLevel": "INTERMEDIATE", "yearsOfExperience": 3 },
    { "candidateProfileId": 12, "skillId": 17, "proficiencyLevel": "BASIC", "yearsOfExperience": 2 },
    { "candidateProfileId": 21, "skillId": 13, "proficiencyLevel": "ADVANCED", "yearsOfExperience": 5 },
    { "candidateProfileId": 21, "skillId": 14, "proficiencyLevel": "ADVANCED", "yearsOfExperience": 5 },
    { "candidateProfileId": 21, "skillId": 11, "proficiencyLevel": "ADVANCED", "yearsOfExperience": 5 },
    { "candidateProfileId": 21, "skillId": 15, "proficiencyLevel": "INTERMEDIATE", "yearsOfExperience": 4 },
    { "candidateProfileId": 21, "skillId": 16, "proficiencyLevel": "ADVANCED", "yearsOfExperience": 5 },
    { "candidateProfileId": 21, "skillId": 17, "proficiencyLevel": "ADVANCED", "yearsOfExperience": 4 },
    { "candidateProfileId": 21, "skillId": 18, "proficiencyLevel": "INTERMEDIATE", "yearsOfExperience": 3 },
    { "candidateProfileId": 22, "skillId": 11, "proficiencyLevel": "INTERMEDIATE", "yearsOfExperience": 2 },
    { "candidateProfileId": 22, "skillId": 16, "proficiencyLevel": "INTERMEDIATE", "yearsOfExperience": 2 },
    { "candidateProfileId": 22, "skillId": 13, "proficiencyLevel": "BASIC", "yearsOfExperience": 1 },
    { "candidateProfileId": 22, "skillId": 14, "proficiencyLevel": "BASIC", "yearsOfExperience": 1 }
  ],
  "educations": [
    { "id": 1, "candidateProfileId": 1, "institution": "КБТУ (KBTU)", "degree": "Бакалавр", "fieldOfStudy": "Вычислительная техника и ПО", "startDate": "2015-09-01", "endDate": "2019-06-30" },
    { "id": 2, "candidateProfileId": 2, "institution": "МУИТ (IITU)", "degree": "Бакалавр", "fieldOfStudy": "Информационные системы", "startDate": "2017-09-01", "endDate": "2021-06-30" },
    { "id": 3, "candidateProfileId": 3, "institution": "Nazarbayev University", "degree": "Магистр", "fieldOfStudy": "Computer Science", "startDate": "2016-09-01", "endDate": "2018-06-30" },
    { "id": 4, "candidateProfileId": 4, "institution": "Satbayev University", "degree": "Бакалавр", "fieldOfStudy": "Дизайн", "startDate": "2018-09-01", "endDate": "2022-06-30" },
    { "id": 5, "candidateProfileId": 19, "institution": "SDU University", "degree": "Бакалавр", "fieldOfStudy": "Information Systems", "startDate": "2020-09-01", "endDate": "2024-06-30" },
    { "id": 6, "candidateProfileId": 21, "institution": "KIMEP University", "degree": "Бакалавр", "fieldOfStudy": "Accounting and Audit", "startDate": "2014-09-01", "endDate": "2018-06-30" },
    { "id": 7, "candidateProfileId": 22, "institution": "Eurasian National University", "degree": "Бакалавр", "fieldOfStudy": "Information Systems", "startDate": "2019-09-01", "endDate": "2023-06-30" }
  ],
  "workExperiences": [
    { "id": 1, "candidateProfileId": 1, "companyName": "Kaspi Bank", "position": "Middle Java Developer", "startDate": "2020-07-01", "endDate": "2023-01-10", "description": "Разработка микросервисов для платежной системы." },
    { "id": 2, "candidateProfileId": 1, "companyName": "One Technologies", "position": "Junior Java Developer", "startDate": "2019-06-01", "endDate": "2020-06-30", "description": "Поддержка легаси кода, написание юнит-тестов." },
    { "id": 3, "candidateProfileId": 3, "companyName": "Kolesa Group", "position": "Senior Backend Developer", "startDate": "2021-02-01", "endDate": null, "description": "Оптимизация базы данных, переезд на микросервисы." },
    { "id": 4, "candidateProfileId": 2, "companyName": "Aviata.kz", "position": "Frontend Developer", "startDate": "2021-09-01", "endDate": "2023-12-01", "description": "Верстка интерфейсов личного кабинета, интеграция с API." },
    { "id": 5, "candidateProfileId": 16, "companyName": "Jusan Bank", "position": "iOS Developer", "startDate": "2022-01-01", "endDate": null, "description": "Разработка мобильного банкинга, Swift." },
    { "id": 6, "candidateProfileId": 21, "companyName": "KPMG Kazakhstan", "position": "IT Audit Specialist", "startDate": "2019-08-01", "endDate": "2023-12-01", "description": "Journal entry testing, анализ SAP-журналов, тестирование IT general controls и internal controls." },
    { "id": 7, "candidateProfileId": 21, "companyName": "EY Kazakhstan", "position": "Senior IT Auditor", "startDate": "2024-01-15", "endDate": null, "description": "Руководство проектами IT audit, journal entry testing, подготовка отчётов для клиентов банковского сектора." },
    { "id": 8, "candidateProfileId": 22, "companyName": "Local Audit Firm", "position": "Junior IT Auditor", "startDate": "2023-07-01", "endDate": null, "description": "Поддержка команды в journal entry testing, выгрузки из SAP, сверки в Excel." }
  ],
  "jobs": [
    {
      "id": 1,
      "title": "Senior Java Developer (Core Banking)",
      "companyId": 1,
      "creatorId": 1,
      "description": "Kaspi.kz ищет опытного Java разработчика в команду Core Banking. Вам предстоит работать над архитектурой ядра, обеспечивая надежность транзакций для миллионов пользователей.",
      "responsibilities": "Проектирование и разработка микросервисов на Java 17+.\nОптимизация производительности высоконагруженных систем.\nУчастие в архитектурных ревью.\nМенторство junior/middle разработчиков.",
      "benefits": "Конкурентная зарплата, бонусы по результатам года, ДМС, бесплатные обеды, современный офис в центре Алматы.",
      "salaryMin": 1500000,
      "salaryMax": 2500000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "OFFICE",
      "workType": "PERMANENT",
      "experienceLevel": "SENIOR",
      "requiredSkills": ["Java", "Spring Boot", "PostgreSQL", "Kafka", "Microservices"]
    },
    {
      "id": 2,
      "title": "Data Scientist (Credit Scoring)",
      "companyId": 1,
      "creatorId": 1,
      "description": "Команда Big Data Kaspi ищет специалиста для улучшения моделей кредитного скоринга. Работа с петабайтами данных.",
      "responsibilities": "Разработка и валидация ML-моделей.\nАнализ больших данных для выявления паттернов поведения клиентов.\nВнедрение моделей в продакшн.",
      "benefits": "Доступ к уникальным датасетам, обучение за счет компании, спортзал в офисе.",
      "salaryMin": 1200000,
      "salaryMax": 2000000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "HYBRID",
      "workType": "PERMANENT",
      "experienceLevel": "MIDDLE",
      "requiredSkills": ["Python", "Pandas", "Scikit-learn", "SQL", "Hadoop"]
    },
    {
      "id": 3,
      "title": "Product Manager (Super App)",
      "companyId": 1,
      "creatorId": 1,
      "description": "Ищем продакта, который возглавит развитие нового направления в супераппе Kaspi.kz.",
      "responsibilities": "Анализ рынка и потребностей пользователей.\nФормирование бэклога и приоритезация задач.\nВзаимодействие с командой разработки и дизайнера.",
      "benefits": "Высокий уровень автономии, годовые бонусы, корпоративные мероприятия.",
      "salaryMin": 1000000,
      "salaryMax": 1800000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "OFFICE",
      "workType": "PERMANENT",
      "experienceLevel": "MIDDLE",
      "requiredSkills": ["Product Management", "Agile", "Analytics", "UX"]
    },
    {
      "id": 4,
      "title": "Backend Developer (Go)",
      "companyId": 2,
      "creatorId": 2,
      "description": "Kolesa Group приглашает Go-разработчика для переписывания легаси-монолита на микросервисы. Highload проект (kolesa.kz).",
      "responsibilities": "Разработка микросервисов на Go.\nУчастие в проектировании архитектуры.\nНаписание unit и integration тестов.",
      "benefits": "Сильная инженерная культура, обучение английскому, техтоки, MacBook Pro.",
      "salaryMin": 1300000,
      "salaryMax": 2200000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "HYBRID",
      "workType": "PERMANENT",
      "experienceLevel": "SENIOR",
      "requiredSkills": ["Go", "Docker", "Kubernetes", "MySQL", "Redis"]
    },
    {
      "id": 5,
      "title": "PHP Developer (Symfony)",
      "companyId": 2,
      "creatorId": 2,
      "description": "Поддержка и развитие backend части проектов Krisha.kz и Market.kz.",
      "responsibilities": "Разработка нового функционала на PHP 8+.\nОптимизация SQL запросов.\nРефакторинг существующего кода.",
      "benefits": "Гибкий график, медицинская страховка, корпоративная библиотека.",
      "salaryMin": 800000,
      "salaryMax": 1400000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "OFFICE",
      "workType": "PERMANENT",
      "experienceLevel": "MIDDLE",
      "requiredSkills": ["PHP", "Symfony", "MySQL", "Git"]
    },
    {
      "id": 6,
      "title": "Mobile Developer (iOS)",
      "companyId": 2,
      "creatorId": 2,
      "description": "Разработка мобильного приложения Kolesa.kz, которым пользуются миллионы казахстанцев.",
      "responsibilities": "Разработка на Swift (UIKit + SwiftUI).\nМодуляризация приложения.\nCode review.",
      "benefits": "Оплата конференций, современный стек, дружная команда.",
      "salaryMin": 1000000,
      "salaryMax": 1800000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "HYBRID",
      "workType": "PERMANENT",
      "experienceLevel": "MIDDLE",
      "requiredSkills": ["Swift", "iOS SDK", "CocoaPods", "Git"]
    },
    {
      "id": 7,
      "title": "Frontend Developer (React)",
      "companyId": 3,
      "creatorId": 3,
      "description": "Choco ищет фронтендера для работы над сервисом Chocofood. Нужно делать быстро, красиво и удобно.",
      "responsibilities": "Верстка адаптивных интерфейсов.\nИнтеграция с REST API.\nОптимизация скорости загрузки страниц.",
      "benefits": "Скидки на сервисы Choco, бесплатные обеды, крутой офис с террасой.",
      "salaryMin": 600000,
      "salaryMax": 1000000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "OFFICE",
      "workType": "PERMANENT",
      "experienceLevel": "JUNIOR",
      "requiredSkills": ["React", "JavaScript", "HTML/CSS", "Redux"]
    },
    {
      "id": 8,
      "title": "Senior Python Developer",
      "companyId": 3,
      "creatorId": 3,
      "description": "Бэкенд для сервиса доставки. Работа с гео-данными, алгоритмами маршрутизации и высокими нагрузками.",
      "responsibilities": "Проектирование API на FastAPI/Django.\nРабота с PostGIS и гео-данными.\nУправление командой из 3 человек.",
      "benefits": "Опционы компании, полная медицинская страховка, релокационный пакет.",
      "salaryMin": 1800000,
      "salaryMax": 2800000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "HYBRID",
      "workType": "PERMANENT",
      "experienceLevel": "SENIOR",
      "requiredSkills": ["Python", "Django", "FastAPI", "PostgreSQL", "Redis"]
    },
    {
      "id": 9,
      "title": "QA Engineer (Manual)",
      "companyId": 3,
      "creatorId": 3,
      "description": "Ищем внимательного тестировщика для проверки веб и мобильных приложений Choco.",
      "responsibilities": "Ручное функциональное тестирование.\nСоставление тест-кейсов и чек-листов.\nРегистрация багов в Jira.",
      "benefits": "Обучение автоматизации, дружный коллектив.",
      "salaryMin": 300000,
      "salaryMax": 500000,
      "currency": "KZT",
      "status": "CLOSED",
      "workSchedule": "FULL_TIME",
      "workMode": "OFFICE",
      "workType": "PERMANENT",
      "experienceLevel": "JUNIOR",
      "requiredSkills": ["Manual Testing", "Jira", "SQL Basics"]
    },
    {
      "id": 10,
      "title": "Java Spring Boot Developer",
      "companyId": 4,
      "creatorId": 4,
      "description": "Halyk Bank трансформируется! Ищем разработчиков для создания новых цифровых продуктов банка.",
      "responsibilities": "Разработка RESTful API.\nИнтеграция с внешними банковскими системами.\nНаписание unit-тестов.",
      "benefits": "Льготное кредитование, квартальные премии, соцпакет.",
      "salaryMin": 900000,
      "salaryMax": 1500000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "OFFICE",
      "workType": "PERMANENT",
      "experienceLevel": "MIDDLE",
      "requiredSkills": ["Java", "Spring Boot", "Oracle", "Maven"]
    },
    {
      "id": 11,
      "title": "Cyber Security Specialist (SOC)",
      "companyId": 4,
      "creatorId": 4,
      "description": "Работа в центре мониторинга безопасности (SOC). Защита инфраструктуры крупнейшего банка.",
      "responsibilities": "Мониторинг инцидентов безопасности (SIEM).\nРеагирование на кибератаки.\nАнализ уязвимостей.",
      "benefits": "Профессиональное обучение, сертификация, карьерный рост.",
      "salaryMin": 800000,
      "salaryMax": 1300000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "OFFICE",
      "workType": "PERMANENT",
      "experienceLevel": "MIDDLE",
      "requiredSkills": ["Security", "SIEM", "Network Security", "Linux"]
    },
    {
      "id": 12,
      "title": "System Analyst",
      "companyId": 4,
      "creatorId": 4,
      "description": "Сбор требований и постановка задач для команды разработки банковского приложения.",
      "responsibilities": "Написание ТЗ, Use Cases, User Stories.\nПроектирование API контрактов.\nВзаимодействие с бизнесом.",
      "benefits": "Стабильность, соцпакет, возможность удаленной работы.",
      "salaryMin": 700000,
      "salaryMax": 1200000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "HYBRID",
      "workType": "PERMANENT",
      "experienceLevel": "MIDDLE",
      "requiredSkills": ["System Analysis", "UML", "BPMN", "SQL", "REST"]
    },
    {
      "id": 13,
      "title": "Big Data Engineer",
      "companyId": 5,
      "creatorId": 5,
      "description": "Beeline Казахстан ищет инженера данных для построения хранилища данных (DWH) и ETL процессов.",
      "responsibilities": "Разработка ETL пайплайнов.\nПоддержка Hadoop кластера.\nОптимизация SQL запросов.",
      "benefits": "Корпоративная связь, медицинская страховка, доступ к Coursera.",
      "salaryMin": 1400000,
      "salaryMax": 2300000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "REMOTE",
      "workType": "PERMANENT",
      "experienceLevel": "SENIOR",
      "requiredSkills": ["Hadoop", "Spark", "Scala", "Python", "SQL"]
    },
    {
      "id": 14,
      "title": "DevOps Engineer",
      "companyId": 5,
      "creatorId": 5,
      "description": "Обеспечение надежности инфраструктуры Beeline. Внедрение практик CI/CD.",
      "responsibilities": "Настройка Kubernetes кластеров.\nАвтоматизация деплоя (GitLab CI/Jenkins).\nМониторинг (Prometheus, Grafana).",
      "benefits": "Гибкий график, удаленка, премии.",
      "salaryMin": 1200000,
      "salaryMax": 1900000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "REMOTE",
      "workType": "PERMANENT",
      "experienceLevel": "MIDDLE",
      "requiredSkills": ["Docker", "Kubernetes", "Linux", "CI/CD", "Ansible"]
    },
    {
      "id": 15,
      "title": "Junior Python Developer",
      "companyId": 5,
      "creatorId": 5,
      "description": "Стажировка с возможностью трудоустройства в департамент разработки цифровых продуктов.",
      "responsibilities": "Написание простых скриптов на Python.\nУчастие в поддержке внутренних инструментов.\nОбучение под руководством ментора.",
      "benefits": "Оплачиваемая стажировка, менторство, опыт в телекоме.",
      "salaryMin": 200000,
      "salaryMax": 350000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "OFFICE",
      "workType": "PROJECT",
      "experienceLevel": "INTERN",
      "requiredSkills": ["Python", "Basic SQL", "Git"]
    },
    {
      "id": 16,
      "title": ".NET Developer (Fintech)",
      "companyId": 6,
      "creatorId": 6,
      "description": "Freedom Finance ищет .NET разработчика для развития трейдинговой платформы.",
      "responsibilities": "Разработка серверной части на C# (.NET Core).\nРабота с высоконагруженными биржевыми данными.\nИнтеграция с зарубежными брокерами.",
      "benefits": "Покупка акций компании на льготных условиях, ДМС, фитнес.",
      "salaryMin": 1600000,
      "salaryMax": 2600000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "OFFICE",
      "workType": "PERMANENT",
      "experienceLevel": "SENIOR",
      "requiredSkills": ["C#", ".NET Core", "MSSQL", "RabbitMQ"]
    },
    {
      "id": 17,
      "title": "Frontend Developer (Vue.js)",
      "companyId": 6,
      "creatorId": 6,
      "description": "Разработка интерфейсов личного кабинета инвестора Freedom Finance.",
      "responsibilities": "Создание компонентов на Vue 3.\nРабота с графиками и чартами (Highcharts).\nАдаптивная верстка.",
      "benefits": "Крутой офис с видом на горы, бонусы, обучение.",
      "salaryMin": 800000,
      "salaryMax": 1300000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "HYBRID",
      "workType": "PERMANENT",
      "experienceLevel": "MIDDLE",
      "requiredSkills": ["Vue.js", "JavaScript", "HTML/CSS", "WebSocket"]
    },
    {
      "id": 18,
      "title": "Investment Analyst (IT)",
      "companyId": 6,
      "creatorId": 6,
      "description": "Аналитик для оценки IT-стартапов и проектов внутри экосистемы Freedom.",
      "responsibilities": "Анализ рынка технологий.\nФинансовое моделирование.\nПодготовка презентаций для инвесткомитета.",
      "benefits": "Возможность влиять на инвестиционные решения, бонусы.",
      "salaryMin": 900000,
      "salaryMax": 1500000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "OFFICE",
      "workType": "PERMANENT",
      "experienceLevel": "MIDDLE",
      "requiredSkills": ["Financial Analysis", "Excel", "English", "IT Market Knowledge"]
    },
    {
      "id": 19,
      "title": "Computer Vision Engineer",
      "companyId": 7,
      "creatorId": 7,
      "description": "Sergek ищет специалиста CV для улучшения алгоритмов распознавания ДТП и нарушений.",
      "responsibilities": "Обучение нейросетей для детекции объектов.\nОптимизация инференса моделей на Edge устройствах.\nРабота с видеопотоками.",
      "benefits": "Работа над социально значимым проектом, R&D задачи.",
      "salaryMin": 1500000,
      "salaryMax": 2500000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "OFFICE",
      "workType": "PERMANENT",
      "experienceLevel": "SENIOR",
      "requiredSkills": ["Python", "OpenCV", "PyTorch", "C++"]
    },
    {
      "id": 20,
      "title": "C++ Developer (Embedded)",
      "companyId": 7,
      "creatorId": 7,
      "description": "Разработка ПО для камер и датчиков системы 'Сергек'.",
      "responsibilities": "Написание кода на C++ для Linux embedded.\nВзаимодействие с аппаратной частью.\nОптимизация под ограниченные ресурсы.",
      "benefits": "Сложные инженерные задачи, профессиональная команда.",
      "salaryMin": 1000000,
      "salaryMax": 1800000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "OFFICE",
      "workType": "PERMANENT",
      "experienceLevel": "MIDDLE",
      "requiredSkills": ["C++", "Linux", "Multithreading", "Networking"]
    },
    {
      "id": 21,
      "title": "Fullstack Developer (Node.js + React)",
      "companyId": 7,
      "creatorId": 7,
      "description": "Разработка внутренних панелей мониторинга городской безопасности.",
      "responsibilities": "Создание веб-интерфейсов.\nНаписание API на Node.js.\nВизуализация данных на картах.",
      "benefits": "Гибридный график, обучение.",
      "salaryMin": 700000,
      "salaryMax": 1200000,
      "currency": "KZT",
      "status": "DRAFT",
      "workSchedule": "FULL_TIME",
      "workMode": "HYBRID",
      "workType": "PERMANENT",
      "experienceLevel": "MIDDLE",
      "requiredSkills": ["Node.js", "React", "PostgreSQL", "Mapbox/Leaflet"]
    },
    {
      "id": 22,
      "title": "Network Engineer",
      "companyId": 8,
      "creatorId": 8,
      "description": "Kcell ищет инженера для поддержки сетевой инфраструктуры и 5G сетей.",
      "responsibilities": "Настройка и мониторинг сетевого оборудования (Cisco, Huawei).\nТраблшутинг сетевых проблем.\nУчастие в проектах модернизации сети.",
      "benefits": "Служебная связь, льготы, стабильность.",
      "salaryMin": 600000,
      "salaryMax": 900000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "OFFICE",
      "workType": "PERMANENT",
      "experienceLevel": "MIDDLE",
      "requiredSkills": ["Networking", "CCNA", "Linux", "TCP/IP"]
    },
    {
      "id": 23,
      "title": "Business Analyst (B2B Products)",
      "companyId": 8,
      "creatorId": 8,
      "description": "Развитие B2B продуктов Kcell. Анализ рынка корпоративной связи и IoT.",
      "responsibilities": "Исследование потребностей корпоративных клиентов.\nРазработка требований к новым продуктам.\nПодготовка отчетности.",
      "benefits": "Бонусы, корпоративные тренинги.",
      "salaryMin": 800000,
      "salaryMax": 1300000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "HYBRID",
      "workType": "PERMANENT",
      "experienceLevel": "MIDDLE",
      "requiredSkills": ["Business Analysis", "Excel", "PowerPoint", "Telecom Knowledge"]
    },
    {
      "id": 24,
      "title": "Java Developer (Billing)",
      "companyId": 8,
      "creatorId": 8,
      "description": "Разработка и поддержка биллинговых систем оператора.",
      "responsibilities": "Работа с Java Enterprise Edition.\nОптимизация тарификации.\nИнтеграция с CRM.",
      "benefits": "Медицинская страховка, премии.",
      "salaryMin": 1000000,
      "salaryMax": 1600000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "OFFICE",
      "workType": "PERMANENT",
      "experienceLevel": "SENIOR",
      "requiredSkills": ["Java", "Oracle Database", "Spring"]
    },
    {
      "id": 25,
      "title": "Senior Java Developer (eGov)",
      "companyId": 9,
      "creatorId": 9,
      "description": "АО НИТ приглашает разработчиков для участия в масштабных проектах цифрового правительства eGov.kz.",
      "responsibilities": "Разработка государственных сервисов.\nОбеспечение отказоустойчивости систем.\nРабота с ЭЦП и криптографией.",
      "benefits": "Стабильность, работа в Астане, премии к праздникам.",
      "salaryMin": 1200000,
      "salaryMax": 1800000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "OFFICE",
      "workType": "PERMANENT",
      "experienceLevel": "SENIOR",
      "requiredSkills": ["Java", "Spring", "SOAP", "XML", "Crypto"]
    },
    {
      "id": 26,
      "title": "Database Administrator (Oracle)",
      "companyId": 9,
      "creatorId": 9,
      "description": "Администрирование крупнейших баз данных государственного сектора.",
      "responsibilities": "Настройка и поддержка Oracle DB.\nРезервное копирование и восстановление.\nТюнинг производительности.",
      "benefits": "Профессиональный рост, работа с Enterprise решениями.",
      "salaryMin": 900000,
      "salaryMax": 1500000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "OFFICE",
      "workType": "PERMANENT",
      "experienceLevel": "MIDDLE",
      "requiredSkills": ["Oracle DBA", "SQL", "Linux", "PL/SQL"]
    },
    {
      "id": 27,
      "title": "Tech Lead (GovTech)",
      "companyId": 9,
      "creatorId": 9,
      "description": "Руководство технической командой разработки портала открытых данных.",
      "responsibilities": "Выбор технологического стека.\nУправление командой разработки (10+ человек).\nКоординация с другими ведомствами.",
      "benefits": "Высокий статус проекта, конкурентная зарплата.",
      "salaryMin": 1800000,
      "salaryMax": 2500000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "OFFICE",
      "workType": "PERMANENT",
      "experienceLevel": "SENIOR",
      "requiredSkills": ["Team Leadership", "Architecture", "Java", "Microservices"]
    },
    {
      "id": 28,
      "title": "Senior Java Developer (US Project)",
      "companyId": 10,
      "creatorId": 10,
      "description": "EPAM приглашает на проект для крупного американского ритейлера. Полностью на английском языке.",
      "responsibilities": "Разработка бэкенда на Java 17.\nУчастие в дейли митингах с заказчиком.\nРабота в распределенной команде.",
      "benefits": "Зарплата в привязке к валюте, релокационные возможности, курсы английского.",
      "salaryMin": 3000,
      "salaryMax": 5500,
      "currency": "USD",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "REMOTE",
      "workType": "PERMANENT",
      "experienceLevel": "SENIOR",
      "requiredSkills": ["Java", "Spring Cloud", "AWS", "English C1"]
    },
    {
      "id": 29,
      "title": "Test Automation Engineer (SDET)",
      "companyId": 10,
      "creatorId": 10,
      "description": "Автоматизация тестирования для европейского финтех стартапа.",
      "responsibilities": "Разработка фреймворка автотестирования с нуля.\nНаписание UI и API тестов (Selenium/Selenide, RestAssured).\nИнтеграция в CI/CD.",
      "benefits": "Гибкий график, удаленная работа, доступ к EPAM University.",
      "salaryMin": 2000,
      "salaryMax": 4000,
      "currency": "USD",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "REMOTE",
      "workType": "PERMANENT",
      "experienceLevel": "MIDDLE",
      "requiredSkills": ["Java", "Selenium", "TestNG", "Jenkins"]
    },
    {
      "id": 30,
      "title": "Solution Architect",
      "companyId": 10,
      "creatorId": 10,
      "description": "Проектирование облачных решений для глобальных клиентов EPAM.",
      "responsibilities": "Разработка архитектуры приложений в облаке (AWS/Azure).\nКонсультирование клиентов по цифровой трансформации.\nPre-sale активности.",
      "benefits": "Работа с Fortune 500 компаниями, командировки.",
      "salaryMin": 5000,
      "salaryMax": 8000,
      "currency": "USD",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "REMOTE",
      "workType": "PERMANENT",
      "experienceLevel": "SENIOR",
      "requiredSkills": ["Cloud Architecture", "AWS", "Microservices", "System Design"]
    },
    {
      "id": 31,
      "title": "Frontend Developer (React/Angular)",
      "companyId": 10,
      "creatorId": 10,
      "description": "Разработка SPA приложений для клиентов из сферы здравоохранения.",
      "responsibilities": "Верстка сложных форм и дашбордов.\nОптимизация производительности на клиенте.\nВзаимодействие с UX дизайнерами.",
      "benefits": "Менторинг программа, возможность смены стека.",
      "salaryMin": 2500,
      "salaryMax": 4500,
      "currency": "USD",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "REMOTE",
      "workType": "PERMANENT",
      "experienceLevel": "MIDDLE",
      "requiredSkills": ["React", "Angular", "TypeScript", "English B2"]
    },
    {
      "id": 32,
      "title": "IT Audit — Journal Entry Testing",
      "companyId": 11,
      "creatorId": 32,
      "description": "Deloitte ищет специалиста в команду IT Audit для проведения journal entry testing и оценки IT general controls у клиентов финансового сектора.",
      "responsibilities": "Проведение journal entry testing и анализ журналов проводок.\nТестирование internal controls и ITGC в SAP.\nПодготовка рабочих документов и отчётов по аудиту.\nВзаимодействие с командой аудита и клиентом.",
      "benefits": "Обучение в Deloitte University, международные проекты, ДМС, гибридный формат работы.",
      "salaryMin": 900000,
      "salaryMax": 1500000,
      "currency": "KZT",
      "status": "ACTIVE",
      "workSchedule": "FULL_TIME",
      "workMode": "HYBRID",
      "workType": "PERMANENT",
      "experienceLevel": "MIDDLE",
      "requiredSkills": ["IT Audit", "Journal Entry Testing", "SQL", "SAP", "Excel", "Internal Controls"]
    }
  ],
  "applications": [],
  "invitations": []
};

function buildCriteriaRatings(rating, seed) {
  const clamp = (n) => Math.max(1, Math.min(10, n));
  return JSON.stringify({
    communication: rating,
    speed: clamp(rating + (seed % 3) - 1),
    transparency: clamp(rating - (seed % 2)),
    professionalism: clamp(rating + (seed % 2)),
  });
}

function pickRating(seed) {
  return 6 + (seed % 5);
}

function pickCompletedStatus(seed) {
  return seed % 2 === 0 ? 'HIRED' : 'REJECTED';
}

async function generateOddIdReviews() {
  const usedPairs = new Set();
  const profileByUserId = Object.fromEntries(
    mockData.candidateProfiles.map((p) => [p.userId, p])
  );
  const jobsByCompanyId = mockData.jobs.reduce((acc, job) => {
    if (!acc[job.companyId]) acc[job.companyId] = [];
    acc[job.companyId].push(job);
    return acc;
  }, {});
  const jobsByCreatorId = mockData.jobs.reduce((acc, job) => {
    if (!acc[job.creatorId]) acc[job.creatorId] = [];
    acc[job.creatorId].push(job);
    return acc;
  }, {});

  let applicationsCreated = 0;
  let feedbacksCreated = 0;

  async function ensureApplication(job, profile, seed) {
    const pairKey = `${job.id}:${profile.id}`;
    if (usedPairs.has(pairKey)) {
      return prisma.application.findFirst({
        where: { jobId: job.id, candidateProfileId: profile.id },
      });
    }
    usedPairs.add(pairKey);
    applicationsCreated += 1;
    return prisma.application.create({
      data: {
        jobId: job.id,
        candidateProfileId: profile.id,
        status: pickCompletedStatus(seed),
      },
    });
  }

  async function addFeedback({ applicationId, authorId, authorRole, targetRole, rating, comment, seed }) {
    await prisma.applicationFeedback.create({
      data: {
        applicationId,
        authorId,
        authorRole,
        targetRole,
        rating,
        criteriaRatings: buildCriteriaRatings(rating, seed),
        comment,
      },
    });
    feedbacksCreated += 1;
  }

  function pickJobAndProfile(seed, { companyId, creatorId, excludeProfileId } = {}) {
    const jobPool = companyId
      ? jobsByCompanyId[companyId] || mockData.jobs
      : creatorId
        ? jobsByCreatorId[creatorId] || mockData.jobs
        : mockData.jobs;

    for (let i = 0; i < mockData.candidateProfiles.length; i++) {
      const profile = mockData.candidateProfiles[(seed + i) % mockData.candidateProfiles.length];
      if (excludeProfileId && profile.id === excludeProfileId) continue;

      for (let j = 0; j < jobPool.length; j++) {
        const job = jobPool[(seed + j) % jobPool.length];
        if (creatorId && job.creatorId !== creatorId) continue;
        if (companyId && job.companyId !== companyId) continue;
        const pairKey = `${job.id}:${profile.id}`;
        if (!usedPairs.has(pairKey)) {
          return { job, profile };
        }
      }
    }
    return null;
  }

  // Оценка для каждого пользователя с нечётным id
  for (const user of mockData.users.filter((u) => u.id % 2 === 1)) {
    const seed = user.id;

    if (user.role === 'CANDIDATE') {
      const profile = profileByUserId[user.id];
      if (!profile) continue;

      let job = null;
      for (let j = 0; j < mockData.jobs.length; j++) {
        const candidateJob = mockData.jobs[(seed + j) % mockData.jobs.length];
        const pairKey = `${candidateJob.id}:${profile.id}`;
        if (!usedPairs.has(pairKey)) {
          job = candidateJob;
          break;
        }
      }
      if (!job) continue;

      const application = await ensureApplication(job, profile, seed);
      if (!application) continue;

      await addFeedback({
        applicationId: application.id,
        authorId: job.creatorId,
        authorRole: 'HR',
        targetRole: 'CANDIDATE',
        rating: pickRating(seed),
        comment: `Оценка кандидата ${profile.firstName} ${profile.lastName} по итогам найма.`,
        seed,
      });
      continue;
    }

    if (user.role === 'HR') {
      const picked = pickJobAndProfile(seed, { creatorId: user.id });
      if (!picked) continue;
      const { job, profile } = picked;
      const application = await ensureApplication(job, profile, seed);
      if (!application) continue;

      await addFeedback({
        applicationId: application.id,
        authorId: profile.userId,
        authorRole: 'CANDIDATE',
        targetRole: 'HR',
        rating: pickRating(seed + 1),
        comment: `Отзыв кандидата о работе HR (${user.email}) в процессе найма.`,
        seed: seed + 1,
      });
    }
  }

  // Оценка для каждой компании с нечётным id
  for (const company of mockData.companies.filter((c) => c.id % 2 === 1)) {
    const seed = company.id + 100;
    const picked = pickJobAndProfile(seed, { companyId: company.id });
    if (!picked) continue;
    const { job, profile } = picked;
    const application = await ensureApplication(job, profile, seed);
    if (!application) continue;

    await addFeedback({
      applicationId: application.id,
      authorId: profile.userId,
      authorRole: 'CANDIDATE',
      targetRole: 'HR',
      rating: pickRating(seed),
      comment: `Оценка процесса найма в компании ${company.name}.`,
      seed,
    });
  }

  return { applicationsCreated, feedbacksCreated };
}

async function importMockData() {
  try {
    console.log('🚀 Начинаем импорт мок-данных...\n');

    // Очистка базы данных (опционально, закомментируйте если не нужно)
    console.log('⚠️  Очистка существующих данных...');
    await prisma.$executeRaw`DELETE FROM candidate_skills`;
    await prisma.$executeRaw`DELETE FROM job_skills`;
    await prisma.$executeRaw`DELETE FROM favorite_jobs`;
    await prisma.$executeRaw`DELETE FROM application_feedbacks`;
    await prisma.$executeRaw`DELETE FROM applications`;
    await prisma.$executeRaw`DELETE FROM invitations`;
    await prisma.$executeRaw`DELETE FROM certificates`;
    await prisma.$executeRaw`DELETE FROM educations`;
    await prisma.$executeRaw`DELETE FROM work_experiences`;
    await prisma.$executeRaw`DELETE FROM candidate_profiles`;
    await prisma.$executeRaw`DELETE FROM jobs`;
    await prisma.$executeRaw`DELETE FROM companies`;
    await prisma.$executeRaw`DELETE FROM skills`;
    await prisma.$executeRaw`DELETE FROM users`;

    // 1. Создание пользователей
    console.log('📝 Создание пользователей...');
    for (const user of mockData.users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          password: hashedPassword,
          role: user.role,
        },
      });
    }
    console.log(`✅ Создано ${mockData.users.length} пользователей\n`);

    // 2. Создание компаний
    console.log('🏢 Создание компаний...');
    for (const company of mockData.companies) {
      await prisma.company.create({
        data: {
          id: company.id,
          name: company.name,
          description: company.description,
          address: company.address,
          employeeCount: company.employeeCount,
          ownerId: company.ownerId,
        },
      });
    }
    console.log(`✅ Создано ${mockData.companies.length} компаний\n`);

    // 3. Создание навыков
    console.log('💡 Создание навыков...');
    for (const skill of mockData.skills) {
      await prisma.skill.create({
        data: {
          id: skill.id,
          name: skill.name,
          category: skill.category,
        },
      });
    }
    console.log(`✅ Создано ${mockData.skills.length} навыков\n`);

    // 4. Создание профилей кандидатов
    console.log('👤 Создание профилей кандидатов...');
    for (const profile of mockData.candidateProfiles) {
      await prisma.candidateProfile.create({
        data: {
          id: profile.id,
          userId: profile.userId,
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          headline: profile.headline,
          summary: profile.summary,
          isOpenToWork: profile.isOpenToWork,
          isPublicProfile: profile.isPublicProfile,
        },
      });
    }
    console.log(`✅ Создано ${mockData.candidateProfiles.length} профилей кандидатов\n`);

    // 5. Создание связей кандидат-навык
    console.log('🔗 Создание связей кандидат-навык...');
    for (const candidateSkill of mockData.candidateSkills) {
      await prisma.candidateSkill.create({
        data: {
          candidateProfileId: candidateSkill.candidateProfileId,
          skillId: candidateSkill.skillId,
          proficiencyLevel: candidateSkill.proficiencyLevel,
          yearsOfExperience: candidateSkill.yearsOfExperience,
        },
      });
    }
    console.log(`✅ Создано ${mockData.candidateSkills.length} связей кандидат-навык\n`);

    // 6. Создание опыта работы
    console.log('💼 Создание опыта работы...');
    for (const experience of mockData.workExperiences) {
      await prisma.workExperience.create({
        data: {
          id: experience.id,
          candidateProfileId: experience.candidateProfileId,
          companyName: experience.companyName,
          position: experience.position,
          startDate: new Date(experience.startDate),
          endDate: experience.endDate ? new Date(experience.endDate) : null,
          description: experience.description,
        },
      });
    }
    console.log(`✅ Создано ${mockData.workExperiences.length} записей опыта работы\n`);

    // 7. Создание образования
    console.log('🎓 Создание образования...');
    for (const education of mockData.educations) {
      await prisma.education.create({
        data: {
          id: education.id,
          candidateProfileId: education.candidateProfileId,
          institution: education.institution,
          degree: education.degree,
          fieldOfStudy: education.fieldOfStudy,
          startDate: education.startDate ? new Date(education.startDate) : null,
          endDate: education.endDate ? new Date(education.endDate) : null,
          description: education.description,
        },
      });
    }
    console.log(`✅ Создано ${mockData.educations.length} записей образования\n`);

    // 8. Создание вакансий
    console.log('💼 Создание вакансий...');
    
    // Функция для получения или создания навыка
    async function getOrCreateSkill(skillName) {
      // Определяем категорию навыка по названию
      const skillCategories = {
        'Java': 'BACKEND',
        'Spring Boot': 'BACKEND',
        'Spring': 'BACKEND',
        'Spring Cloud': 'BACKEND',
        'Python': 'BACKEND',
        'Go': 'BACKEND',
        'PHP': 'BACKEND',
        'Node.js': 'BACKEND',
        'C#': 'BACKEND',
        '.NET Core': 'BACKEND',
        'Django': 'BACKEND',
        'FastAPI': 'BACKEND',
        'C++': 'BACKEND',
        'PostgreSQL': 'DATABASE',
        'MySQL': 'DATABASE',
        'Oracle Database': 'DATABASE',
        'Oracle': 'DATABASE',
        'MSSQL': 'DATABASE',
        'SQL': 'DATABASE',
        'PL/SQL': 'DATABASE',
        'React': 'FRONTEND',
        'JavaScript': 'FRONTEND',
        'Vue.js': 'FRONTEND',
        'Angular': 'FRONTEND',
        'TypeScript': 'FRONTEND',
        'HTML/CSS': 'FRONTEND',
        'Redux': 'FRONTEND',
        'Swift': 'MOBILE',
        'iOS SDK': 'MOBILE',
        'Flutter': 'MOBILE',
        'Docker': 'DEVOPS',
        'Kubernetes': 'DEVOPS',
        'CI/CD': 'DEVOPS',
        'Ansible': 'DEVOPS',
        'Linux': 'DEVOPS',
        'Git': 'OTHER',
        'Jira': 'OTHER',
        'Agile': 'OTHER',
        'Product Management': 'OTHER',
        'System Analysis': 'OTHER',
        'Business Analysis': 'OTHER',
        'Security': 'OTHER',
        'Networking': 'OTHER',
        'IT Audit': 'OTHER',
        'Journal Entry Testing': 'OTHER',
        'SAP': 'OTHER',
        'Excel': 'OTHER',
        'Internal Controls': 'OTHER',
        'IFRS': 'OTHER',
      };

      const category = skillCategories[skillName] || 'OTHER';
      
      let skill = await prisma.skill.findUnique({
        where: { name: skillName },
      });

      if (!skill) {
        skill = await prisma.skill.create({
          data: {
            name: skillName,
            category: category,
          },
        });
      }

      return skill;
    }

    for (const job of mockData.jobs) {
      // Обработка workType: если INTERNSHIP, то PROJECT
      let workType = job.workType;
      if (workType === 'INTERNSHIP') {
        workType = 'PROJECT';
      }

      const createdJob = await prisma.job.create({
        data: {
          id: job.id,
          title: job.title,
          description: job.description,
          responsibilities: job.responsibilities,
          benefits: job.benefits,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          currency: job.currency,
          status: job.status,
          workSchedule: job.workSchedule,
          workMode: job.workMode,
          workType: workType,
          experienceLevel: job.experienceLevel,
          creatorId: job.creatorId,
          companyId: job.companyId,
        },
      });

      // Создание связей с навыками
      if (job.requiredSkills && job.requiredSkills.length > 0) {
        for (const skillName of job.requiredSkills) {
          const skill = await getOrCreateSkill(skillName);
          await prisma.jobSkill.create({
            data: {
              jobId: createdJob.id,
              skillId: skill.id,
            },
          });
        }
      }
    }
    console.log(`✅ Создано ${mockData.jobs.length} вакансий\n`);

    console.log('⭐ Создание оценок для пользователей и компаний с нечётным id...');
    const reviewStats = await generateOddIdReviews();
    console.log(`✅ Создано ${reviewStats.applicationsCreated} заявок и ${reviewStats.feedbacksCreated} оценок\n`);

    console.log('✨ Импорт мок-данных завершен успешно!');
    console.log('\n📊 Статистика:');
    console.log(`   - Пользователей: ${mockData.users.length}`);
    console.log(`   - Компаний: ${mockData.companies.length}`);
    console.log(`   - Кандидатов: ${mockData.candidateProfiles.length}`);
    console.log(`   - Навыков: ${mockData.skills.length} (плюс автоматически созданные)`);
    console.log(`   - Опыта работы: ${mockData.workExperiences.length}`);
    console.log(`   - Образования: ${mockData.educations.length}`);
    console.log(`   - Вакансий: ${mockData.jobs.length}`);
    console.log(`   - Оценок: ${reviewStats.feedbacksCreated}`);
    console.log('\n🔑 Пароль для всех пользователей: admin123');
    console.log('👑 Админ: admin@itrecruit.local');

  } catch (error) {
    console.error('❌ Ошибка при импорте данных:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Запуск импорта
importMockData()
  .then(() => {
    console.log('\n✅ Скрипт завершен');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Скрипт завершен с ошибкой:', error);
    process.exit(1);
  });


# IT Recruit Frontend

Frontend приложение для системы управления рекрутингом IT-специалистов.

## Технологии

- React 18
- TypeScript
- Styled Components (CSS in JS)
- Vite
- Feature-Sliced Design (FSD) архитектура
- JSON based layout

## Структура проекта (FSD)

```
src/
├── app/          # Инициализация приложения, провайдеры, роутинг
├── pages/        # Страницы приложения
├── widgets/      # Крупные самостоятельные блоки
├── features/     # Бизнес-сущности с действиями
├── entities/     # Бизнес-сущности
└── shared/       # Переиспользуемые компоненты, утилиты
```

## Запуск

```bash
npm install
npm run dev
```

## JSON Layout

Приложение использует JSON-based layout систему. Конфигурация находится в `src/app/layout.json`.

Пример структуры:
```json
{
  "type": "Container",
  "props": {
    "padding": "20px"
  },
  "children": [...]
}
```


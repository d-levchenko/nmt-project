# NMT Testing

Full-stack застосунок для створення тестів і тренування. Користувачі можуть
переглядати доступні тести, проходити їх, отримувати результат і переглядати
історію спроб. Користувачі з роллю `teacher` або `admin` також можуть створювати
та редагувати тести.

## Технології

### Frontend

- Next.js 16 та React 19
- TypeScript
- TanStack Query
- Formik і Yup
- Axios
- Zustand
- Tailwind CSS

### Backend

- Node.js та Express 5
- MongoDB і Mongoose
- Zod для валідації
- AUTH-токени в cookie, cookie-parser і bcrypt для автентифікації
- Pino для логування

## Структура проєкту

```text
nmt-testing-original/
├── backend/    # REST API та робота з MongoDB
├── frontend/   # вебзастосунок Next.js
└── README.md
```

## Запуск

Потрібні Node.js та доступний екземпляр MongoDB.

1. Встановіть залежності:

  ```bash
  cd backend
  npm install

  cd ../frontend
  npm install
  ```

2. Створіть `backend/.env`:

  ```env
  PORT=3001
  MONGO_URL=mongodb://localhost:27017/nmt-testing
  CORS_FRONTEND_URL=http://localhost:3000
  ```

3. Створіть `frontend/.env.local`:

  ```env
  NEXT_PUBLIC_API_URL=http://localhost:3001
  ```

4. Запустіть backend у першому терміналі:

  ```bash
  cd backend
  npm run dev
  ```

5. Запустіть frontend в іншому терміналі:

  ```bash
  cd frontend
  npm run dev
  ```

Вебзастосунок буде доступний за адресою `http://localhost:3000`, а API — за
адресою `http://localhost:3001/api`.

## Основні можливості

- реєстрація, вхід, вихід і автоматичне оновлення сесії;
- перегляд списку тестів і деталей окремого тесту;
- створення тестів із питаннями типів `boolean`, `input` і `checkbox`;
- проходження тесту з вибором кількості питань;
- перевірка відповідей і розрахунок результату та середнього часу відповіді;
- перегляд історії завершених спроб;
- керування тестами для ролей `teacher` та `admin`.

## Маршрути frontend

| Маршрут | Призначення |
| --- | --- |
| `/quizzes` | Список доступних тестів |
| `/quizzes/:id` | Деталі тесту |
| `/login` | Вхід |
| `/register` | Реєстрація |
| `/create` | Створення тесту для `teacher`/`admin` |
| `/run-quiz?quizId=:id` | Проходження тесту |
| `/history` | Історія власних спроб |

Детальні інструкції доступні у [README backend](backend/README.md) та
[README frontend](frontend/README.md).

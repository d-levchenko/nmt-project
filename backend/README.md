# Backend

REST API для застосунку NMT Testing. Сервер відповідає за автентифікацію,
керування тестами, проходження тестів, підрахунок результатів і збереження
історії спроб.

## Технології

- Node.js та Express 5
- MongoDB і Mongoose
- Zod для перевірки вхідних даних
- AUTH-токени в cookie та bcrypt
- CORS, cookie-parser і Pino HTTP logger

## Встановлення

```bash
npm install
```

## Налаштування

Створіть файл `.env` у папці `backend`:

```env
PORT=3001
MONGO_URL=mongodb://localhost:27017/nmt-testing
CORS_FRONTEND_URL=http://localhost:3000
```

`MONGO_URL` має містити коректний URI MongoDB. `CORS_FRONTEND_URL` повинен
збігатися з адресою frontend, оскільки API працює з credentials/cookie.

## Запуск

Розробка з автоматичним перезапуском:

```bash
npm run dev
```

Запуск production-збірки:

```bash
npm start
```

Перевірка стилю коду:

```bash
npm run lint
```

За замовчуванням сервер працює на `http://localhost:3001`.

## API

Усі маршрути мають префікс `/api`.

### Автентифікація

| Метод | Маршрут | Доступ | Опис |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Публічний | Реєстрація користувача |
| `POST` | `/api/auth/login` | Публічний | Вхід у систему |
| `POST` | `/api/auth/logout` | Авторизований | Завершення сесії |
| `POST` | `/api/auth/refresh` | За cookie сесії | Оновлення access-токена |
| `GET` | `/api/auth/me` | Авторизований | Дані поточного користувача |

### Тести

| Метод | Маршрут | Доступ | Опис |
| --- | --- | --- | --- |
| `GET` | `/api/quizzes` | Публічний | Список тестів |
| `GET` | `/api/quizzes/:quizId` | Публічний | Деталі тесту |
| `POST` | `/api/quizzes` | `teacher`, `admin` | Створення тесту |
| `PATCH` | `/api/quizzes/:quizId` | Авторизований | Оновлення тесту |
| `DELETE` | `/api/quizzes/:quizId` | Авторизований | Видалення тесту |

### Спроби

| Метод | Маршрут | Доступ | Опис |
| --- | --- | --- | --- |
| `POST` | `/api/quiz-attempts/start` | Авторизований | Початок спроби з вибраною кількістю питань |
| `POST` | `/api/quiz-attempts/:id/finish` | Авторизований | Завершення спроби та підрахунок результату |
| `GET` | `/api/quiz-attempts/me` | Авторизований | Історія спроб поточного користувача |

Автентифікація використовує cookie, тому клієнтські запити мають передавати
credentials.

## База даних

Під час запуску сервер підключається до MongoDB через Mongoose. Дані
користувачів, тестів, сесій і спроб зберігаються в окремих моделях у
`src/models`.

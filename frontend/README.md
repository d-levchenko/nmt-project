# Frontend

Next.js frontend for the Quiz Builder application.

## Technologies

- Next.js
- React
- TypeScript
- TanStack Query
- Axios
- Formik
- CSS Modules

---

## Installation

```bash
npm install
```

---

## Environment Variables

Create a `.env` file.

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Start the application

Development

```bash
npm run dev
```

The application runs at:

```
http://localhost:3000
```

---

## Pages

| Route          | Description       |
| -------------- | ----------------- |
| `/`            | Home page         |
| `/create`      | Create a new quiz |
| `/quizzes`     | List all quizzes  |
| `/quizzes/:id` | View quiz details |

---

## Features

- Create quizzes dynamically
- Multiple question types
- Client-side validation
- Cached API requests using TanStack Query
- Delete quizzes
- Responsive layout

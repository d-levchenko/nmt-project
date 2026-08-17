# Quiz Builder

A full-stack Quiz Builder application where users can create, view, and delete quizzes with multiple question types.

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* TanStack Query
* Formik
* Axios
* CSS Modules

### Backend

* Express.js
* TypeScript / JavaScript
* MongoDB
* Mongoose

---

## Project Structure

```text
quiz-builder/
├── backend/
├── frontend/
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/d-levchenko/quiz-builder

cd quiz-builder
```

---

### 2. Install dependencies

Backend

```bash
cd backend
npm install
```

Frontend

```bash
cd frontend
npm install
```

---

### 3. Configure environment variables

Create a `.env` file in each project.

Backend:

```env
PORT=3001

MONGO_URL=your_mongo_link

CORS_FRONTEND_URL=http://localhost:3000
```

Frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

### 4. Start the backend

```bash
cd backend
npm run dev
```

The API will be available at:

```
http://localhost:3001
```

Make sure to follow the instructions in the `README.md` file for the backend.

---

### 5. Start the frontend

Open another terminal.

```bash
cd frontend
npm run dev
```

The application will be available at:

```
http://localhost:3000
```


Make sure to follow the instructions in the `README.md` file for the frontend.

---

## Features

* Create quizzes
* Add multiple questions
* Supported question types:

  * Boolean (True / False)
  * Short text input
  * Multiple choice (Checkbox)
* View all quizzes
* View quiz details
* Delete quizzes

---

## API Endpoints

| Method | Endpoint       | Description      |
| ------ | -------------- | ---------------- |
| GET    | `/quizzes`     | Get all quizzes  |
| GET    | `/quizzes/:id` | Get quiz details |
| POST   | `/quizzes`     | Create a quiz    |
| DELETE | `/quizzes/:id` | Delete a quiz    |

---

## Notes

* MongoDB is used as the database.
* TanStack Query is used for data fetching and caching.
* Axios is used for HTTP requests.
* CSS Modules are used for styling.

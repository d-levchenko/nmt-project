# Backend

Express API for the Quiz Builder application.

## Technologies

* Express.js
* MongoDB
* Mongoose

---

## Installation

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root.

```env
PORT=3001

MONGO_URL=your_mongo_link

CORS_FRONTEND_URL=http://localhost:3000
```

---

## Run the server

Development

```bash
npm run dev
```

Production

```bash
npm start
```

---

## API

### Create Quiz

```
POST /quizzes
```

Creates a new quiz.

---

### Get All Quizzes

```
GET /quizzes
```

Returns all quizzes.

---

### Get Quiz by ID

```
GET /quizzes/:id
```

Returns a single quiz with all questions.

---

### Delete Quiz

```
DELETE /quizzes/:id
```

Deletes a quiz from the database.

---

## Database

The application uses MongoDB with Mongoose.

Make sure the `MONGO_URL` environment variable points to a valid MongoDB instance before starting the server.

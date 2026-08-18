import createHttpError from 'http-errors';
import { Quiz } from '../models/quiz.js';

export const createQuiz = async (req, res) => {
  const { title, description, questions } = req.validated.body;

  const normalizedQuestions = questions.map(question => {
    const answers = question.answers.map(text => ({ text }));
    return {
      text: question.text,
      answers,
      correctAnswer: answers[question.correctAnswerIndex]._id,
    };
  });

  const quiz = await Quiz.create({
    title,
    description,
    questions: normalizedQuestions,
    createdBy: req.user._id,
  });

  res.status(201).json({
    quiz: {
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      questionCount: quiz.questions.length,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
      createdBy: quiz.createdBy,
    },
  });
};

export const getAllQuizzes = async (req, res) => {
  const { page, perPage } = req.validated.query;
  const skip = (page - 1) * perPage;

  const [totalQuizzes, quizzes] = await Promise.all([
    Quiz.countDocuments(),
    Quiz.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .select('title description questions createdAt'),
  ]);

  res.json({
    page,
    perPage,
    totalQuizzes,
    totalPages: Math.ceil(totalQuizzes / perPage),
    quizzes: quizzes.map(quiz => ({
      id: quiz._id.toString(),
      title: quiz.title,
      description: quiz.description,
      questionCount: quiz.questions.length,
      createdAt: quiz.createdAt,
    })),
  });
};

export const getQuizById = async (req, res) => {
  const { quizId } = req.validated.params;
  const quiz = await Quiz.findById(quizId);

  if (!quiz) throw createHttpError(404, 'Quiz not found');

  res.json({
    quiz: {
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      questionCount: quiz.questions.length,
      questions: quiz.questions.map(q => ({
        id: q._id,
        text: q.text,
        answers: q.answers.map(a => ({ id: a._id, text: a.text })),
      })),
      createdAt: quiz.createdAt,
    },
  });
};

export const deleteQuizById = async (req, res) => {
  const { quizId } = req.params;
  const quiz = await Quiz.findByIdAndDelete(quizId);

  if (!quiz) throw createHttpError(404, 'Quiz not found');

  res.json(quiz);
};

export const updateQuizById = async (req, res) => {
  const { quizId } = req.validated.params;
  const { title, description, questions } = req.validated.body;

  const normalizedQuestions = questions.map(question => {
    const answers = question.answers.map(text => ({ text }));
    return {
      text: question.text,
      answers,
      correctAnswer: answers[question.correctAnswerIndex]._id,
    };
  });

  const quiz = await Quiz.findByIdAndUpdate(
    quizId,
    {
      title,
      description,
      questions: normalizedQuestions,
    },
    { new: true },
  );

  if (!quiz) throw createHttpError(404, 'Quiz not found');

  res.json({
    quiz: {
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      questionCount: quiz.questions.length,
      questions: quiz.questions.map(q => ({
        id: q._id,
        text: q.text,
        answers: q.answers.map(a => ({ id: a._id, text: a.text })),
      })),
      createdAt: quiz.createdAt,
    },
  });
};

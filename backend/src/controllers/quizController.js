import createHttpError from 'http-errors';
import { QuizCollection } from '../models/quiz.js';

export const createQuiz = async (req, res) => {
  const quiz = await QuizCollection.create(req.body);

  res.status(201).json(quiz);
};

export const getAllQuizzes = async (req, res) => {
  const { page = 1, perPage = 10 } = req.query;
  const skip = (page - 1) * perPage;

  const quizQuery = QuizCollection.find();

  const [totalItems, quizzes] = await Promise.all([
    quizQuery.clone().countDocuments(),
    quizQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page,
    perPage,
    totalQuizzes: totalItems,
    totalPages,
    quizzes,
  });
};

export const getQuizById = async (req, res) => {
  const { quizId } = req.params;
  const quiz = await QuizCollection.findById(quizId);

  if (!quiz) throw createHttpError(404, 'Quiz not found');

  res.json(quiz);
};

export const deleteQuizById = async (req, res) => {
  const { quizId } = req.params;
  const quiz = await QuizCollection.findByIdAndDelete(quizId);

  if (!quiz) throw createHttpError(404, 'Quiz not found');

  res.json(quiz);
};

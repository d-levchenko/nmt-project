import createHttpError from 'http-errors';
import { Quiz } from '../models/quiz.js';
import { QuizAttempt } from '../models/quizAttempt.js';

const percentile = (values, value, higherIsBetter = true) => {
  if (!values.length) return 100;
  const count = values.filter(v =>
    higherIsBetter ? v < value : v > value,
  ).length;

  return Math.round((count / values.length) * 100);
};

export const startAttempt = async (req, res) => {
  const { quizId, questionCount } = req.validated.body;

  const quiz = await Quiz.findById(quizId).select('title questions');

  if (!quiz) throw createHttpError(404, 'Quiz not found');

  if (questionCount > quiz.questions.length)
    throw createHttpError(
      400,
      `This quiz has only ${quiz.questions.length} questions.`,
    );

  const shuffled = [...quiz.questions]
    .sort(() => Math.random() - 0.5)
    .slice(0, questionCount);

  const attempt = await QuizAttempt.create({
    user: req.user._id,
    quiz: quiz._id,
    questionIds: shuffled.map(question => question._id),
    answers: [],
    totalQuestions: questionCount,
    correctAnswers: 0,
    percentage: 0,
    totalTime: 0,
    averageAnswerTime: 0,
  });

  res.status(201).json({
    attempt: {
      id: attempt._id,
      quizId: quiz._id,
      quizTitle: quiz.title,
      questions: shuffled.map(q => ({
        id: q._id,
        type: q.type,
        text: q.text,
        answers: q.answers.map(a => ({ id: a._id, text: a.text })),
      })),
    },
  });
};

export const finishAttempt = async (req, res) => {
  const { answers } = req.validated.body;

  const attempt = await QuizAttempt.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!attempt) throw createHttpError(404, 'Attempt not found.');
  if (attempt.answers.length)
    throw createHttpError(400, 'This attempt has already been completed.');

  const quiz = await Quiz.findById(attempt.quiz).select('title questions');
  const selectedQuestionIds = new Set(answers.map(a => a.questionId));
  const allowedQuestionIds = new Set(
    attempt.questionIds.map(id => id.toString()),
  );

  const allQuestionsBelongToAttempt = [...selectedQuestionIds].every(id =>
    allowedQuestionIds.has(id),
  );

  if (
    answers.length !== attempt.totalQuestions ||
    selectedQuestionIds.size !== answers.length ||
    !allQuestionsBelongToAttempt
  )
    throw createHttpError(400, 'Invalid attempt.');

  const results = [];
  for (const submitted of answers) {
    const question = quiz.questions.id(submitted.questionId);

    if (!question) {
      throw createHttpError(400, 'Invalid question in attempt.');
    }

    let correct = false;

    switch (question.type) {
      case 'boolean': {
        if (submitted.selectedAnswerIds.length !== 1) {
          throw createHttpError(
            400,
            'Boolean question requires exactly one answer.',
          );
        }

        const selectedId = submitted.selectedAnswerIds[0];

        const selectedAnswer = question.answers.id(selectedId);

        if (!selectedAnswer) {
          throw createHttpError(400, 'Invalid answer for question.');
        }

        correct =
          question.correctAnswerIds.length === 1 &&
          question.correctAnswerIds[0].toString() === selectedId.toString();

        break;
      }
      case 'checkbox': {
        const selectedIds = submitted.selectedAnswerIds.map(id =>
          id.toString(),
        );

        const allAnswersExist = selectedIds.every(id =>
          question.answers.id(id),
        );

        if (!allAnswersExist) {
          throw createHttpError(400, 'Invalid answer for question.');
        }

        const correctIds = question.correctAnswerIds
          .filter(Boolean)
          .map(id => id.toString());

        const sameIds = (first, second) => {
          if (first.length !== second.length) return false;

          const firstSet = new Set(first.map(id => id.toString()));
          const secondSet = new Set(second.map(id => id.toString()));

          return [...firstSet].every(id => secondSet.has(id));
        };

        correct = sameIds(selectedIds, correctIds);

        break;
      }
      case 'input': {
        const normalizeAnswer = value => value.trim().toLowerCase();
        const submittedText = normalizeAnswer(submitted.answerText);
        const correctText = normalizeAnswer(question.correctAnswerText);

        correct = submittedText === correctText;

        break;
      }
    }

    results.push({
      question: question._id,
      selectedAnswerIds: submitted.selectedAnswerIds,
      answerText: submitted.answerText,
      correct,
      answerTime: submitted.answerTime,
    });
  }

  const correctAnswers = results.filter(answer => answer.correct).length;
  const totalTime = results.reduce((sum, answer) => sum + answer.answerTime, 0);
  const averageAnswerTime = totalTime / results.length;
  const percentage = (correctAnswers / results.length) * 100;

  attempt.answers = results;
  attempt.correctAnswers = correctAnswers;
  attempt.percentage = percentage;
  attempt.totalTime = totalTime;
  attempt.averageAnswerTime = averageAnswerTime;
  await attempt.save();

  const peerAttempts = await QuizAttempt.find({
    quiz: quiz._id,
    'answers.0': { $exists: true },
    _id: { $ne: attempt._id },
  }).select('percentage averageAnswerTime');

  const scorePercentile = peerAttempts.length
    ? percentile(
        peerAttempts.map(item => item.percentage),
        percentage,
        true,
      )
    : null;
  const timePercentile = peerAttempts.length
    ? percentile(
        peerAttempts.map(item => item.averageAnswerTime),
        averageAnswerTime,
        false,
      )
    : null;

  res.json({
    result: {
      attemptId: attempt._id,
      quizId: quiz._id,
      quizTitle: quiz.title,
      correctAnswers,
      totalQuestions: results.length,
      percentage: Math.round(percentage),
      averageAnswerTime: Number(averageAnswerTime.toFixed(1)),
      scorePercentile,
      timePercentile,
      answers: results.map(result => {
        const question = quiz.questions.id(result.question);
        return {
          questionId: result.question,
          questionText: question.text,
          type: question.type,
          selectedAnswerIds: result.selectedAnswerIds,
          correctAnswerIds: question.correctAnswerIds,
          answerText: result.answerText,
          correctAnswerText: question.correctAnswerText || null,
          correct: result.correct,
          answerTime: result.answerTime,
        };
      }),
    },
  });
};

export const getMyHistory = async (req, res) => {
  const { page = 1, perPage = 10 } = req.query;
  const skip = (page - 1) * perPage;

  const attemptsQuery = QuizAttempt.find({ user: req.user._id })
    .populate('quiz', 'title')
    .sort({ createdAt: -1 });

  const [totalItems, attempts] = await Promise.all([
    attemptsQuery.clone().countDocuments(),
    attemptsQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.json({
    attempts,
    page,
    perPage,
    totalAttempts: totalItems,
    totalPages,
  });
};

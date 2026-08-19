import { Schema, model } from 'mongoose';

const answerResultSchema = new Schema(
  {
    question: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    selectedAnswerIds: [{
      type: Schema.Types.ObjectId,
      required: true,
    }],
    answerText: {
      type: String,
      default: '',
    },
    correct: {
      type: Boolean,
      required: true,
    },
    answerTime: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const attemptSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    quiz: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
      index: true,
    },
    questionIds: {
      type: [Schema.Types.ObjectId],
      required: true,
    },
    answers: {
      type: [answerResultSchema],
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    totalTime: {
      type: Number,
      required: true,
    },
    averageAnswerTime: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

attemptSchema.index({ quiz: 1, percentage: 1, user: 1, createdAt: -1 });

export const QuizAttempt = model('QuizAttempt', attemptSchema);

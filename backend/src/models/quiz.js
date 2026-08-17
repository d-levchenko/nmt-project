import { model, Schema } from 'mongoose';
import { QUESTION_TYPES } from '../constants/questionType.js';

const questionSchema = new Schema(
  {
    questionText: { type: String, required: true, trim: true },
    type: { type: String, enum: QUESTION_TYPES, required: true },
    options: { type: [String], default: undefined },
    correctAnswer: { type: Schema.Types.Mixed, required: true },
  },
  { _id: true },
);

const quizSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    questions: {
      type: [questionSchema],
      validate: {
        validator: value => Array.isArray(value) && value.length > 0,
        message: 'Quiz must contain at least one question',
      },
    },
  },
  { timestamps: true, versionKey: false },
);

export const QuizCollection = model('Quiz', quizSchema);

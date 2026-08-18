import { Schema, model } from 'mongoose';

const answerSchema = new Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { _id: true },
);

const questionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['boolean', 'input', 'checkbox'],
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    answers: {
      type: [answerSchema],
      default: [],
    },
    correctAnswerIds: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    correctAnswerText: {
      type: String,
      default: '',
    },
  },
  { _id: true },
);

const quizSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: questions => questions.length >= 1,
        message: 'A quiz must contain at least one question.',
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

quizSchema.index({ createdAt: -1 });

export const Quiz = model('Quiz', quizSchema);

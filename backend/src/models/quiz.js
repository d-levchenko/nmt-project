import { Schema, model } from 'mongoose';

const answerSchema = new Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { _id: true },
);

const questionSchema = new Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    answers: {
      type: [answerSchema],
      validate: {
        validator: answers => answers.length >= 2 && answers.length <= 8,
        message: 'Each question must have between 2 and 8 answers.',
      },
    },
    correctAnswer: { type: Schema.Types.ObjectId, required: true },
  },
  { _id: true },
);

const quizSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
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

quizSchema.index({ createdAt: 1 });

export const Quiz = model('Quiz', quizSchema);

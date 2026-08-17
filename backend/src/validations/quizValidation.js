import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { QUESTION_TYPES } from '../constants/questionType.js';

const questionSchema = Joi.object({
  questionText: Joi.string().trim().min(5).required().messages({
    'string.empty': '"questionText" is required',
  }),

  type: Joi.string()
    .valid(...QUESTION_TYPES)
    .required(),

  options: Joi.when('type', {
    is: 'checkbox',
    then: Joi.array()
      .items(Joi.string().trim().min(1))
      .min(2)
      .required()
      .messages({
        'array.min': 'Checkbox questions require at least 2 options',
      }),
    otherwise: Joi.forbidden(),
  }),

  correctAnswer: Joi.when('type', {
    switch: [
      { is: 'boolean', then: Joi.boolean().required() },
      { is: 'input', then: Joi.string().trim().min(1).required() },
      {
        is: 'checkbox',
        then: Joi.array()
          .items(Joi.string())
          .min(1)
          .required()
          .custom((value, helpers) => {
            const { options = [] } = helpers.state.ancestors[0];
            const isSubset = value.every(answer => options.includes(answer));
            return isSubset
              ? value
              : helpers.message(
                  '"correctAnswer" must only contain values from "options"',
                );
          }),
      },
    ],
  }),
});

export const createQuizSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().trim().min(1).required(),
    questions: Joi.array().items(questionSchema).min(1).required(),
  }),
};

export const quizIdSchema = {
  [Segments.PARAMS]: Joi.object({
    quizId: Joi.string()
      .custom((value, helpers) =>
        !isValidObjectId(value)
          ? helpers.message('"quizId" must be a valid ObjectId')
          : value,
      )
      .required(),
  }),
};

export const getAllQuizzesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
  }),
};

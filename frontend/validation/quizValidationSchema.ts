import * as Yup from 'yup';

const questionTextSchema = Yup.string()
  .trim()
  .min(5, 'Question text should be at least 5 characters long')
  .required('Question text is required');

const booleanQuestionSchema = Yup.object({
  questionText: questionTextSchema,
  type: Yup.mixed<'boolean'>().oneOf(['boolean']).required(),
  correctAnswerBoolean: Yup.boolean().required(),
});

const inputQuestionSchema = Yup.object({
  questionText: questionTextSchema,
  type: Yup.mixed<'input'>().oneOf(['input']).required(),
  correctAnswerText: Yup.string()
    .trim()
    .min(1, 'Answer cannot be empty')
    .required('Answer is required'),
});

const checkboxQuestionSchema = Yup.object({
  questionText: questionTextSchema,
  type: Yup.mixed<'checkbox'>().oneOf(['checkbox']).required(),
  options: Yup.array()
    .of(Yup.string().trim().min(1, 'Option cannot be empty').required())
    .min(2, 'Checkbox questions require at least 2 options')
    .required(),
  correctAnswerCheckboxIndexes: Yup.array()
    .of(Yup.number().required())
    .min(1, 'Select at least one correct answer')
    .required(),
});

const questionSchema = Yup.lazy((question: { type?: string }) => {
  switch (question?.type) {
    case 'boolean':
      return booleanQuestionSchema;
    case 'input':
      return inputQuestionSchema;
    case 'checkbox':
      return checkboxQuestionSchema;
    default:
      return Yup.object({
        type: Yup.string().required('Question type is required'),
      });
  }
});

export const quizValidationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(1, 'Title cannot be empty')
    .required('Title is required'),
  questions: Yup.array()
    .of(questionSchema)
    .min(1, 'Quiz must contain at least one question')
    .required(),
});

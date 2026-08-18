import * as Yup from 'yup';

const base = {
  questionText: Yup.string()
    .trim()
    .min(5, 'Question text should be at least 5 characters.')
    .required('Question text is required.'),
};

const booleanSchema = Yup.object({
  ...base,
  type: Yup.mixed<'boolean'>().oneOf(['boolean']).required(),
  correctAnswerBoolean: Yup.boolean().required(),
});

const inputSchema = Yup.object({
  ...base,
  type: Yup.mixed<'input'>().oneOf(['input']).required(),
  correctAnswerText: Yup.string()
    .trim()
    .min(1, 'Correct answer is required.')
    .required('Correct answer is required.'),
});

const checkboxSchema = Yup.object({
  ...base,
  type: Yup.mixed<'checkbox'>().oneOf(['checkbox']).required(),
  options: Yup.array()
    .of(Yup.string().trim().min(1, 'Option cannot be empty.').required())
    .min(2, 'Add at least two options.')
    .max(8)
    .required(),
  correctAnswerCheckboxIndexes: Yup.array()
    .of(Yup.number().integer().min(0))
    .min(1, 'Select at least one correct answer.')
    .required(),
}).test(
  'valid-indices',
  'Selected correct options are invalid.',
  value =>
    !!value &&
    value.correctAnswerCheckboxIndexes.every((index): boolean => {
      if (typeof index !== 'number') {
        return false;
      }
      return index < value.options.length;
    }),
);

export const quizValidationSchema = Yup.object({
  title: Yup.string().trim().min(1).max(150).required('Title is required.'),
  description: Yup.string().max(1000),
  questions: Yup.array()
    .of(
      Yup.lazy(value =>
        value?.type === 'boolean'
          ? booleanSchema
          : value?.type === 'input'
            ? inputSchema
            : checkboxSchema,
      ),
    )
    .min(1, 'Add at least one question.')
    .required(),
});

import * as Yup from 'yup';

const base = {
  questionText: Yup.string()
    .trim()
    .min(5, 'Питання має бути не менше 5 символів.')
    .required(`Питання обов'язкове.`),
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
    .min(1, 'Відповідь має бути не менше 1 символу.')
    .required(`Відповідь обов'язкова.`),
});

const checkboxSchema = Yup.object({
  ...base,
  type: Yup.mixed<'checkbox'>().oneOf(['checkbox']).required(),
  options: Yup.array()
    .of(
      Yup.string().trim().min(1, `Варіанти відповіді обов'язкові.`).required(),
    )
    .min(2, 'Має бути не менше 2 варіантів.')
    .max(8, 'Має бути не більше 8 варіантів.')
    .required(),
  correctAnswerCheckboxIndexes: Yup.array()
    .of(
      Yup.number()
        .integer()
        .min(0, `Варіанти відповіді обов'язкові.`)
        .required(),
    )
    .min(1, 'Виберіть хоча б один правильний варіант.')
    .required(),
});

export const quizValidationSchema = Yup.object({
  title: Yup.string().trim().min(1).max(150).required(`Назва обов'язкова.`),
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
    .min(1, 'Додайте хоча б одне питання.')
    .required(),
});

import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Введіть валідну пошту.')
    .required(`Пошта обовя'зкова.`),
  password: Yup.string().required(`Пароль обов'язковий.`),
});

export const registerSchema = Yup.object({
  username: Yup.string()
    .trim()
    .min(2, `Ім'я має бути не менше 2 символів.`)
    .max(60, `Ім'я має бути не більше 60 символів.`)
    .required(`Ім'я обов'язкове.`),
  email: Yup.string()
    .email('Введіть валідну пошту.')
    .required(`Пошта обовя'зкова.`),
  password: Yup.string()
    .min(8, 'Пароль має бути не менше 8 символів.')
    .required(`Пароль обов'язковий.`),
});

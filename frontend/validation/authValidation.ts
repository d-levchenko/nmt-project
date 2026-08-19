import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email.')
    .required('Email is required.'),
  password: Yup.string().required('Password is required.'),
});

export const registerSchema = Yup.object({
  username: Yup.string()
    .trim()
    .min(2, 'Username must be at least 2 characters.')
    .max(60, 'Username cannot exceed 60 characters.')
    .required('Username is required.'),
  email: Yup.string()
    .email('Enter a valid email.')
    .required('Email is required.'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters.')
    .required('Password is required.'),
});

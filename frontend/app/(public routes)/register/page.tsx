'use client';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { getApiError } from '@/lib/error';

const schema = Yup.object({
  username: Yup.string()
    .trim()
    .min(2)
    .max(60)
    .required('Username is required.'),
  email: Yup.string()
    .email('Enter a valid email.')
    .required('Email is required.'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters.')
    .required('Password is required.'),
});

const Register = () => {
  const router = useRouter();
  const setUser = useAuthStore(s => s.setUser);

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border bg-white p-7 shadow-sm">
        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="mt-2 text-slate-500">
          Start training and track your progress.
        </p>
        <Formik
          initialValues={{ username: '', email: '', password: '' }}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting, setStatus }) => {
            try {
              const user = await registerUser(values);
              setUser(user);
              router.push('/login');
            } catch (e) {
              setStatus(getApiError(e));
            } finally {
              setSubmitting(false);
            }
          }}>
          {({ status, isSubmitting }) => (
            <Form className="mt-7 space-y-4">
              <label className="block">
                Username
                <Field
                  name="username"
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
                <ErrorMessage
                  name="username"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </label>
              <label className="block">
                Email
                <Field
                  name="email"
                  type="email"
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </label>
              <label className="block">
                Password
                <Field
                  name="password"
                  type="password"
                  className="mt-1 w-full rounded-lg border px-3 py-2"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </label>
              {status && <p className="text-sm text-red-600">{status}</p>}
              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white">
                {isSubmitting ? 'Creating…' : 'Create account'}
              </button>
            </Form>
          )}
        </Formik>
        <p className="mt-5 text-center text-sm text-slate-500">
          Already registered?{' '}
          <Link href="/login" className="font-medium text-slate-900 underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;

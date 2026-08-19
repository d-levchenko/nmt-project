'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUser } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { getApiError } from '@/lib/error';
import { loginSchema } from '@/validation/authValidation';

const Login = () => {
  const router = useRouter();
  const params = useSearchParams();
  const { setUser, setInitialized } = useAuthStore();

  const handleSubmitForm = async (
    values: { email: string; password: string },
    {
      setSubmitting,
      setStatus,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      setStatus: (status?: string) => void;
    },
  ) => {
    try {
      const user = await loginUser(values);
      setUser(user);
      setInitialized(true);
      router.push(params.get('next') || '/quizzes');
    } catch (error) {
      setStatus(getApiError(error));
      setInitialized(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border bg-white p-7 shadow-sm">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-slate-500">Sign in to continue training.</p>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleSubmitForm}>
          {({ status, isSubmitting }) => (
            <Form className="mt-7 space-y-4">
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
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </button>
            </Form>
          )}
        </Formik>
        <p className="mt-5 text-center text-sm text-slate-500">
          No account?{' '}
          <Link
            href="/register"
            className="font-medium text-slate-900 underline">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;

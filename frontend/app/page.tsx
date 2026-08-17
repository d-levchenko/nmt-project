import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quiz Builder',
  description: 'Create and manage quizzes with ease',

  openGraph: {
    type: 'website',
    title: 'Quiz Builder',
    description: 'Create and manage quizzes with ease',
    siteName: 'Quiz Builder',
  },
};

const HomePage = () => {
  return (
    <section className="py-20 text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
        Quiz training platform
      </p>
      <h1 className="text-4xl font-bold sm:text-6xl">
        Practice. Measure. Improve.
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
        Choose a quiz, train with as many questions as you want, and compare
        your score and speed with other learners.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/quizzes"
          className="rounded-lg bg-black px-5 py-3 text-white">
          Browse quizzes
        </Link>
        <Link href="/register" className="rounded-lg border bg-white px-5 py-3">
          Create account
        </Link>
      </div>
    </section>
  );
};

export default HomePage;

import QuizForm from '@/components/QuizForm/QuizForm';

import css from './page.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create a quiz',
  description: 'Create a custom quiz by adding one or more questions.',

  openGraph: {
    type: 'website',
    title: 'Create a quiz',
    description: 'Create a custom quiz by adding one or more questions.',
    siteName: 'Quiz Builder',
  },
};

const CreateQuizPage = () => {
  return (
    <main className={css.page}>
      <header className={css.header}>
        <h1 className={css.title}>Create a quiz</h1>

        <p className={css.description}>
          Build a custom quiz by adding one or more questions. You can mix
          boolean, input, and checkbox question types.
        </p>
      </header>

      <QuizForm />
    </main>
  );
};

export default CreateQuizPage;

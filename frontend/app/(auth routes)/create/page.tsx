'use client';
import Protected from '@/components/Protected/Protected';
import QuizForm from '@/components/QuizForm/QuizForm';

const CreatePage = () => {
  return (
    <Protected roles={['teacher', 'admin']}>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Create a quiz</h1>
          <p className="mt-2 text-slate-500">
            Build a quiz using boolean, input, and multiple-answer questions.
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <QuizForm />
        </div>
      </main>
    </Protected>
  );
};

export default CreatePage;

'use client';

import { useQuery } from '@tanstack/react-query';

import { getQuizById } from '@/lib/quizApi';

import QuizDetails from '@/components/QuizDetails/QuizDetails';
import Loader from '@/components/Loader/Loader';
import ErrorComponent from '@/components/ErrorComponent/ErrorComponent';

type Props = {
  id: string;
};

const QuizDetailsClient = ({ id }: Props) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['quiz', id],
    queryFn: () => getQuizById(id),
  });

  if (!data) {
    return (
      <p className="text-center">Sorry, we couldn&apos;t find that quiz.</p>
    );
  }

  return (
    <main>
      {isLoading && <Loader />}
      {isError && <ErrorComponent />}

      <h1>{data.title}</h1>

      <ol>
        {data.questions.map((question, index) => (
          <li key={index}>
            <QuizDetails quizId={data._id} question={question} />
          </li>
        ))}
      </ol>
    </main>
  );
};

export default QuizDetailsClient;

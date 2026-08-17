import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getQuizzes } from '@/lib/quizApi';
import QuizzesClient from './Quizzes.client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quizzes',
  description: 'Create and manage quizzes with ease',

  openGraph: {
    type: 'website',
    title: 'Quizzes',
    description: 'Create and manage quizzes with ease',
    siteName: 'Quiz Builder',
  },
};

const QuizzesPage = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['quizzes'],
    queryFn: () => getQuizzes(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuizzesClient />
    </HydrationBoundary>
  );
};

export default QuizzesPage;

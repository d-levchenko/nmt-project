import { notFound } from 'next/navigation';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';

import { ApiError } from '@/lib/apiClient';
import { getQuizById } from '@/lib/quizApi';
import QuizDetailsClient from './QuizDetails.client';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { id } = await params;

  return {
    title: `Quiz ${id}`,
    description: 'Create and manage quizzes with ease',

    openGraph: {
      type: 'website',
      title: `Quiz ${id}`,
      description: 'Create and manage quizzes with ease',
      siteName: 'Quiz Builder',
    },
  };
};

const QuizDetailPage = async ({ params }: Props) => {
  const { id } = await params;

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ['quiz', id],
      queryFn: () => getQuizById(id),
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }

    throw err;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuizDetailsClient id={id} />
    </HydrationBoundary>
  );
};

export default QuizDetailPage;

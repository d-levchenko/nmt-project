import axios from 'axios';

export const getApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      { message?: string; details?: string[] } | undefined;
    return (
      [data?.message, ...(data?.details ?? [])].filter(Boolean).join(' — ') ||
      'Request failed.'
    );
  }

  return error instanceof Error ? error.message : 'Something went wrong.';
};

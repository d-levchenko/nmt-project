'use client';

import Link from 'next/link';
import css from './ErrorComponent.module.css';

const ErrorComponent = () => {
  return (
    <main className={css.page}>
      <h1>Something went wrong</h1>

      <p>An unexpected error occurred while loading this page.</p>

      <Link href="/" className={css.button}>
        Go Home
      </Link>
    </main>
  );
};

export default ErrorComponent;

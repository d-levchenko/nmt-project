import Link from 'next/link';

import css from './NotFound.module.css';

const NotFound = () => {
  return (
    <main className={css.page}>
      <h1>404</h1>

      <h2>Page not found</h2>

      <p>
        The page you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>

      <Link href="/" className={css.button}>
        Go Home
      </Link>
    </main>
  );
};

export default NotFound;

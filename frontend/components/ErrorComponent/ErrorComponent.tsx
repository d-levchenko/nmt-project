'use client';

import Link from 'next/link';
import css from './ErrorComponent.module.css';

const ErrorComponent = () => {
  return (
    <main className={css.page}>
      <h1>Щось пішло не так</h1>

      <p>Під час завантаження цієї сторінки сталася несподівана помилка.</p>

      <Link href="/" className={css.button}>
        На головну
      </Link>
    </main>
  );
};

export default ErrorComponent;

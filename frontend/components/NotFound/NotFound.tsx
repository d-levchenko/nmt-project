import Link from 'next/link';

import css from './NotFound.module.css';

const NotFound = () => {
  return (
    <main className={css.page}>
      <h1>404</h1>

      <h2>Сторінка не знайдена</h2>

      <p>Сторінка, яку ви шукаєте, не існує, або вона була видалена.</p>

      <Link href="/" className={css.button}>
        На головну
      </Link>
    </main>
  );
};

export default NotFound;

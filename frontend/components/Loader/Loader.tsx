import css from './Loader.module.css';

const Loader = () => {
  return (
    <main className={css.page}>
      <div className={css.spinner} />

      <h1>Завантаження...</h1>

      <p>Будь ласка, очікуйте, поки завантажиться сторінка.</p>
    </main>
  );
};

export default Loader;

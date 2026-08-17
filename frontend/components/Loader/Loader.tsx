import css from './Loader.module.css';

const Loader = () => {
  return (
    <main className={css.page}>
      <div className={css.spinner} />

      <h1>Loading...</h1>

      <p>Please wait while we fetch your data.</p>
    </main>
  );
};

export default Loader;

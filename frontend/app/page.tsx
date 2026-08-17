import Link from 'next/link';
import { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Quiz Builder',
  description: 'Create and manage quizzes with ease',

  openGraph: {
    type: 'website',
    title: 'Quiz Builder',
    description: 'Create and manage quizzes with ease',
    siteName: 'Quiz Builder',
  },
};

const HomePage = () => {
  return (
    <main className={styles.hero}>
      <section className={styles.content}>
        <span className={styles.badge}>Quiz Builder</span>

        <h1 className={styles.title}>Create and manage quizzes with ease</h1>

        <p className={styles.description}>
          Build quizzes with multiple question types, browse all created
          quizzes, and view each quiz in a clean, read-only layout.
        </p>

        <div className={styles.actions}>
          <Link href="/create" className={`${styles.button} ${styles.primary}`}>
            + Create quiz
          </Link>

          <Link
            href="/quizzes"
            className={`${styles.button} ${styles.secondary}`}>
            Browse quizzes
          </Link>
        </div>
      </section>
    </main>
  );
};

export default HomePage;

import Link from 'next/link';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          Quiz Builder
        </Link>

        <ul className={styles.menu}>
          <li>
            <Link href="/" className={styles.link}>
              Home
            </Link>
          </li>

          <li>
            <Link href="/quizzes" className={styles.link}>
              Quizzes
            </Link>
          </li>

          <li>
            <Link href="/create" className={styles.primaryLink}>
              + Create Quiz
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

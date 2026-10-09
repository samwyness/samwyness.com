import Link from 'next/link';
import { Container } from 'src/shared/components/layout/Container';
import styles from './not-found.module.css';

export default function NotFoundPage() {
  return (
    <main className={styles.main}>
      <Container className={styles.container}>
        <h1 className={styles.title}>
          Page Not Found
          <span>✳︎</span>
        </h1>
        <p>The page you are looking for is not available.</p>
        <Link href="/" className="button">
          Go to homepage
        </Link>
      </Container>
    </main>
  );
}

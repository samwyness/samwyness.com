import Link from 'next/link';
import { Sticker } from 'src/shared/components/core/Sticker';
import { Container } from 'src/shared/components/layout/Container';
import styles from './not-found.module.css';

export default function NotFoundPage() {
  return (
    <main className={styles.main}>
      <Container className={styles.container}>
        <Sticker
          name="wave"
          label="Wiped out"
          rotate={-8}
          delay={0.2}
          className={styles.sticker}
        />
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

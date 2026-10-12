import Link from 'next/link';
import { CyclingSticker } from 'src/shared/components/core/CyclingSticker';
import { Container } from 'src/shared/components/layout/Container';
import styles from './not-found.module.css';

export default function NotFoundPage() {
  return (
    <main className={styles.main}>
      <Container className={styles.container}>
        <h1 className={styles.title}>
          Page Not Found
          <CyclingSticker
            rotate={10}
            delay={0.6}
            className={styles.titleSticker}
          />
        </h1>
        <p>The page you are looking for is not available.</p>
        <Link href="/" className="button">
          Go to homepage
        </Link>
      </Container>
    </main>
  );
}

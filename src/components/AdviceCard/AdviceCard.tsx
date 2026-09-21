import type { AdviceSlip } from '../../types/advice';
import styles from './AdviceCard.module.css';

interface AdviceCardProps {
  slip: AdviceSlip | null;
  message: string | null;
}

export function AdviceCard({ slip, message }: AdviceCardProps) {
  return (
    <article className={styles.card}>
      {/*
        Polite live region: the advice changes in place with no navigation and
        no focus move, so without this a screen reader user would never learn
        that new advice arrived.
      */}
      <div className={styles.advice} role="status" aria-live="polite">
        {slip ? (
          <>
            <p className={styles.heading}>Advice #{slip.id}</p>
            <p className={styles.quote}>&ldquo;{slip.advice}&rdquo;</p>
          </>
        ) : (
          !message && <p className={styles.heading}>Fetching advice…</p>
        )}

        {message && <p className={styles.message}>{message}</p>}
      </div>

      {/* Mobile asset is the fallback; the desktop rules are wider. */}
      <picture>
        <source media="(min-width: 768px)" srcSet="/pattern-divider-desktop.svg" />
        <img className={styles.divider} src="/pattern-divider-mobile.svg" alt="" />
      </picture>
    </article>
  );
}

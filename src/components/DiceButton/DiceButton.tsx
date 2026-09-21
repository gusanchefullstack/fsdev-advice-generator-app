import styles from './DiceButton.module.css';

interface DiceButtonProps {
  onClick: () => void;
  isBusy: boolean;
}

export function DiceButton({ onClick, isBusy }: DiceButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      disabled={isBusy}
      aria-busy={isBusy}
      aria-label="Get new advice"
    >
      <img className={styles.glyph} src="/icon-dice.svg" alt="" />
    </button>
  );
}

import { AdviceCard } from './components/AdviceCard/AdviceCard';
import { DiceButton } from './components/DiceButton/DiceButton';
import { useAdvice } from './hooks/useAdvice';
import styles from './App.module.css';

export function App() {
  const { state, requestAdvice } = useAdvice();
  const message = state.status === 'failed' ? state.message : null;

  return (
    <main>
      {/*
        The page's single <h1>. The visible "Advice #nnn" line names the current
        slip, not the page, so it is a paragraph rather than a heading.
      */}
      <h1 className="visuallyHidden">Advice generator</h1>

      <div className={styles.layout}>
        <AdviceCard slip={state.slip} message={message} />
        <div className={styles.dice}>
          <DiceButton onClick={requestAdvice} isBusy={state.status === 'loading'} />
        </div>
      </div>
    </main>
  );
}

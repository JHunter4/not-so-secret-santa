import { useCallback, useEffect, useState } from 'react';
import { initialAnswers } from './config.js';
import { ChristmasLights, Snow } from './components/Decorations.jsx';
import AgreementDocument from './components/AgreementDocument.jsx';
import Landing from './screens/Landing.jsx';
import Verify from './screens/Verify.jsx';
import Welcome from './screens/Welcome.jsx';
import Questionnaire from './screens/Questionnaire.jsx';
import Celebration from './screens/Celebration.jsx';

const FESTIVE_SCREENS = new Set(['welcome', 'quiz', 'done']);

export default function App() {
  const [screen, setScreen] = useState('landing');
  const [answers, setAnswers] = useState(initialAnswers);
  const festive = FESTIVE_SCREENS.has(screen);

  useEffect(() => {
    document.body.dataset.theme = festive ? 'festive' : 'dark';
    document.title = festive ? 'Not So Secret Santa 2026 🎅' : 'Totally Normal Work Link';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', festive ? '#0a3326' : '#05070a');
  }, [festive]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  const toVerify = useCallback(() => setScreen('verify'), []);
  const toWelcome = useCallback(() => setScreen('welcome'), []);
  const toQuiz = useCallback(() => setScreen('quiz'), []);
  const toDone = useCallback(() => setScreen('done'), []);
  const restart = useCallback(() => {
    setAnswers(initialAnswers);
    setScreen('landing');
  }, []);

  return (
    <>
      <div className={`app-shell relative min-h-dvh overflow-x-hidden ${festive ? 'festive-bg' : ''}`}>
        {festive && <Snow />}
        {festive && <ChristmasLights />}
        <main key={screen} className="screen-in relative">
          {screen === 'landing' && <Landing onNext={toVerify} />}
          {screen === 'verify' && <Verify onNext={toWelcome} />}
          {screen === 'welcome' && <Welcome onNext={toQuiz} />}
          {screen === 'quiz' && (
            <Questionnaire
              answers={answers}
              setAnswers={setAnswers}
              onBackToWelcome={toWelcome}
              onComplete={toDone}
            />
          )}
          {screen === 'done' && <Celebration answers={answers} onRestart={restart} />}
        </main>
      </div>

      {screen === 'done' && (
        <div className="print-root" aria-hidden="true">
          <AgreementDocument answers={answers} />
        </div>
      )}
    </>
  );
}

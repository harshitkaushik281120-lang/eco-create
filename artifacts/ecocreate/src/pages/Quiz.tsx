import { useState } from 'react';
import { quizData } from '@/data/quizData';
import { useApp } from '@/context/AppContext';

type AnswerState = 'unanswered' | 'correct' | 'wrong';

export default function Quiz() {
  const { addPoints } = useApp();
  const [currentQ, setCurrentQ] = useState(0);
  const [answered, setAnswered] = useState<AnswerState>('unanswered');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showFact, setShowFact] = useState(false);

  const q = quizData[currentQ];
  const progress = ((currentQ + (answered !== 'unanswered' ? 1 : 0)) / quizData.length) * 100;

  const selectAnswer = (index: number) => {
    if (answered !== 'unanswered') return;
    setSelectedOption(index);
    const correct = index === q.correct;
    setAnswered(correct ? 'correct' : 'wrong');
    setShowFact(true);
    if (correct) {
      setScore(s => s + 1);
      addPoints(15);
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= quizData.length) {
      setFinished(true);
    } else {
      setCurrentQ(q => q + 1);
      setAnswered('unanswered');
      setSelectedOption(null);
      setShowFact(false);
    }
  };

  const restart = () => {
    setCurrentQ(0);
    setAnswered('unanswered');
    setSelectedOption(null);
    setScore(0);
    setFinished(false);
    setShowFact(false);
  };

  const pct = Math.round((score / quizData.length) * 100);
  const resultEmoji = pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : '🌱';
  const resultTitle = pct >= 80 ? 'Eco Expert!' : pct >= 60 ? 'Well Done!' : 'Keep Learning!';

  if (finished) {
    return (
      <section style={{ minHeight: '100vh', padding: '100px 30px 50px', background: '#1a1a2e' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div className="section-tag">🧠 Eco Quiz</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: 15 }}>Quiz Complete!</h2>
          </div>
          <div className="eco-card" style={{ padding: 50, textAlign: 'center' }} data-testid="quiz-result">
            <div style={{ fontSize: '5rem', marginBottom: 20 }}>{resultEmoji}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: 10 }}>{resultTitle}</div>
            <div style={{ fontSize: '4rem', fontWeight: 900, color: '#2ecc71' }}>{score}/{quizData.length}</div>
            <div style={{ color: '#888', fontSize: '1.1rem', marginTop: 10 }}>{pct}% correct</div>
            {pct >= 80 && <div style={{ color: '#f39c12', marginTop: 15, fontWeight: 600 }}>🏅 Quiz Master Badge Unlocked!</div>}
            <div style={{ display: 'flex', gap: 15, justifyContent: 'center', marginTop: 30 }}>
              <button className="eco-btn-primary" onClick={restart} data-testid="restart-quiz-btn">
                🔄 Play Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ minHeight: '100vh', padding: '100px 30px 50px', background: '#1a1a2e' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div className="section-tag">🧠 Eco Quiz</div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: 15 }}>Test Your Knowledge</h2>
          <p style={{ color: '#888', fontSize: '1.1rem' }}>Answer eco questions and earn points!</p>
        </div>

        {/* Progress Header */}
        <div className="eco-card" style={{ padding: 25, marginBottom: 25, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
          <div style={{ color: '#2ecc71', fontWeight: 700, flexShrink: 0 }}>
            Q {currentQ + 1}/{quizData.length}
          </div>
          <div style={{ flex: 1 }}>
            <div className="xp-bar-track">
              <div className="xp-bar-fill" style={{ width: `${progress}%`, transition: 'width 0.5s ease' }} />
            </div>
          </div>
          <div style={{ color: '#f39c12', fontWeight: 700, flexShrink: 0 }}>
            Score: {score}
          </div>
        </div>

        {/* Question */}
        <div className="eco-card" style={{ padding: 35, marginBottom: 25 }}>
          <div style={{ color: '#2ecc71', fontWeight: 600, marginBottom: 15, fontSize: '0.9rem' }}>
            Question {currentQ + 1} of {quizData.length}
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'white', lineHeight: 1.6, marginBottom: 25 }} data-testid="question-text">
            {q.q}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {q.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              const isCorrect = i === q.correct;
              let bg = 'rgba(255,255,255,0.05)';
              let borderColor = 'rgba(46,204,113,0.2)';
              let color = '#e0e0e0';
              if (answered !== 'unanswered') {
                if (isCorrect) { bg = 'rgba(46,204,113,0.2)'; borderColor = '#2ecc71'; color = '#2ecc71'; }
                else if (isSelected && !isCorrect) { bg = 'rgba(231,76,60,0.2)'; borderColor = '#e74c3c'; color = '#e74c3c'; }
              }
              return (
                <button
                  key={i}
                  onClick={() => selectAnswer(i)}
                  data-testid={`option-${i}`}
                  style={{
                    background: bg,
                    border: `2px solid ${borderColor}`,
                    color, padding: 18, borderRadius: 12,
                    cursor: answered !== 'unanswered' ? 'default' : 'pointer',
                    fontSize: '0.95rem', fontWeight: 500, transition: 'all 0.3s',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => {
                    if (answered === 'unanswered') {
                      (e.currentTarget as HTMLElement).style.borderColor = '#2ecc71';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(46,204,113,0.1)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (answered === 'unanswered') {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(46,204,113,0.2)';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                    }
                  }}
                >
                  <span style={{ marginRight: 8, fontWeight: 700, color: '#888' }}>
                    {['A', 'B', 'C', 'D'][i]}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fact & Next */}
        {showFact && (
          <div className="animate-fadeInUp">
            <div style={{
              background: answered === 'correct' ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)',
              border: `1px solid ${answered === 'correct' ? 'rgba(46,204,113,0.3)' : 'rgba(231,76,60,0.3)'}`,
              borderRadius: 15, padding: 20, marginBottom: 20,
            }} data-testid="fact-box">
              <div style={{ fontWeight: 700, color: answered === 'correct' ? '#2ecc71' : '#e74c3c', marginBottom: 8 }}>
                {answered === 'correct' ? '✅ Correct! +15 points!' : '❌ Wrong!'}
              </div>
              <div style={{ color: '#aaa', lineHeight: 1.7, fontSize: '0.95rem' }}>💡 {q.fact}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button
                className="eco-btn-primary"
                onClick={nextQuestion}
                data-testid="next-question-btn"
              >
                {currentQ + 1 >= quizData.length ? '🎉 See Results' : '➡️ Next Question'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

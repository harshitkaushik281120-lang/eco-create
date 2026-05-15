import { useState } from 'react';
import { useApp } from '@/context/AppContext';

const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  emoji: ['♻️', '🌱', '🌿', '💚', '🌍', '⭐', '🌊', '🦋'][i % 8],
  left: (i * 7.7 + 5) % 100,
  top: (i * 13.3 + 10) % 100,
  duration: 4 + (i % 4),
  delay: i * 0.5,
}));

export default function Login() {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = username.trim().replace(/\s+/g, '_');
    if (cleaned.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }
    if (cleaned.length > 24) {
      setError('Username must be 24 characters or fewer.');
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(cleaned)) {
      setError('Only letters, numbers, and underscores allowed.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      login(cleaned);
      setLoading(false);
    }, 700);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0a2744 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, position: 'relative', overflow: 'hidden',
    }}>
      {/* Particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {particles.map(p => (
          <div key={p.id} style={{
            position: 'absolute', left: `${p.left}%`, top: `${p.top}%`,
            fontSize: 28, opacity: 0.25,
            animation: `float ${p.duration}s infinite ease-in-out`,
            animationDelay: `${p.delay}s`,
          }}>{p.emoji}</div>
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 460 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 35 }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 8 }}>♻️</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#2ecc71' }}>
            Eco<span style={{ color: '#f39c12' }}>Create</span>
          </div>
          <p style={{ color: '#888', marginTop: 8, fontSize: '1rem' }}>
            Turn waste into wonderful creations
          </p>
        </div>

        {/* Card */}
        <div className="eco-card" style={{ padding: '40px 35px', borderRadius: 24 }}>
          <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.4rem', marginBottom: 6, textAlign: 'center' }}>
            Welcome, Eco Warrior! 🌿
          </h2>
          <p style={{ color: '#888', textAlign: 'center', marginBottom: 28, fontSize: '0.9rem' }}>
            Enter your username to access your personal dashboard.<br />
            New username? We'll create your account automatically.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', color: '#2ecc71', fontWeight: 600, marginBottom: 8, fontSize: '0.9rem' }}>
                👤 Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                placeholder="e.g. GreenWarrior42"
                autoFocus
                maxLength={24}
                data-testid="username-input"
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.07)',
                  border: `2px solid ${error ? '#e74c3c' : 'rgba(46,204,113,0.3)'}`,
                  borderRadius: 12, padding: '14px 18px',
                  color: 'white', fontSize: '1rem', outline: 'none',
                  transition: 'border-color 0.3s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => { if (!error) e.currentTarget.style.borderColor = '#2ecc71'; }}
                onBlur={e => { if (!error) e.currentTarget.style.borderColor = 'rgba(46,204,113,0.3)'; }}
              />
              {error && (
                <p style={{ color: '#e74c3c', fontSize: '0.82rem', marginTop: 6 }} data-testid="login-error">
                  ⚠️ {error}
                </p>
              )}
              <p style={{ color: '#555', fontSize: '0.78rem', marginTop: 6 }}>
                Letters, numbers, underscores only. 3–24 characters.
              </p>
            </div>

            <button
              type="submit"
              className="eco-btn-primary"
              disabled={loading || !username.trim()}
              data-testid="login-btn"
              style={{
                justifyContent: 'center', fontSize: '1.05rem',
                padding: '14px 20px', marginTop: 6,
                opacity: !username.trim() ? 0.6 : 1,
                cursor: !username.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: 18, height: 18, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Loading your dashboard…
                </>
              ) : '🚀 Enter EcoCreate'}
            </button>
          </form>

          {/* Feature hints */}
          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '🔐', text: 'Your data is saved per username on this device' },
              { icon: '📊', text: 'Points, badges & gallery are all unique to you' },
              { icon: '🏆', text: 'Compete on the leaderboard under your name' },
            ].map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#666', fontSize: '0.82rem' }}>
                <span>{h.icon}</span>
                <span>{h.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#444', fontSize: '0.78rem', marginTop: 20 }}>
          🌍 EcoCreate · Building a greener planet together
        </p>
      </div>
    </div>
  );
}

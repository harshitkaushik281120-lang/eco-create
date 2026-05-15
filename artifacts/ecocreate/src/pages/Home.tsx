import { useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';

const features = [
  { icon: '🧪', title: 'Smart Waste Converter', desc: 'Input any waste material and get instant creative product suggestions with step-by-step instructions.' },
  { icon: '🏆', title: 'Gamified Experience', desc: 'Earn points, unlock badges, climb leaderboards, and get recognized for your eco-friendly contributions.' },
  { icon: '🎯', title: 'Monthly Challenges', desc: 'Participate in exciting monthly creative challenges with real rewards like digital certificates and public recognition.' },
  { icon: '🧠', title: 'Eco Quizzes', desc: 'Test your environmental knowledge with fun quizzes and learn new facts about sustainability and recycling.' },
  { icon: '📸', title: 'Creation Gallery', desc: 'Upload photos of your creations, get community feedback, and inspire others with your innovative recycling ideas.' },
  { icon: '🌿', title: 'Green Certificates', desc: 'Earn official green certificates that recognize your commitment to environmental sustainability.' },
];

const counters = [
  { id: 'counterUsers', target: 52847, label: 'Active Users' },
  { id: 'counterCreations', target: 234591, label: 'Creations Made' },
  { id: 'counterKg', target: 89320, label: 'Kg Waste Saved' },
  { id: 'counterCountries', target: 87, label: 'Countries' },
];

function useCounter(ref: React.RefObject<HTMLSpanElement | null>, target: number, active: boolean) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString();
    }, 20);
    return () => clearInterval(timer);
  }, [active, target, ref]);
}

function CounterItem({ target, label, id }: { target: number; label: string; id: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useCounter(ref, target, true);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#2ecc71' }}>
        <span ref={ref} data-testid={id}>0</span>
      </div>
      <div style={{ fontSize: '0.9rem', color: '#888' }}>{label}</div>
    </div>
  );
}

const particles = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  emoji: ['♻️', '🌱', '🌿', '💚', '🌍', '⭐'][Math.floor(Math.random() * 6)],
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: Math.random() * 40 + 20,
  delay: Math.random() * 6,
  duration: 4 + Math.random() * 4,
}));

export default function Home() {
  const { showSection } = useApp();

  return (
    <section style={{
      minHeight: '100vh',
      padding: '100px 30px 50px',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0a2744 100%)',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      {/* Particles */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {particles.map(p => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.left}%`, top: `${p.top}%`,
              fontSize: p.size * 0.8,
              opacity: 0.3,
              animation: `float ${p.duration}s infinite ease-in-out`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.emoji}
          </div>
        ))}
      </div>

      {/* Hero Content */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 800 }}>
        <div
          className="animate-pulse-ring"
          style={{
            display: 'inline-block',
            background: 'rgba(46,204,113,0.2)',
            border: '1px solid #2ecc71',
            color: '#2ecc71',
            padding: '8px 20px',
            borderRadius: 25,
            fontSize: '0.9rem',
            marginBottom: 20,
          }}
          data-testid="hero-badge"
        >
          🌍 Join 50,000+ Eco Warriors Worldwide
        </div>

        <h1
          className="hero-gradient-text"
          style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: 20 }}
          data-testid="hero-title"
        >
          Turn Waste Into<br />Wonderful Creations
        </h1>

        <p style={{ fontSize: '1.2rem', color: '#aaa', marginBottom: 40, lineHeight: 1.8 }}>
          Transform your recyclable materials into amazing products, earn badges, compete on leaderboards, and make a real difference for our planet.
        </p>

        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="eco-btn-primary"
            onClick={() => showSection('converter')}
            data-testid="btn-start-converting"
          >
            🔄 Start Converting
          </button>
          <button
            className="eco-btn-outline"
            onClick={() => showSection('challenges')}
            data-testid="btn-view-challenges"
          >
            🎯 View Challenges
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 40, marginTop: 60, justifyContent: 'center', flexWrap: 'wrap' }}>
          {counters.map(c => <CounterItem key={c.id} {...c} />)}
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ width: '100%', maxWidth: 1200, margin: '80px auto 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div className="section-tag">✨ Why EcoCreate?</div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: 15 }}>
            Everything You Need to Go Green
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 25, marginTop: 50 }}>
          {features.map((f, i) => (
            <div
              key={i}
              className="eco-card eco-card-hover feature-card-top"
              style={{ padding: 30, position: 'relative', overflow: 'hidden' }}
              data-testid={`feature-card-${i}`}
            >
              <div style={{ fontSize: '3rem', marginBottom: 15 }}>{f.icon}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'white', marginBottom: 10 }}>{f.title}</div>
              <p style={{ color: '#888', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

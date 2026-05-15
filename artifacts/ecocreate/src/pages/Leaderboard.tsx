import { useState } from 'react';
import { leaderboardData } from '@/data/leaderboardData';

type Tab = 'weekly' | 'monthly' | 'alltime';

const tabLabels: { id: Tab; label: string }[] = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'alltime', label: 'All Time' },
];

const podiumColors = [
  { bg: 'linear-gradient(135deg,gold,#ffaa00)', shadow: '0 0 30px rgba(255,215,0,0.6)', size: 100, height: 120, rank: 1 },
  { bg: 'linear-gradient(135deg,#c0c0c0,#a0a0a0)', shadow: '0 0 20px rgba(192,192,192,0.4)', size: 80, height: 90, rank: 2 },
  { bg: 'linear-gradient(135deg,#cd7f32,#8b4513)', shadow: '0 0 15px rgba(205,127,50,0.4)', size: 70, height: 70, rank: 3 },
];

const rankColors = ['gold', 'silver', '#cd7f32'];

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<Tab>('weekly');
  const entries = leaderboardData[activeTab];
  const top3 = entries.slice(0, 3);

  return (
    <section style={{ minHeight: '100vh', padding: '100px 30px 50px', background: '#1a1a2e' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div className="section-tag">🏆 Leaderboard</div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: 15 }}>Top Eco Warriors</h2>
          <p style={{ color: '#888', fontSize: '1.1rem' }}>Compete with eco-warriors worldwide and climb to the top!</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 25 }}>
          <div style={{ background: '#0f3460', padding: 5, borderRadius: 15, display: 'flex', gap: 10 }}>
            {tabLabels.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                data-testid={`tab-${t.id}`}
                style={{
                  padding: '10px 25px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  fontWeight: 600, transition: 'all 0.3s', fontSize: '0.95rem',
                  background: activeTab === t.id ? 'linear-gradient(135deg, #2ecc71, #27ae60)' : 'transparent',
                  color: activeTab === t.id ? 'white' : '#888',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Podium */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 15, marginBottom: 40, flexWrap: 'wrap' }}>
          {/* Order: 2nd, 1st, 3rd */}
          {[1, 0, 2].map(rank => {
            const entry = top3[rank];
            if (!entry) return null;
            const p = podiumColors[rank];
            const order = rank === 0 ? 0 : rank === 1 ? -1 : 1;
            return (
              <div key={rank} style={{ textAlign: 'center', order }} data-testid={`podium-${rank + 1}`}>
                <div style={{
                  background: p.bg,
                  width: p.size, height: p.size, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: p.size * 0.35, margin: '0 auto 10px',
                  boxShadow: p.shadow,
                }}>
                  {entry.emoji}
                </div>
                <div style={{
                  background: p.bg,
                  height: p.height,
                  width: p.size + 20,
                  borderRadius: '10px 10px 0 0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                }}>
                  <div style={{ fontSize: rank === 0 ? '1.8rem' : '1.3rem', fontWeight: 800, color: 'white' }}>{p.rank}</div>
                  <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>{entry.name}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {entries.map((entry, i) => (
            <div
              key={i}
              data-testid={`leaderboard-item-${i}`}
              style={{
                background: i === 0
                  ? 'linear-gradient(135deg, #2a2000, #1a1500)'
                  : 'linear-gradient(135deg, #0f3460, #1a4a7a)',
                borderRadius: 15, padding: '18px 25px',
                display: 'flex', alignItems: 'center', gap: 20,
                border: `1px solid ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? '#cd7f32' : 'rgba(46,204,113,0.1)'}`,
                transition: 'all 0.3s', cursor: 'default',
                animation: `fadeInUp 0.4s ease forwards`,
                animationDelay: `${i * 0.05}s`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2ecc71'; (e.currentTarget as HTMLElement).style.transform = 'translateX(5px)'; }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? '#cd7f32' : 'rgba(46,204,113,0.1)';
                (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 900, width: 40, textAlign: 'center', color: i < 3 ? rankColors[i] : '#888' }}>
                {i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}
              </div>
              <div style={{
                width: 50, height: 50, borderRadius: '50%',
                background: `${entry.color}33`,
                border: `2px solid ${entry.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', flexShrink: 0,
              }}>
                {entry.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: 'white', fontSize: '1.05rem' }}>{entry.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#888' }}>{entry.level}</div>
              </div>
              <div style={{ fontSize: '1.2rem' }}>{entry.badges}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2ecc71', flexShrink: 0 }}>
                {entry.points.toLocaleString()} pts
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

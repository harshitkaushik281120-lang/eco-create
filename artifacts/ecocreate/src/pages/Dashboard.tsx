import { useEffect, useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';

const badges = [
  { emoji: '🌱', tooltip: 'First Creation', locked: false },
  { emoji: '🧠', tooltip: 'Quiz Master', locked: false },
  { emoji: '🏆', tooltip: 'Challenge Winner', locked: false },
  { emoji: '💯', tooltip: '100 Points Club', locked: false },
  { emoji: '♻️', tooltip: 'Plastic Hero', locked: false },
  { emoji: '⭐', tooltip: 'Community Star', locked: false },
  { emoji: '🌿', tooltip: 'Green Certified', locked: false },
  { emoji: '📸', tooltip: 'Top Uploader', locked: false },
  { emoji: '🔒', tooltip: 'Locked: 50 Creations', locked: true },
  { emoji: '🔒', tooltip: 'Locked: Level 10', locked: true },
];

const galleryItems = [
  { emoji: '🌸', bg: 'linear-gradient(135deg,#1a4a2e,#0a2a1e)' },
  { emoji: '🎨', bg: 'linear-gradient(135deg,#2a1a4e,#1a0a2e)' },
  { emoji: '🏺', bg: 'linear-gradient(135deg,#4e2a1a,#2e1a0a)' },
  { emoji: '🎭', bg: 'linear-gradient(135deg,#1a4a4e,#0a2a2e)' },
  { emoji: '🌿', bg: 'linear-gradient(135deg,#4e4a1a,#2e2a0a)' },
];

const achievements = [
  { icon: '🔥', name: '7-Day Streak', desc: 'Active for 7 consecutive days' },
  { icon: '♻️', name: 'Plastic Savior', desc: 'Recycled 20+ plastic items' },
  { icon: '🧠', name: 'Quiz Expert', desc: 'Scored 100% on 3 quizzes' },
  { icon: '👑', name: 'Top Creator', desc: 'Most creations this month' },
];

const initialTasks = [
  { label: 'Convert 1 waste material', pts: 25, done: true },
  { label: 'Take the daily eco quiz', pts: 15, done: false },
  { label: 'Upload a creation photo', pts: 20, done: false },
  { label: 'Share a tip with community', pts: 10, done: false },
];

export default function Dashboard() {
  const { userPoints, addPoints, openModal } = useApp();
  const [xpWidth, setXpWidth] = useState(0);
  const [animatedPoints, setAnimatedPoints] = useState(0);
  const [tasks, setTasks] = useState(initialTasks);
  const pointsRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setXpWidth(78), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const target = userPoints;
    const step = target / 60;
    let current = pointsRef.current;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      setAnimatedPoints(Math.floor(current));
    }, 20);
    pointsRef.current = target;
    return () => clearInterval(timer);
  }, [userPoints]);

  const completeTask = (index: number) => {
    if (tasks[index].done) return;
    const updated = [...tasks];
    updated[index] = { ...updated[index], done: true };
    setTasks(updated);
    addPoints(tasks[index].pts);
  };

  const handleUpload = () => {
    addPoints(50);
  };

  const certBody = `
    <div style="text-align:center;padding:20px 0">
      <div style="font-size:5rem;margin-bottom:15px">🏅</div>
      <div style="font-size:0.85rem;color:#2ecc71;letter-spacing:3px;text-transform:uppercase;margin-bottom:10px">Certificate of Achievement</div>
      <div style="font-size:1.8rem;font-weight:800;color:white;margin-bottom:8px">EcoWarrior_Alex</div>
      <div style="color:#888;margin-bottom:15px">Green Champion Level 7 · 23 Eco Creations · 8 Badges Earned</div>
      <div style="background:rgba(46,204,113,0.1);border:1px solid rgba(46,204,113,0.3);border-radius:12px;padding:15px;color:#2ecc71;font-size:0.95rem">
        This certificate recognizes outstanding commitment to environmental sustainability and creative upcycling.
      </div>
    </div>
  `;

  return (
    <section style={{ minHeight: '100vh', padding: '100px 30px 50px', background: '#1a1a2e' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'clamp(260px, 300px, 100%) 1fr', gap: 25, maxWidth: 1200, margin: '0 auto' }}
        className="dashboard-layout">
        <style>{`.dashboard-layout { @media (max-width: 768px) { grid-template-columns: 1fr !important; } }`}</style>

        {/* Left: Profile + Certificate */}
        <div>
          <div className="eco-card" style={{ padding: 30, textAlign: 'center' }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2ecc71, #f39c12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', margin: '0 auto 15px',
              border: '3px solid #2ecc71',
              boxShadow: '0 0 20px rgba(46,204,113,0.4)',
            }} data-testid="user-avatar">
              🌱
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white', marginBottom: 5 }} data-testid="user-name">
              EcoWarrior_Alex
            </div>
            <div style={{ color: '#f39c12', fontWeight: 600, marginBottom: 20 }}>⭐ Level 7 - Green Champion</div>

            <div style={{ margin: '15px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#888', marginBottom: 8 }}>
                <span>XP Progress</span>
                <span>2,340 / 3,000</span>
              </div>
              <div className="xp-bar-track">
                <div className="xp-bar-fill" style={{ width: `${xpWidth}%` }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '20px 0' }}>
              {[
                { num: animatedPoints.toLocaleString(), label: 'Total Points', testId: 'user-points' },
                { num: '23', label: 'Creations' },
                { num: '8', label: 'Badges' },
                { num: '#12', label: 'Global Rank' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2ecc71' }} data-testid={s.testId}>{s.num}</div>
                  <div style={{ fontSize: '0.75rem', color: '#888' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: 'white', marginBottom: 10 }}>🎖️ Your Badges</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {badges.map((b, i) => (
                  <div
                    key={i}
                    className="tooltip-container"
                    style={{ fontSize: '1.8rem', cursor: 'pointer', transition: 'transform 0.3s', filter: b.locked ? 'grayscale(1) opacity(0.3)' : undefined }}
                    onMouseEnter={e => { if (!b.locked) (e.currentTarget as HTMLElement).style.transform = 'scale(1.3)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                    data-testid={`badge-${i}`}
                  >
                    {b.emoji}
                    <div className="tooltip-text">{b.tooltip}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="eco-btn-primary"
              style={{ width: '100%', marginTop: 20, justifyContent: 'center' }}
              onClick={() => openModal('🌿 Green Certificate', certBody)}
              data-testid="view-certificate-btn"
            >
              📜 View Certificate
            </button>
          </div>

          <div className="certificate-card" style={{ marginTop: 20 }}>
            <div style={{ fontSize: '0.85rem', color: '#2ecc71', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>🌿 Certificate of Achievement</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: 5 }}>EcoWarrior_Alex</div>
            <div style={{ color: '#888', fontSize: '0.9rem' }}>Green Champion Level 7<br />23 Eco Creations · 8 Badges Earned</div>
            <div style={{ marginTop: 15, color: '#2ecc71', fontSize: '2rem' }}>🥇</div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
          {/* Upload */}
          <div className="eco-card" style={{ padding: 30 }}>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem', marginBottom: 15 }}>📸 Share Your Creation</h3>
            <div
              onClick={handleUpload}
              data-testid="upload-area"
              style={{
                border: '2px dashed rgba(46,204,113,0.4)',
                borderRadius: 15, padding: 40, textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = '#2ecc71';
                (e.currentTarget as HTMLElement).style.background = 'rgba(46,204,113,0.05)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(46,204,113,0.4)';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: 10 }}>📤</div>
              <p style={{ color: 'white', fontWeight: 600, marginBottom: 5 }}>Upload Your Eco Creation</p>
              <p style={{ color: '#888', fontSize: '0.9rem' }}>Drag & drop or click to upload · PNG, JPG up to 10MB</p>
            </div>

            <div style={{ marginTop: 20 }}>
              <h4 style={{ color: 'white', marginBottom: 15 }}>🖼️ Your Gallery</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15 }}>
                {galleryItems.map((g, i) => (
                  <div key={i} style={{ aspectRatio: '1', borderRadius: 12, overflow: 'hidden', cursor: 'pointer' }} data-testid={`gallery-item-${i}`}>
                    <div style={{ width: '100%', height: '100%', background: g.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', transition: 'transform 0.3s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}>
                      {g.emoji}
                    </div>
                  </div>
                ))}
                <div
                  onClick={handleUpload}
                  style={{ aspectRatio: '1', borderRadius: 12, border: '2px dashed rgba(46,204,113,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '1.5rem' }}
                  data-testid="gallery-add-btn"
                >
                  ➕
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem', marginBottom: 15 }}>🎯 Recent Achievements</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15 }}>
              {achievements.map((a, i) => (
                <div
                  key={i}
                  className="eco-card"
                  style={{ padding: 20, textAlign: 'center', transition: 'all 0.3s', cursor: 'default' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#f39c12'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(46,204,113,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                  data-testid={`achievement-card-${i}`}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>{a.icon}</div>
                  <div style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>{a.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#888', marginTop: 5 }}>{a.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Tasks */}
          <div className="eco-card" style={{ padding: 25 }}>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem', marginBottom: 20 }}>✅ Daily Tasks</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {tasks.map((t, i) => (
                <div
                  key={i}
                  onClick={() => completeTask(i)}
                  data-testid={`task-item-${i}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: t.done ? 'default' : 'pointer', transition: 'opacity 0.3s' }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    border: `2px solid ${t.done ? '#2ecc71' : 'rgba(255,255,255,0.2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: t.done ? '#2ecc71' : 'transparent',
                    background: t.done ? 'rgba(46,204,113,0.15)' : 'transparent',
                    fontSize: '0.85rem', fontWeight: 700, flexShrink: 0,
                    transition: 'all 0.3s',
                  }}>
                    {t.done ? '✓' : ''}
                  </div>
                  <span style={{ color: t.done ? '#aaa' : '#e0e0e0', textDecoration: t.done ? 'line-through' : 'none', flex: 1 }}>
                    {t.label}
                  </span>
                  <span style={{ color: '#2ecc71', fontWeight: 700, fontSize: '0.9rem' }}>+{t.pts}pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

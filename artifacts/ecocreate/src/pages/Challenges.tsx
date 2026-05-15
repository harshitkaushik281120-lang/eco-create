import { useApp } from '@/context/AppContext';

interface Challenge {
  status: 'active' | 'upcoming' | 'completed';
  icon: string;
  title: string;
  desc: string;
  rewards: string[];
  timer: string;
  participants?: { count: string; pct: number; barColor?: string };
  btnLabel: string;
  btnColor?: string;
}

const challenges: Challenge[] = [
  {
    status: 'active', icon: '🎋', title: 'Plastic to Art Challenge',
    desc: 'Transform plastic bottles and containers into stunning artworks. Show us your creativity and win big rewards!',
    rewards: ['🏆 500 Points', '📜 Green Certificate', '⭐ Featured Creator'],
    timer: '⏰ 12 days remaining',
    participants: { count: '1,234 participants', pct: 82 },
    btnLabel: '🚀 Join Challenge',
  },
  {
    status: 'active', icon: '📰', title: 'Paper Craft Marathon',
    desc: 'Use old newspapers and magazines to create functional household items. Origami, papier-mâché, anything goes!',
    rewards: ['🏆 350 Points', '🎖️ Paper Master Badge', '🌿 Eco Medal'],
    timer: '⏰ 8 days remaining',
    participants: { count: '892 participants', pct: 65, barColor: 'linear-gradient(90deg,#3498db,#9b59b6)' },
    btnLabel: '🚀 Join Challenge',
  },
  {
    status: 'upcoming', icon: '👕', title: 'Fashion from Trash',
    desc: 'Create wearable fashion items from discarded fabrics, old clothes, and textile waste. Be a sustainable fashion designer!',
    rewards: ['🏆 600 Points', '👑 Fashion Eco Award', '📱 App Feature'],
    timer: '📅 Starts in 5 days',
    btnLabel: '🔔 Remind Me',
    btnColor: 'linear-gradient(135deg,#3498db,#9b59b6)',
  },
  {
    status: 'upcoming', icon: '🪵', title: 'Wood & Garden Magic',
    desc: 'Build garden furniture, planters, or decorations from wood scraps and reclaimed materials. Go green in your garden!',
    rewards: ['🏆 450 Points', '🌳 Nature Badge', '📜 Certificate'],
    timer: '📅 Starts in 12 days',
    btnLabel: '🔔 Remind Me',
    btnColor: 'linear-gradient(135deg,#3498db,#9b59b6)',
  },
  {
    status: 'completed', icon: '🥫', title: 'Tin Can Treasures',
    desc: "Last month's winner challenge! Participants transformed tin cans into beautiful planters, lanterns, and organizers.",
    rewards: ['🥇 Winner: GreenQueen', '👥 2,341 Joined'],
    timer: '✅ Ended 3 days ago',
    btnLabel: '📊 View Results',
    btnColor: 'linear-gradient(135deg,#9b59b6,#7d3c98)',
  },
  {
    status: 'active', icon: '🔋', title: 'E-Waste Innovation',
    desc: 'Safely repurpose electronic components into new functional devices or art installations. Tech meets sustainability!',
    rewards: ['🏆 750 Points', '💻 Tech Eco Badge', '🌟 Hall of Fame'],
    timer: '⏰ 20 days remaining',
    participants: { count: '456 participants', pct: 30, barColor: 'linear-gradient(90deg,#f39c12,#e74c3c)' },
    btnLabel: '🚀 Join Challenge',
  },
];

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: 'rgba(46,204,113,0.2)', color: '#2ecc71', label: '🔴 Active Now' },
  upcoming: { bg: 'rgba(52,152,219,0.2)', color: '#3498db', label: '🔵 Coming Soon' },
  completed: { bg: 'rgba(155,89,182,0.2)', color: '#9b59b6', label: '✅ Completed' },
};

export default function Challenges() {
  const { addPoints, showNotification } = useApp();

  const joinChallenge = (title: string, status: string) => {
    if (status === 'active') {
      addPoints(10);
      showNotification({ icon: '🎯', text: `Joined "${title}"!`, sub: 'Good luck, eco warrior!' });
    } else if (status === 'upcoming') {
      showNotification({ icon: '🔔', text: 'Reminder Set!', sub: `We'll notify you when "${title}" starts` });
    } else {
      showNotification({ icon: '📊', text: 'Results Coming Soon', sub: 'Check the leaderboard for winners!' });
    }
  };

  return (
    <section style={{ minHeight: '100vh', padding: '100px 30px 50px', background: '#1a1a2e' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div className="section-tag">🎯 Monthly Challenges</div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: 15 }}>Creative Challenges</h2>
        <p style={{ color: '#888', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
          Join challenges, showcase your skills, and win amazing rewards!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 25, maxWidth: 1200, margin: '0 auto' }}>
        {challenges.map((c, i) => {
          const ss = statusStyle[c.status];
          return (
            <div
              key={i}
              className="eco-card eco-card-hover"
              style={{
                padding: 30, position: 'relative', overflow: 'hidden',
                borderColor: c.status === 'completed' ? 'rgba(155,89,182,0.3)' : 'rgba(46,204,113,0.2)',
              }}
              data-testid={`challenge-card-${i}`}
            >
              {/* Bottom line */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
                background: c.status === 'active'
                  ? 'linear-gradient(90deg, #2ecc71, #f39c12)'
                  : c.status === 'upcoming'
                    ? 'linear-gradient(90deg, #3498db, #9b59b6)'
                    : 'linear-gradient(90deg, #9b59b6, #7d3c98)',
              }} />

              <span style={{ display: 'inline-block', padding: '5px 15px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700, marginBottom: 15, background: ss.bg, color: ss.color }}>
                {ss.label}
              </span>

              <div style={{ fontSize: '3rem', marginBottom: 15 }}>{c.icon}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', marginBottom: 10 }}>{c.title}</div>
              <div style={{ color: '#888', lineHeight: 1.6, marginBottom: 20 }}>{c.desc}</div>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 15 }}>
                {c.rewards.map((r, j) => (
                  <span key={j} style={{
                    background: 'rgba(243,156,18,0.15)',
                    border: '1px solid rgba(243,156,18,0.3)',
                    color: '#f39c12',
                    padding: '5px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600,
                  }}>
                    {r}
                  </span>
                ))}
              </div>

              <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: c.participants ? 10 : 15 }}>
                {c.timer}
              </div>

              {c.participants && (
                <div style={{ marginBottom: 15 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888', marginBottom: 6 }}>
                    <span>👥 {c.participants.count}</span>
                    <span>{c.participants.pct}%</span>
                  </div>
                  <div className="xp-bar-track">
                    <div style={{
                      height: '100%',
                      width: `${c.participants.pct}%`,
                      background: c.participants.barColor || 'linear-gradient(90deg, #2ecc71, #f39c12)',
                      borderRadius: 10, transition: 'width 1s ease',
                    }} />
                  </div>
                </div>
              )}

              <button
                onClick={() => joinChallenge(c.title, c.status)}
                data-testid={`challenge-btn-${i}`}
                style={{
                  width: '100%', padding: 12, borderRadius: 12, border: 'none',
                  background: c.btnColor || 'linear-gradient(135deg, #2ecc71, #27ae60)',
                  color: 'white', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s',
                  marginTop: 5,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 5px 15px rgba(46,204,113,0.4)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                {c.btnLabel}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

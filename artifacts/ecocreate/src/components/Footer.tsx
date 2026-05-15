import { useApp, Section } from '@/context/AppContext';

export default function Footer() {
  const { showSection } = useApp();

  const nav = (s: Section) => (e: React.MouseEvent) => { e.preventDefault(); showSection(s); };

  return (
    <footer style={{ background: '#16213e', padding: '50px 30px 30px', borderTop: '1px solid rgba(46,204,113,0.2)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, maxWidth: 1200, margin: '0 auto 40px' }}>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2ecc71', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15 }}>
            ♻️ Eco<span style={{ color: '#f39c12' }}>Create</span>
          </div>
          <p style={{ color: '#888', lineHeight: 1.7, fontSize: '0.9rem' }}>
            Empowering individuals to make a positive environmental impact through creativity, education, and community. Together we can build a greener future.
          </p>
          <div style={{ display: 'flex', gap: 15, marginTop: 20 }}>
            {['🐦', '📘', '📸', '▶️'].map((icon, i) => (
              <span
                key={i}
                style={{ fontSize: '1.5rem', cursor: 'pointer', transition: 'transform 0.3s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.3)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                data-testid={`social-icon-${i}`}
              >
                {icon}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 15 }}>🌐 Platform</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Waste Converter', section: 'converter' as Section },
              { label: 'Challenges', section: 'challenges' as Section },
              { label: 'Leaderboard', section: 'leaderboard' as Section },
              { label: 'Eco Quiz', section: 'quiz' as Section },
            ].map(item => (
              <li key={item.section}>
                <a href="#" onClick={nav(item.section)} style={{ color: '#888', textDecoration: 'none', transition: 'color 0.3s', fontSize: '0.9rem' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#2ecc71'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#888'; }}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 15 }}>👥 Community</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Forums', 'Blog', 'Events', 'Partners'].map(item => (
              <li key={item}>
                <a href="#" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.3s', fontSize: '0.9rem' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#2ecc71'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#888'; }}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 15 }}>ℹ️ About</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Our Mission', 'Team', 'Privacy Policy', 'Contact Us'].map(item => (
              <li key={item}>
                <a href="#" style={{ color: '#888', textDecoration: 'none', transition: 'color 0.3s', fontSize: '0.9rem' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#2ecc71'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#888'; }}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ textAlign: 'center', color: '#555', fontSize: '0.9rem', paddingTop: 30, borderTop: '1px solid rgba(255,255,255,0.05)', maxWidth: 1200, margin: '0 auto' }}>
        🌍 © 2025 EcoCreate. Made with 💚 for a greener planet. All rights reserved.
      </div>
    </footer>
  );
}

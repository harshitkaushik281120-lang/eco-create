import { useState } from 'react';
import { useApp, Section } from '@/context/AppContext';

const navItems: { label: string; section: Section; icon: string }[] = [
  { label: 'Home', section: 'home', icon: '🏠' },
  { label: 'Converter', section: 'converter', icon: '🔄' },
  { label: 'Dashboard', section: 'dashboard', icon: '📊' },
  { label: 'Leaderboard', section: 'leaderboard', icon: '🏆' },
  { label: 'Quiz', section: 'quiz', icon: '🧠' },
  { label: 'Challenges', section: 'challenges', icon: '🎯' },
];

export default function Navbar() {
  const { currentSection, showSection } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (s: Section) => {
    showSection(s);
    setMenuOpen(false);
  };

  return (
    <nav
      style={{
        position: 'fixed', top: 0, width: '100%',
        background: 'rgba(26,26,46,0.95)',
        backdropFilter: 'blur(10px)',
        padding: '15px 30px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 1000,
        borderBottom: '2px solid #2ecc71',
      }}
    >
      <div
        style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2ecc71', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        onClick={() => handleNav('home')}
        data-testid="logo"
      >
        ♻️ Eco<span style={{ color: '#f39c12' }}>Create</span>
      </div>

      {/* Desktop nav */}
      <ul style={{ display: 'flex', gap: 20, listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}
        className="hidden md:flex">
        {navItems.map(item => (
          <li key={item.section}>
            <button
              data-testid={`nav-${item.section}`}
              onClick={() => handleNav(item.section)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: currentSection === item.section ? '#2ecc71' : '#e0e0e0',
                fontWeight: currentSection === item.section ? 700 : 500,
                fontSize: '0.95rem',
                transition: 'color 0.3s',
                padding: '4px 2px',
              }}
            >
              {item.icon} {item.label}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => handleNav('converter')}
            className="eco-btn-primary"
            style={{ padding: '8px 20px', fontSize: '0.9rem' }}
            data-testid="nav-start-creating"
          >
            Start Creating
          </button>
        </li>
      </ul>

      {/* Hamburger */}
      <button
        className="md:hidden"
        onClick={() => setMenuOpen(m => !m)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5 }}
        data-testid="hamburger-menu"
      >
        {[0,1,2].map(i => (
          <span key={i} style={{ width: 25, height: 3, background: '#2ecc71', borderRadius: 3, display: 'block', transition: '0.3s' }} />
        ))}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 70, left: 0, right: 0,
          background: '#16213e',
          padding: 20,
          display: 'flex', flexDirection: 'column', gap: 12,
          borderBottom: '2px solid #2ecc71',
          zIndex: 999,
        }}>
          {navItems.map(item => (
            <button
              key={item.section}
              onClick={() => handleNav(item.section)}
              data-testid={`mobile-nav-${item.section}`}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: currentSection === item.section ? '#2ecc71' : '#e0e0e0',
                fontWeight: 500, fontSize: '1rem', textAlign: 'left', padding: '6px 0',
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

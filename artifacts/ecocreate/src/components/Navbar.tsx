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
  const { currentSection, showSection, currentUser, userPoints, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (s: Section) => {
    showSection(s);
    setMenuOpen(false);
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, width: '100%',
      background: 'rgba(26,26,46,0.97)',
      backdropFilter: 'blur(12px)',
      padding: '12px 24px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      zIndex: 1000,
      borderBottom: '2px solid #2ecc71',
      boxSizing: 'border-box',
    }}>
      {/* Logo */}
      <div
        style={{ fontSize: '1.7rem', fontWeight: 800, color: '#2ecc71', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flexShrink: 0 }}
        onClick={() => handleNav('home')}
        data-testid="logo"
      >
        ♻️ Eco<span style={{ color: '#f39c12' }}>Create</span>
      </div>

      {/* Desktop nav */}
      <ul style={{ display: 'flex', gap: 16, listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}
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
                fontSize: '0.9rem', transition: 'color 0.3s', padding: '4px 2px',
              }}
            >
              {item.icon} {item.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Right: user pill + logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {currentUser && (
          <>
            {/* User pill */}
            <div
              onClick={() => handleNav('dashboard')}
              data-testid="user-pill"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(46,204,113,0.12)',
                border: '1px solid rgba(46,204,113,0.35)',
                borderRadius: 30, padding: '5px 12px',
                cursor: 'pointer', transition: 'background 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(46,204,113,0.22)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(46,204,113,0.12)'; }}
            >
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: 'linear-gradient(135deg, #2ecc71, #f39c12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 800, color: 'white',
              }}>
                {currentUser.username.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>
                  {currentUser.username.length > 14 ? currentUser.username.slice(0, 14) + '…' : currentUser.username}
                </span>
                <span style={{ color: '#2ecc71', fontSize: '0.7rem', fontWeight: 600 }}>
                  ⭐ {userPoints.toLocaleString()} pts
                </span>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              data-testid="logout-btn"
              style={{
                background: 'rgba(231,76,60,0.12)',
                border: '1px solid rgba(231,76,60,0.3)',
                borderRadius: 20, padding: '6px 12px',
                color: '#e74c3c', fontWeight: 600, fontSize: '0.8rem',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(231,76,60,0.25)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(231,76,60,0.12)'; }}
              title="Log out"
            >
              🚪 Logout
            </button>
          </>
        )}

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(m => !m)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5 }}
          data-testid="hamburger-menu"
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{ width: 24, height: 3, background: '#2ecc71', borderRadius: 3, display: 'block' }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 68, left: 0, right: 0,
          background: '#16213e', padding: '16px 24px',
          display: 'flex', flexDirection: 'column', gap: 12,
          borderBottom: '2px solid #2ecc71', zIndex: 999,
        }}>
          {currentUser && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 4,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #2ecc71, #f39c12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, color: 'white', fontSize: '0.9rem',
              }}>
                {currentUser.username.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 700 }}>{currentUser.username}</div>
                <div style={{ color: '#2ecc71', fontSize: '0.8rem' }}>⭐ {userPoints.toLocaleString()} pts</div>
              </div>
            </div>
          )}
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
          <button
            onClick={() => { logout(); setMenuOpen(false); }}
            style={{
              background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)',
              borderRadius: 12, padding: '10px', color: '#e74c3c',
              fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', marginTop: 4,
            }}
          >
            🚪 Log Out
          </button>
        </div>
      )}
    </nav>
  );
}

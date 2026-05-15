import { useState, useEffect, useCallback } from 'react';
import { ecoFacts } from '@/data/ecoFacts';

const INTERVAL_MS = 45_000; // show a fact every 45 seconds
const DISMISS_AFTER = 12_000; // auto-dismiss after 12 seconds

export default function EcoFactPopup() {
  const [visible, setVisible] = useState(false);
  const [factIdx, setFactIdx] = useState(0);
  const [exiting, setExiting] = useState(false);

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => { setVisible(false); setExiting(false); }, 400);
  }, []);

  useEffect(() => {
    // Show first fact after 20s, then every INTERVAL_MS
    const initial = setTimeout(() => {
      setFactIdx(Math.floor(Math.random() * ecoFacts.length));
      setVisible(true);
    }, 20_000);

    const interval = setInterval(() => {
      setFactIdx(prev => {
        let next = prev;
        while (next === prev) next = Math.floor(Math.random() * ecoFacts.length);
        return next;
      });
      setVisible(true);
      setExiting(false);
    }, INTERVAL_MS);

    return () => { clearTimeout(initial); clearInterval(interval); };
  }, []);

  // Auto-dismiss
  useEffect(() => {
    if (!visible || exiting) return;
    const t = setTimeout(() => dismiss(), DISMISS_AFTER);
    return () => clearTimeout(t);
  }, [visible, factIdx, exiting, dismiss]);

  if (!visible) return null;

  const { icon, fact } = ecoFacts[factIdx];

  return (
    <div
      data-testid="eco-fact-popup"
      style={{
        position: 'fixed', bottom: 30, left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1800,
        animation: exiting
          ? 'slideDownOut 0.4s ease forwards'
          : 'slideUpIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        width: 'min(520px, 90vw)',
      }}
    >
      <style>{`
        @keyframes slideUpIn {
          from { transform: translateX(-50%) translateY(100px); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0);    opacity: 1; }
        }
        @keyframes slideDownOut {
          from { transform: translateX(-50%) translateY(0);    opacity: 1; }
          to   { transform: translateX(-50%) translateY(100px); opacity: 0; }
        }
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>

      <div style={{
        background: 'linear-gradient(135deg, #0a2a18, #0f3460)',
        border: '1px solid rgba(46,204,113,0.4)',
        borderRadius: 20,
        padding: '20px 24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(46,204,113,0.1)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Animated progress bar at top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'rgba(46,204,113,0.15)', borderRadius: '20px 20px 0 0' }}>
          <div style={{
            height: '100%', background: 'linear-gradient(90deg, #2ecc71, #f39c12)',
            borderRadius: '20px 20px 0 0',
            animation: `shrink ${DISMISS_AFTER}ms linear forwards`,
          }} />
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{
            fontSize: '2.2rem', flexShrink: 0,
            background: 'rgba(46,204,113,0.15)',
            border: '1px solid rgba(46,204,113,0.3)',
            borderRadius: 14, width: 52, height: 52,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#2ecc71', fontWeight: 700, fontSize: '0.78rem', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
              🌍 Eco Fact
            </div>
            <div style={{ color: '#e0e0e0', lineHeight: 1.65, fontSize: '0.95rem' }}>
              {fact}
            </div>
          </div>
          <button
            onClick={dismiss}
            data-testid="eco-fact-dismiss"
            style={{
              background: 'none', border: 'none', color: '#555', fontSize: '1.1rem',
              cursor: 'pointer', padding: 0, flexShrink: 0, lineHeight: 1,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#e74c3c'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#555'; }}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

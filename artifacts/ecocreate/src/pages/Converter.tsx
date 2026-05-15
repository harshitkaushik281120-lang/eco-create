import { useState } from 'react';
import { wasteDatabase, wasteTags, defaultSuggestions, WasteSuggestion } from '@/data/wasteDatabase';
import { useApp } from '@/context/AppContext';

export default function Converter() {
  const { addPoints, showNotification } = useApp();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customWaste, setCustomWaste] = useState('');
  const [suggestions, setSuggestions] = useState<(WasteSuggestion & { material: string })[]>([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const toggleWaste = (tag: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  };

  const getSuggestions = () => {
    const wastes = [...selected];
    if (customWaste.trim()) wastes.push(customWaste.trim());
    if (wastes.length === 0) {
      showNotification({ icon: '👆', text: 'Select a material!', sub: 'Pick at least one waste type' });
      return;
    }
    setLoading(true);
    setGenerated(false);
    setTimeout(() => {
      let all: (WasteSuggestion & { material: string })[] = [];
      wastes.forEach(waste => {
        const key = Object.keys(wasteDatabase).find(k =>
          k.toLowerCase().includes(waste.toLowerCase().replace(/[^\w\s]/g, '').trim()) ||
          waste.toLowerCase().includes(k.toLowerCase().replace(/[^\w\s]/g, '').trim())
        );
        if (key && wasteDatabase[key]) {
          wasteDatabase[key].forEach(s => all.push({ ...s, material: waste }));
        }
      });
      if (all.length === 0) {
        all = defaultSuggestions.map(s => ({ ...s, material: wastes[0] || 'Custom' }));
      }
      setSuggestions(all);
      setLoading(false);
      setGenerated(true);
    }, 1200);
  };

  const selectSuggestion = (name: string, points: number) => {
    addPoints(points);
    showNotification({ icon: '🎉', text: `"${name}" selected!`, sub: `+${points} points added to your account` });
  };

  const diffColor: Record<string, string> = {
    easy: '#2ecc71',
    medium: '#f39c12',
    hard: '#e74c3c',
  };
  const diffBg: Record<string, string> = {
    easy: 'rgba(46,204,113,0.2)',
    medium: 'rgba(243,156,18,0.2)',
    hard: 'rgba(231,76,60,0.2)',
  };

  return (
    <section style={{ minHeight: '100vh', padding: '100px 30px 50px', background: '#1a1a2e' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="section-tag">🔄 Waste Converter</div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: 15 }}>What Can You Create?</h2>
          <p style={{ color: '#888', fontSize: '1.1rem' }}>Select your waste materials and discover amazing products you can make!</p>
        </div>

        {/* Material Selector */}
        <div className="eco-card" style={{ padding: 30, marginBottom: 30 }}>
          <label style={{ display: 'block', fontWeight: 600, color: '#2ecc71', marginBottom: 10 }}>
            📦 Select Waste Materials:
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
            {wasteTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleWaste(tag)}
                data-testid={`waste-tag-${tag}`}
                style={{
                  background: selected.has(tag) ? '#2ecc71' : 'rgba(46,204,113,0.15)',
                  border: '1px solid #2ecc71',
                  color: selected.has(tag) ? 'white' : '#2ecc71',
                  padding: '8px 18px',
                  borderRadius: 20,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s',
                  fontWeight: selected.has(tag) ? 600 : 400,
                }}
              >
                {tag}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={customWaste}
            onChange={e => setCustomWaste(e.target.value)}
            placeholder="Or type your own material (e.g., rubber tires, coffee grounds...)"
            data-testid="custom-waste-input"
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(46,204,113,0.3)',
              color: 'white',
              padding: '15px',
              borderRadius: 12,
              fontSize: '1rem',
              outline: 'none',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#2ecc71'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(46,204,113,0.1)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(46,204,113,0.3)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            className="eco-btn-primary"
            onClick={getSuggestions}
            disabled={loading}
            data-testid="generate-ideas-btn"
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', width: 20, height: 20, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Generating Ideas...
              </>
            ) : '✨ Generate Ideas'}
          </button>
        </div>

        {/* Empty state */}
        {!generated && !loading && (
          <div style={{ textAlign: 'center', padding: 30, color: '#888', background: 'rgba(15,52,96,0.4)', borderRadius: 15, border: '1px dashed rgba(46,204,113,0.3)', marginTop: 30 }}>
            <div style={{ fontSize: '3rem', marginBottom: 10 }}>♻️</div>
            <p>Select materials above and click Generate Ideas to discover what you can create!</p>
          </div>
        )}

        {/* Suggestions Grid */}
        {generated && suggestions.length > 0 && (
          <div style={{ marginTop: 30 }}>
            <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.3rem', marginBottom: 20 }}>
              ✨ {suggestions.length} Creative Ideas Found!
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="eco-card eco-card-hover"
                  style={{ padding: 25, cursor: 'pointer', animationDelay: `${i * 0.1}s` }}
                  onClick={() => selectSuggestion(s.name, s.points)}
                  data-testid={`suggestion-card-${i}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: 12,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: diffBg[s.difficulty],
                      color: diffColor[s.difficulty],
                    }}>
                      {s.difficulty.toUpperCase()}
                    </span>
                    <span style={{
                      background: 'linear-gradient(135deg, #f39c12, #e67e22)',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: 12,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}>
                      +{s.points} pts
                    </span>
                  </div>
                  <div style={{ fontSize: '2.5rem', margin: '12px 0' }}>{s.emoji}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: 8 }}>{s.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: 12, lineHeight: 1.6 }}>{s.desc}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>📦 {s.material}</span>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>⏱️ {s.time}</span>
                  </div>
                  <button
                    className="eco-btn-primary"
                    style={{ width: '100%', marginTop: 15, justifyContent: 'center', padding: '10px 20px', fontSize: '0.9rem' }}
                    onClick={e => { e.stopPropagation(); selectSuggestion(s.name, s.points); }}
                    data-testid={`select-suggestion-${i}`}
                  >
                    🚀 I'll Make This! (+{s.points} pts)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

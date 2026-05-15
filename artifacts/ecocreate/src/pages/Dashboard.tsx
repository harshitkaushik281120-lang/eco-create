import { useEffect, useRef, useState, useCallback } from 'react';
import { useApp, GalleryPhoto } from '@/context/AppContext';

const BADGE_DEFS = [
  { emoji: '🌱', tooltip: 'First Creation', threshold: (u: { creations: number; points: number; quizHistory: { score: number; total: number }[] }) => u.creations >= 1 },
  { emoji: '🧠', tooltip: 'Quiz Master', threshold: (u: { creations: number; points: number; quizHistory: { score: number; total: number }[] }) => u.quizHistory.some(q => q.score === q.total) },
  { emoji: '🏆', tooltip: '500 Points Club', threshold: (u: { creations: number; points: number; quizHistory: { score: number; total: number }[] }) => u.points >= 500 },
  { emoji: '💯', tooltip: '1000 Points Club', threshold: (u: { creations: number; points: number; quizHistory: { score: number; total: number }[] }) => u.points >= 1000 },
  { emoji: '♻️', tooltip: '5 Creations', threshold: (u: { creations: number; points: number; quizHistory: { score: number; total: number }[] }) => u.creations >= 5 },
  { emoji: '⭐', tooltip: '3 Quizzes Taken', threshold: (u: { creations: number; points: number; quizHistory: { score: number; total: number }[] }) => u.quizHistory.length >= 3 },
  { emoji: '🌿', tooltip: '2000 Points', threshold: (u: { creations: number; points: number; quizHistory: { score: number; total: number }[] }) => u.points >= 2000 },
  { emoji: '📸', tooltip: '3 Photos Uploaded', threshold: (u: { creations: number; points: number; quizHistory: { score: number; total: number }[] }) => u.creations >= 3 },
  { emoji: '🔒', tooltip: 'Locked: 50 Creations', threshold: (u: { creations: number; points: number; quizHistory: { score: number; total: number }[] }) => u.creations >= 50 },
  { emoji: '🔒', tooltip: 'Locked: 5000 Points', threshold: (u: { creations: number; points: number; quizHistory: { score: number; total: number }[] }) => u.points >= 5000 },
];

const SEED_GALLERY = [
  { emoji: '🌸', bg: 'linear-gradient(135deg,#1a4a2e,#0a2a1e)', caption: 'Bottle Planter' },
  { emoji: '🎨', bg: 'linear-gradient(135deg,#2a1a4e,#1a0a2e)', caption: 'Paper Mosaic' },
  { emoji: '🏺', bg: 'linear-gradient(135deg,#4e2a1a,#2e1a0a)', caption: 'Tin Vase' },
  { emoji: '🎭', bg: 'linear-gradient(135deg,#1a4a4e,#0a2a2e)', caption: 'Upcycled Art' },
  { emoji: '🌿', bg: 'linear-gradient(135deg,#4e4a1a,#2e2a0a)', caption: 'Fabric Rug' },
];

export default function Dashboard() {
  const { currentUser, userPoints, addPoints, addToGallery, gallery, dailyTasks, completeTask, quizHistory, openModal, showNotification } = useApp();

  const [xpWidth, setXpWidth] = useState(0);
  const [animatedPoints, setAnimatedPoints] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pointsRef = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setXpWidth(Math.min(100, (userPoints % 1000) / 10)), 300);
    return () => clearTimeout(t);
  }, [userPoints]);

  useEffect(() => {
    const target = userPoints;
    const step = Math.max(1, Math.abs(target - pointsRef.current) / 60);
    let current = pointsRef.current;
    const timer = setInterval(() => {
      if (current < target) {
        current = Math.min(target, current + step);
      } else {
        current = Math.max(target, current - step);
      }
      setAnimatedPoints(Math.floor(current));
      if (current === target) clearInterval(timer);
    }, 16);
    pointsRef.current = target;
    return () => clearInterval(timer);
  }, [userPoints]);

  const processFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const images = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (images.length === 0) {
      showNotification({ icon: '⚠️', text: 'Invalid file', sub: 'Please upload a JPG, PNG, or image file.' });
      return;
    }
    setUploading(true);
    images.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = e => {
        const src = e.target?.result as string;
        const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const photo: GalleryPhoto = {
          type: 'upload', src,
          caption: file.name.replace(/\.[^/.]+$/, '') || 'My Creation',
          date,
        };
        addToGallery(photo);
        if (idx === 0) {
          addPoints(50);
          // Also complete the upload task if not done
          const uploadIdx = dailyTasks.findIndex(t => t.label === 'Upload a creation photo');
          if (uploadIdx !== -1 && !dailyTasks[uploadIdx].done) {
            completeTask(uploadIdx);
          }
        }
        if (idx === images.length - 1) {
          setUploading(false);
          showNotification({ icon: '📸', text: images.length === 1 ? 'Photo uploaded!' : `${images.length} photos uploaded!`, sub: '+50 XP added to your account!' });
        }
      };
      reader.readAsDataURL(file);
    });
  }, [addToGallery, addPoints, dailyTasks, completeTask, showNotification]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  if (!currentUser) return null;

  const level = Math.max(1, Math.floor(userPoints / 500) + 1);
  const levelTitle = ['Eco Newcomer', 'Green Sprout', 'Nature Keeper', 'Eco Warrior', 'Green Champion', 'Planet Guardian', 'Earth Hero'][Math.min(level - 1, 6)];
  const totalCreations = gallery.length + SEED_GALLERY.length;
  const earnedBadges = BADGE_DEFS.filter(b => b.threshold(currentUser));
  const lockedBadges = BADGE_DEFS.filter(b => !b.threshold(currentUser) && b.emoji === '🔒');
  const displayBadges = [
    ...BADGE_DEFS.filter(b => b.threshold(currentUser)),
    ...lockedBadges,
  ];

  const certBody = `
    <div style="text-align:center;padding:20px 0">
      <div style="font-size:5rem;margin-bottom:15px">🏅</div>
      <div style="font-size:0.85rem;color:#2ecc71;letter-spacing:3px;text-transform:uppercase;margin-bottom:10px">Certificate of Achievement</div>
      <div style="font-size:1.8rem;font-weight:800;color:white;margin-bottom:8px">${currentUser.username}</div>
      <div style="color:#888;margin-bottom:15px">${levelTitle} Level ${level} · ${totalCreations} Eco Creations · ${earnedBadges.length} Badges Earned</div>
      <div style="background:rgba(46,204,113,0.1);border:1px solid rgba(46,204,113,0.3);border-radius:12px;padding:15px;color:#2ecc71;font-size:0.95rem">
        This certificate recognizes outstanding commitment to environmental sustainability and creative upcycling.
      </div>
    </div>
  `;

  const bestQuiz = quizHistory.length > 0
    ? Math.max(...quizHistory.map(q => Math.round((q.score / q.total) * 100)))
    : null;

  return (
    <section style={{ minHeight: '100vh', padding: '100px 24px 50px', background: '#1a1a2e' }}>
      <input
        ref={fileInputRef} type="file" accept="image/*" multiple
        onChange={handleFileChange} style={{ display: 'none' }} data-testid="file-input"
      />

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
          zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out',
        }} data-testid="lightbox">
          <img src={lightbox} alt="creation" style={{ maxWidth: '90vw', maxHeight: '88vh', borderRadius: 16, boxShadow: '0 0 60px rgba(46,204,113,0.3)' }} />
          <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: 20, right: 28, background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'clamp(250px, 290px, 100%) 1fr', gap: 24, maxWidth: 1200, margin: '0 auto' }} className="dashboard-layout">
        <style>{`@media (max-width: 768px) { .dashboard-layout { grid-template-columns: 1fr !important; } }`}</style>

        {/* ── Left: Profile ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="eco-card" style={{ padding: 28, textAlign: 'center' }}>
            {/* Avatar */}
            <div style={{
              width: 90, height: 90, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2ecc71, #f39c12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', fontWeight: 900, color: 'white',
              margin: '0 auto 14px',
              border: '3px solid #2ecc71',
              boxShadow: '0 0 22px rgba(46,204,113,0.4)',
              letterSpacing: 1,
            }} data-testid="user-avatar">
              {currentUser.username.slice(0, 2).toUpperCase()}
            </div>

            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', marginBottom: 4 }} data-testid="user-name">
              {currentUser.username}
            </div>
            <div style={{ color: '#f39c12', fontWeight: 600, marginBottom: 18, fontSize: '0.9rem' }}>
              ⭐ Level {level} — {levelTitle}
            </div>

            {/* XP bar */}
            <div style={{ margin: '10px 0 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#888', marginBottom: 7 }}>
                <span>XP Progress</span>
                <span>{userPoints % 1000} / 1000</span>
              </div>
              <div className="xp-bar-track">
                <div className="xp-bar-fill" style={{ width: `${xpWidth}%` }} />
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                { num: animatedPoints.toLocaleString(), label: 'Total Points', testId: 'user-points' },
                { num: String(totalCreations), label: 'Creations' },
                { num: String(earnedBadges.length), label: 'Badges' },
                { num: quizHistory.length > 0 ? `${bestQuiz}%` : '–', label: 'Best Quiz' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 12 }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2ecc71' }} data-testid={s.testId}>{s.num}</div>
                  <div style={{ fontSize: '0.72rem', color: '#888' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div style={{ textAlign: 'left', marginBottom: 18 }}>
              <div style={{ fontWeight: 700, color: 'white', marginBottom: 10, fontSize: '0.9rem' }}>🎖️ Your Badges</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center' }}>
                {displayBadges.map((b, i) => {
                  const earned = b.threshold(currentUser);
                  return (
                    <div
                      key={i}
                      className="tooltip-container"
                      style={{ fontSize: '1.7rem', cursor: 'pointer', transition: 'transform 0.3s', filter: !earned ? 'grayscale(1) opacity(0.3)' : undefined }}
                      onMouseEnter={e => { if (earned) (e.currentTarget as HTMLElement).style.transform = 'scale(1.3)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                      data-testid={`badge-${i}`}
                    >
                      {b.emoji}
                      <div className="tooltip-text">{earned ? b.tooltip : b.tooltip}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              className="eco-btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => openModal('🌿 Green Certificate', certBody)}
              data-testid="view-certificate-btn"
            >📜 View Certificate</button>
          </div>

          {/* Mini certificate preview */}
          <div className="certificate-card">
            <div style={{ fontSize: '0.8rem', color: '#2ecc71', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>🌿 Certificate</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', marginBottom: 4 }}>{currentUser.username}</div>
            <div style={{ color: '#888', fontSize: '0.85rem' }}>{levelTitle} Level {level}<br />{totalCreations} Creations · {earnedBadges.length} Badges</div>
            <div style={{ marginTop: 14, color: '#2ecc71', fontSize: '1.8rem' }}>🥇</div>
          </div>

          {/* Quiz history */}
          {quizHistory.length > 0 && (
            <div className="eco-card" style={{ padding: 20 }}>
              <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 14, fontSize: '0.95rem' }}>📝 Quiz History</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {quizHistory.slice(0, 5).map((q, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                    <span style={{ color: '#888' }}>{q.date}</span>
                    <span style={{ color: q.score === q.total ? '#2ecc71' : '#f39c12', fontWeight: 700 }}>
                      {q.score}/{q.total} ({Math.round((q.score / q.total) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Upload card */}
          <div className="eco-card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.15rem', margin: 0 }}>📸 Share Your Creation</h3>
              <span style={{ fontSize: '0.78rem', color: '#888' }}>+50 XP per upload</span>
            </div>

            {/* Drop zone */}
            <div
              onClick={openFilePicker}
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              data-testid="upload-area"
              style={{
                border: `2px dashed ${dragging ? '#2ecc71' : 'rgba(46,204,113,0.35)'}`,
                background: dragging ? 'rgba(46,204,113,0.08)' : 'transparent',
                borderRadius: 14, padding: '30px 16px', textAlign: 'center',
                cursor: 'pointer', transition: 'all 0.3s',
              }}
              onMouseEnter={e => { if (!dragging) { (e.currentTarget as HTMLElement).style.borderColor = '#2ecc71'; (e.currentTarget as HTMLElement).style.background = 'rgba(46,204,113,0.05)'; } }}
              onMouseLeave={e => { if (!dragging) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(46,204,113,0.35)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; } }}
            >
              {uploading ? (
                <>
                  <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>⏳</div>
                  <p style={{ color: '#2ecc71', fontWeight: 600, margin: 0 }}>Processing your photo…</p>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '2.8rem', marginBottom: 8 }}>📤</div>
                  <p style={{ color: 'white', fontWeight: 700, marginBottom: 5, fontSize: '1rem' }}>Tap to open your gallery</p>
                  <p style={{ color: '#888', fontSize: '0.82rem', margin: 0 }}>Or drag & drop · JPG, PNG, WEBP up to 10 MB</p>
                </>
              )}
            </div>

            <button
              className="eco-btn-primary"
              onClick={openFilePicker}
              style={{ width: '100%', justifyContent: 'center', marginTop: 12, padding: '12px 20px' }}
              data-testid="choose-photo-btn"
            >
              📷 Choose Photo from Gallery
            </button>

            {/* Gallery */}
            <div style={{ marginTop: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h4 style={{ color: 'white', margin: 0, fontSize: '0.95rem' }}>🖼️ Your Gallery</h4>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>{totalCreations} creations</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
                {/* Real uploaded photos */}
                {gallery.map((g, i) => (
                  <div
                    key={`upload-${i}`}
                    onClick={() => setLightbox(g.src)}
                    data-testid={`gallery-upload-${i}`}
                    style={{
                      aspectRatio: '1', borderRadius: 10, overflow: 'hidden',
                      cursor: 'zoom-in', position: 'relative',
                      border: '2px solid rgba(46,204,113,0.45)',
                    }}
                  >
                    <img src={g.src} alt={g.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                    />
                    <div style={{
                      position: 'absolute', top: 5, right: 5,
                      background: '#2ecc71', color: 'white',
                      fontSize: '0.6rem', fontWeight: 700,
                      padding: '2px 6px', borderRadius: 6,
                    }}>NEW</div>
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
                      color: 'white', fontSize: '0.65rem', padding: '10px 5px 5px',
                      textAlign: 'center', fontWeight: 600,
                    }}>
                      {g.caption.length > 12 ? g.caption.slice(0, 12) + '…' : g.caption}
                    </div>
                  </div>
                ))}

                {/* Seed items */}
                {SEED_GALLERY.map((g, i) => (
                  <div key={`seed-${i}`} style={{ aspectRatio: '1', borderRadius: 10, overflow: 'hidden' }} data-testid={`gallery-item-${i}`}>
                    <div style={{
                      width: '100%', height: '100%', background: g.bg,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: 4, transition: 'transform 0.3s',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}>
                      <span style={{ fontSize: '1.8rem' }}>{g.emoji}</span>
                      <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '0 4px' }}>{g.caption}</span>
                    </div>
                  </div>
                ))}

                {/* Add more */}
                <div
                  onClick={openFilePicker}
                  data-testid="gallery-add-btn"
                  style={{
                    aspectRatio: '1', borderRadius: 10,
                    border: '2px dashed rgba(46,204,113,0.3)',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 4, color: '#555', transition: 'all 0.3s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2ecc71'; (e.currentTarget as HTMLElement).style.color = '#2ecc71'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(46,204,113,0.3)'; (e.currentTarget as HTMLElement).style.color = '#555'; }}
                >
                  <span style={{ fontSize: '1.6rem' }}>➕</span>
                  <span style={{ fontSize: '0.62rem', fontWeight: 600 }}>Add</span>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Tasks */}
          <div className="eco-card" style={{ padding: 24 }}>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', marginBottom: 18 }}>✅ Daily Tasks</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {dailyTasks.map((t, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (t.done) return;
                    if (t.label === 'Upload a creation photo') { openFilePicker(); }
                    else { completeTask(i); }
                  }}
                  data-testid={`task-item-${i}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: t.done ? 'default' : 'pointer' }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    border: `2px solid ${t.done ? '#2ecc71' : 'rgba(255,255,255,0.2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: t.done ? '#2ecc71' : 'transparent',
                    background: t.done ? 'rgba(46,204,113,0.15)' : 'transparent',
                    fontSize: '0.82rem', fontWeight: 700, flexShrink: 0, transition: 'all 0.3s',
                  }}>
                    {t.done ? '✓' : ''}
                  </div>
                  <span style={{ color: t.done ? '#aaa' : '#e0e0e0', textDecoration: t.done ? 'line-through' : 'none', flex: 1, fontSize: '0.92rem' }}>
                    {t.label}
                    {t.label === 'Upload a creation photo' && !t.done && (
                      <span style={{ marginLeft: 8, fontSize: '0.72rem', color: '#2ecc71', fontWeight: 600 }}>← tap to upload</span>
                    )}
                  </span>
                  <span style={{ color: '#2ecc71', fontWeight: 700, fontSize: '0.88rem', flexShrink: 0 }}>+{t.pts}pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', marginBottom: 14 }}>🎯 Recent Achievements</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
              {[
                { icon: '🔥', name: 'Active Creator', desc: `${totalCreations} eco creations made` },
                { icon: '♻️', name: 'Point Collector', desc: `${userPoints.toLocaleString()} total XP earned` },
                { icon: '🧠', name: 'Quiz Taker', desc: quizHistory.length > 0 ? `${quizHistory.length} quiz${quizHistory.length === 1 ? '' : 'zes'} completed` : 'Take your first quiz!' },
                { icon: '👑', name: 'Badge Hunter', desc: `${earnedBadges.length} of ${BADGE_DEFS.length} badges earned` },
              ].map((a, i) => (
                <div
                  key={i}
                  className="eco-card"
                  style={{ padding: 18, textAlign: 'center', transition: 'all 0.3s', cursor: 'default' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#f39c12'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(46,204,113,0.2)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                  data-testid={`achievement-card-${i}`}
                >
                  <div style={{ fontSize: '2.2rem', marginBottom: 8 }}>{a.icon}</div>
                  <div style={{ fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>{a.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#888', marginTop: 4 }}>{a.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

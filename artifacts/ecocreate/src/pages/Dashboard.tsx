import { useEffect, useRef, useState, useCallback } from 'react';
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

const seedGallery = [
  { type: 'seed' as const, emoji: '🌸', bg: 'linear-gradient(135deg,#1a4a2e,#0a2a1e)', caption: 'Bottle Planter' },
  { type: 'seed' as const, emoji: '🎨', bg: 'linear-gradient(135deg,#2a1a4e,#1a0a2e)', caption: 'Paper Mosaic' },
  { type: 'seed' as const, emoji: '🏺', bg: 'linear-gradient(135deg,#4e2a1a,#2e1a0a)', caption: 'Tin Vase' },
  { type: 'seed' as const, emoji: '🎭', bg: 'linear-gradient(135deg,#1a4a4e,#0a2a2e)', caption: 'Upcycled Art' },
  { type: 'seed' as const, emoji: '🌿', bg: 'linear-gradient(135deg,#4e4a1a,#2e2a0a)', caption: 'Fabric Rug' },
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

interface UploadedPhoto {
  type: 'upload';
  src: string;
  caption: string;
  date: string;
}

type GalleryItem =
  | { type: 'seed'; emoji: string; bg: string; caption: string }
  | UploadedPhoto;

export default function Dashboard() {
  const { userPoints, addPoints, openModal, showNotification } = useApp();
  const [xpWidth, setXpWidth] = useState(0);
  const [animatedPoints, setAnimatedPoints] = useState(0);
  const [tasks, setTasks] = useState(initialTasks);
  const [gallery, setGallery] = useState<GalleryItem[]>(seedGallery);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pointsRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setXpWidth(78), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const target = userPoints;
    const step = Math.max(1, target / 60);
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

  const processFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const allowed = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (allowed.length === 0) {
      showNotification({ icon: '⚠️', text: 'Invalid file type', sub: 'Please upload an image file (JPG, PNG, etc.)' });
      return;
    }
    setUploading(true);

    allowed.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        const now = new Date();
        const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const photo: UploadedPhoto = {
          type: 'upload',
          src,
          caption: file.name.replace(/\.[^/.]+$/, '') || 'My Creation',
          date,
        };

        setGallery(prev => [photo, ...prev]);

        // Award points and mark task done on first file
        if (idx === 0) {
          addPoints(50);
          // Mark "Upload a creation photo" task as done
          setTasks(prev => {
            const updated = [...prev];
            const taskIdx = updated.findIndex(t => t.label === 'Upload a creation photo');
            if (taskIdx !== -1 && !updated[taskIdx].done) {
              updated[taskIdx] = { ...updated[taskIdx], done: true };
              // points already awarded via addPoints above, don't double-award task pts
            }
            return updated;
          });
        }

        if (idx === allowed.length - 1) {
          setUploading(false);
          showNotification({
            icon: '📸',
            text: allowed.length === 1 ? 'Photo uploaded!' : `${allowed.length} photos uploaded!`,
            sub: '+50 XP added to your account!',
          });
        }
      };
      reader.readAsDataURL(file);
    });
  }, [addPoints, showNotification]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset so the same file can be re-selected
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const certBody = `
    <div style="text-align:center;padding:20px 0">
      <div style="font-size:5rem;margin-bottom:15px">🏅</div>
      <div style="font-size:0.85rem;color:#2ecc71;letter-spacing:3px;text-transform:uppercase;margin-bottom:10px">Certificate of Achievement</div>
      <div style="font-size:1.8rem;font-weight:800;color:white;margin-bottom:8px">EcoWarrior_Alex</div>
      <div style="color:#888;margin-bottom:15px">Green Champion Level 7 · ${gallery.length} Eco Creations · 8 Badges Earned</div>
      <div style="background:rgba(46,204,113,0.1);border:1px solid rgba(46,204,113,0.3);border-radius:12px;padding:15px;color:#2ecc71;font-size:0.95rem">
        This certificate recognizes outstanding commitment to environmental sustainability and creative upcycling.
      </div>
    </div>
  `;

  return (
    <section style={{ minHeight: '100vh', padding: '100px 30px 50px', background: '#1a1a2e' }}>

      {/* Hidden file input — opens gallery/camera on mobile */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
        data-testid="file-input"
      />

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)',
            zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
          }}
          data-testid="lightbox"
        >
          <img src={lightbox} alt="creation" style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 16, boxShadow: '0 0 60px rgba(46,204,113,0.3)' }} />
          <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: 20, right: 30, background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      <div
        style={{ display: 'grid', gridTemplateColumns: 'clamp(260px, 300px, 100%) 1fr', gap: 25, maxWidth: 1200, margin: '0 auto' }}
        className="dashboard-layout"
      >
        <style>{`@media (max-width: 768px) { .dashboard-layout { grid-template-columns: 1fr !important; } }`}</style>

        {/* ── Left: Profile ── */}
        <div>
          <div className="eco-card" style={{ padding: 30, textAlign: 'center' }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2ecc71, #f39c12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', margin: '0 auto 15px',
              border: '3px solid #2ecc71',
              boxShadow: '0 0 20px rgba(46,204,113,0.4)',
            }} data-testid="user-avatar">🌱</div>

            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white', marginBottom: 5 }} data-testid="user-name">
              EcoWarrior_Alex
            </div>
            <div style={{ color: '#f39c12', fontWeight: 600, marginBottom: 20 }}>⭐ Level 7 - Green Champion</div>

            <div style={{ margin: '15px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#888', marginBottom: 8 }}>
                <span>XP Progress</span><span>2,340 / 3,000</span>
              </div>
              <div className="xp-bar-track">
                <div className="xp-bar-fill" style={{ width: `${xpWidth}%` }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '20px 0' }}>
              {[
                { num: animatedPoints.toLocaleString(), label: 'Total Points', testId: 'user-points' },
                { num: gallery.filter(g => g.type === 'upload').length + seedGallery.length, label: 'Creations' },
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
            >📜 View Certificate</button>
          </div>

          <div className="certificate-card" style={{ marginTop: 20 }}>
            <div style={{ fontSize: '0.85rem', color: '#2ecc71', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>🌿 Certificate of Achievement</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: 5 }}>EcoWarrior_Alex</div>
            <div style={{ color: '#888', fontSize: '0.9rem' }}>Green Champion Level 7<br />{gallery.length} Eco Creations · 8 Badges Earned</div>
            <div style={{ marginTop: 15, color: '#2ecc71', fontSize: '2rem' }}>🥇</div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>

          {/* Upload card */}
          <div className="eco-card" style={{ padding: 30 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
              <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem', margin: 0 }}>📸 Share Your Creation</h3>
              <span style={{ fontSize: '0.8rem', color: '#888' }}>+50 XP per upload</span>
            </div>

            {/* Drop zone */}
            <div
              onClick={openFilePicker}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={() => setDragging(false)}
              data-testid="upload-area"
              style={{
                border: `2px dashed ${dragging ? '#2ecc71' : 'rgba(46,204,113,0.4)'}`,
                background: dragging ? 'rgba(46,204,113,0.08)' : uploading ? 'rgba(46,204,113,0.04)' : 'transparent',
                borderRadius: 16, padding: '36px 20px', textAlign: 'center', cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => {
                if (!dragging) {
                  (e.currentTarget as HTMLElement).style.borderColor = '#2ecc71';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(46,204,113,0.05)';
                }
              }}
              onMouseLeave={e => {
                if (!dragging) {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(46,204,113,0.4)';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }
              }}
            >
              {uploading ? (
                <>
                  <div style={{ fontSize: '2.5rem', marginBottom: 10, animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</div>
                  <p style={{ color: '#2ecc71', fontWeight: 600 }}>Processing your photo…</p>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '3rem', marginBottom: 10 }}>📤</div>
                  <p style={{ color: 'white', fontWeight: 700, marginBottom: 6, fontSize: '1.05rem' }}>
                    Tap to open your gallery
                  </p>
                  <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: 12 }}>
                    Or drag & drop an image here
                  </p>
                  <span style={{
                    display: 'inline-block',
                    background: 'rgba(46,204,113,0.15)', color: '#2ecc71',
                    border: '1px solid rgba(46,204,113,0.3)',
                    borderRadius: 20, padding: '5px 16px', fontSize: '0.8rem', fontWeight: 600,
                  }}>
                    JPG · PNG · WEBP · GIF · up to 10 MB
                  </span>
                </>
              )}
            </div>

            {/* Upload button — prominent on mobile */}
            <button
              className="eco-btn-primary"
              onClick={openFilePicker}
              style={{ width: '100%', justifyContent: 'center', marginTop: 14, padding: '13px 20px' }}
              data-testid="choose-photo-btn"
            >
              📷 Choose Photo from Gallery
            </button>

            {/* Gallery grid */}
            <div style={{ marginTop: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h4 style={{ color: 'white', margin: 0 }}>🖼️ Your Gallery</h4>
                <span style={{ fontSize: '0.8rem', color: '#888' }}>{gallery.length} creations</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 12 }}>
                {gallery.map((g, i) => (
                  <div
                    key={i}
                    onClick={() => g.type === 'upload' ? setLightbox(g.src) : undefined}
                    data-testid={`gallery-item-${i}`}
                    style={{
                      aspectRatio: '1', borderRadius: 12, overflow: 'hidden',
                      cursor: g.type === 'upload' ? 'zoom-in' : 'default',
                      position: 'relative',
                      border: g.type === 'upload' ? '2px solid rgba(46,204,113,0.5)' : 'none',
                    }}
                  >
                    {g.type === 'upload' ? (
                      <>
                        <img
                          src={g.src}
                          alt={g.caption}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                        />
                        {/* NEW badge */}
                        <div style={{
                          position: 'absolute', top: 6, right: 6,
                          background: '#2ecc71', color: 'white',
                          fontSize: '0.65rem', fontWeight: 700,
                          padding: '2px 7px', borderRadius: 8,
                        }}>NEW</div>
                        {/* Caption on hover */}
                        <div style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
                          color: 'white', fontSize: '0.7rem', padding: '12px 6px 6px',
                          textAlign: 'center', fontWeight: 600,
                        }}>
                          {g.caption.length > 12 ? g.caption.slice(0, 12) + '…' : g.caption}
                        </div>
                      </>
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        background: g.bg,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        gap: 4, transition: 'transform 0.3s',
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                      >
                        <span style={{ fontSize: '2rem' }}>{g.emoji}</span>
                        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '0 4px' }}>{g.caption}</span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add more tile */}
                <div
                  onClick={openFilePicker}
                  data-testid="gallery-add-btn"
                  style={{
                    aspectRatio: '1', borderRadius: 12,
                    border: '2px dashed rgba(46,204,113,0.3)',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 4, color: '#555', transition: 'all 0.3s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2ecc71'; (e.currentTarget as HTMLElement).style.color = '#2ecc71'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(46,204,113,0.3)'; (e.currentTarget as HTMLElement).style.color = '#555'; }}
                >
                  <span style={{ fontSize: '1.8rem' }}>➕</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>Add</span>
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
                  onClick={() => {
                    if (t.label === 'Upload a creation photo' && !t.done) {
                      openFilePicker();
                    } else {
                      completeTask(i);
                    }
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
                    fontSize: '0.85rem', fontWeight: 700, flexShrink: 0,
                    transition: 'all 0.3s',
                  }}>
                    {t.done ? '✓' : ''}
                  </div>
                  <span style={{ color: t.done ? '#aaa' : '#e0e0e0', textDecoration: t.done ? 'line-through' : 'none', flex: 1, fontSize: '0.95rem' }}>
                    {t.label}
                    {t.label === 'Upload a creation photo' && !t.done && (
                      <span style={{ marginLeft: 8, fontSize: '0.75rem', color: '#2ecc71', fontWeight: 600 }}>← tap to upload</span>
                    )}
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

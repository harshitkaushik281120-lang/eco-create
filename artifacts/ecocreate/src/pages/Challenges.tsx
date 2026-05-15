import { useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';

interface ChallengeData {
  id: string;
  status: 'active' | 'upcoming' | 'completed';
  icon: string;
  title: string;
  desc: string;
  rewards: string[];
  timer: string;
  xpReward: number;
  badgeEmoji: string;
  participants?: { count: string; pct: number; barColor?: string };
  steps: { emoji: string; title: string; detail: string }[];
  materials: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeEst: string;
}

const CHALLENGES: ChallengeData[] = [
  {
    id: 'plastic-art',
    status: 'active',
    icon: '🎋',
    title: 'Plastic to Art Challenge',
    desc: 'Transform plastic bottles and containers into stunning artworks. Show us your creativity and win big rewards!',
    rewards: ['🏆 500 Points', '📜 Green Certificate', '⭐ Featured Creator'],
    timer: '⏰ 12 days remaining',
    xpReward: 500,
    badgeEmoji: '🎋',
    participants: { count: '1,234 participants', pct: 82 },
    difficulty: 'Medium',
    timeEst: '2–4 hours',
    materials: ['Plastic bottles', 'Scissors', 'Acrylic paint', 'Glue', 'Wire/string'],
    steps: [
      { emoji: '🗑️', title: 'Collect clean plastic', detail: 'Wash and dry plastic bottles, containers, or packaging. Remove labels. Aim to collect at least 5–10 pieces.' },
      { emoji: '✏️', title: 'Sketch your design', detail: 'Plan your artwork on paper first. Think vase, mosaic wall art, a sculpture, or a lamp shade. Any creative idea counts!' },
      { emoji: '✂️', title: 'Cut & shape', detail: 'Carefully cut the plastic into the shapes you need. Use scissors or a craft knife (with adult supervision). Shape petals, strips, or panels.' },
      { emoji: '🎨', title: 'Paint & decorate', detail: 'Apply acrylic paint, markers, or spray paint. Add glitter, natural materials, or fabric scraps for extra flair.' },
      { emoji: '🏗️', title: 'Assemble your creation', detail: 'Glue, wire, or tie the pieces together into your final artwork. Let dry completely before handling.' },
      { emoji: '📸', title: 'Photograph & submit', detail: 'Place your artwork in good natural lighting. Take a clear, well-lit photo that shows the full creation, then upload it below.' },
    ],
  },
  {
    id: 'paper-craft',
    status: 'active',
    icon: '📰',
    title: 'Paper Craft Marathon',
    desc: 'Use old newspapers and magazines to create functional household items. Origami, papier-mâché, anything goes!',
    rewards: ['🏆 350 Points', '🎖️ Paper Master Badge', '🌿 Eco Medal'],
    timer: '⏰ 8 days remaining',
    xpReward: 350,
    badgeEmoji: '📰',
    participants: { count: '892 participants', pct: 65, barColor: 'linear-gradient(90deg,#3498db,#9b59b6)' },
    difficulty: 'Easy',
    timeEst: '1–3 hours',
    materials: ['Old newspapers', 'Magazines', 'Flour & water (paste)', 'Balloon (for papier-mâché)', 'Paint'],
    steps: [
      { emoji: '📚', title: 'Gather old paper', detail: 'Collect newspapers, old magazines, printer paper, or cardboard. Sort by size and type.' },
      { emoji: '💧', title: 'Make your paste', detail: 'Mix 1 part flour with 2 parts water to make a smooth paste for papier-mâché, or simply fold and crease for origami.' },
      { emoji: '🏺', title: 'Build your item', detail: 'Try a papier-mâché bowl, a newspaper log basket, an origami organizer, or a magazine rack. Layer paper strips over a balloon or mold.' },
      { emoji: '⏳', title: 'Let it dry', detail: 'Apply 3–4 layers for strength, letting each layer dry for 2–3 hours. Full drying may take overnight.' },
      { emoji: '🎨', title: 'Decorate it', detail: 'Paint, collage with magazine cutouts, or varnish for a polished finish. Add handles, labels, or accessories.' },
      { emoji: '📸', title: 'Photograph & submit', detail: 'Show the finished item in use if possible — a bowl with fruit, a rack with magazines. Upload below!' },
    ],
  },
  {
    id: 'fashion-trash',
    status: 'upcoming',
    icon: '👕',
    title: 'Fashion from Trash',
    desc: 'Create wearable fashion items from discarded fabrics, old clothes, and textile waste. Be a sustainable fashion designer!',
    rewards: ['🏆 600 Points', '👑 Fashion Eco Award', '📱 App Feature'],
    timer: '📅 Starts in 5 days',
    xpReward: 600,
    badgeEmoji: '👑',
    difficulty: 'Hard',
    timeEst: '4–8 hours',
    materials: ['Old t-shirts', 'Discarded fabric scraps', 'Needle & thread', 'Safety pins', 'Fabric paint'],
    steps: [
      { emoji: '👀', title: 'Scout your wardrobe', detail: 'Find clothes you no longer wear — torn jeans, old t-shirts, mismatched socks, or fabric scraps from previous projects.' },
      { emoji: '📐', title: 'Design your look', detail: 'Sketch a wearable item: a tote bag from jeans, a patchwork jacket, a scarf from t-shirt strips, or a headband from socks.' },
      { emoji: '✂️', title: 'Cut & prepare', detail: 'Cut your fabrics according to your pattern. Iron pieces flat for easier stitching.' },
      { emoji: '🪡', title: 'Sew or bond', detail: 'Hand-stitch, machine-sew, or use fabric glue/iron-on bonds to join pieces. Safety pins work for no-sew designs!' },
      { emoji: '🌈', title: 'Add personality', detail: 'Embellish with fabric paint, embroidery, iron-on patches, or buttons from old shirts.' },
      { emoji: '📸', title: 'Wear it & submit', detail: 'Put it on (or display it prominently) and take a photo showing it off clearly. Upload it below to earn your reward!' },
    ],
  },
  {
    id: 'wood-garden',
    status: 'upcoming',
    icon: '🪵',
    title: 'Wood & Garden Magic',
    desc: 'Build garden furniture, planters, or decorations from wood scraps and reclaimed materials. Go green in your garden!',
    rewards: ['🏆 450 Points', '🌳 Nature Badge', '📜 Certificate'],
    timer: '📅 Starts in 12 days',
    xpReward: 450,
    badgeEmoji: '🌳',
    difficulty: 'Medium',
    timeEst: '3–6 hours',
    materials: ['Wood pallets/scraps', 'Hammer & nails', 'Sandpaper', 'Outdoor paint', 'Soil & seeds'],
    steps: [
      { emoji: '🌲', title: 'Source reclaimed wood', detail: 'Look for old pallets, scrap wood planks, broken furniture, or driftwood. Sand down rough edges.' },
      { emoji: '📏', title: 'Measure and plan', detail: 'Decide what you\'re building: a planter box, a birdhouse, a garden bench, or wall art. Mark measurements with pencil.' },
      { emoji: '🔨', title: 'Cut and assemble', detail: 'Saw pieces to size and nail or screw them together. Drill drainage holes in planters. Check for stability.' },
      { emoji: '🎨', title: 'Finish the surface', detail: 'Sand smooth, then apply outdoor paint, wood stain, or varnish to protect from weather.' },
      { emoji: '🌱', title: 'Add greenery', detail: 'Plant seeds, succulents, or herbs in your planter. Add soil, water, and place in sunlight.' },
      { emoji: '📸', title: 'Photograph & submit', detail: 'Take a photo of your finished piece in the garden or outdoor space. Upload it below for your XP reward!' },
    ],
  },
  {
    id: 'tin-can',
    status: 'completed',
    icon: '🥫',
    title: 'Tin Can Treasures',
    desc: "Last month's winner challenge! Participants transformed tin cans into beautiful planters, lanterns, and organizers.",
    rewards: ['🥇 Winner: GreenQueen', '👥 2,341 Joined'],
    timer: '✅ Ended 3 days ago',
    xpReward: 0,
    badgeEmoji: '🥫',
    difficulty: 'Easy',
    timeEst: '1–2 hours',
    materials: ['Tin cans', 'Paint', 'Nails', 'Candle/fairy lights'],
    steps: [
      { emoji: '🥫', title: 'Clean your cans', detail: 'Wash tin cans thoroughly. Remove labels. Smooth sharp edges with a file.' },
      { emoji: '🔩', title: 'Add texture', detail: 'Nail holes in a pattern for a lantern effect, or leave smooth for a planter.' },
      { emoji: '🎨', title: 'Paint & decorate', detail: 'Use spray paint or brush-on paint. Add patterns, polka dots, or geometric designs.' },
      { emoji: '🌿', title: 'Fill & use', detail: 'Add soil for plants, or insert a candle/fairy lights for a lantern. Use as a desk organizer too!' },
      { emoji: '📸', title: 'Photograph', detail: 'This challenge has ended, but you can still view results and get inspired for the next one.' },
      { emoji: '🏆', title: 'View results', detail: 'Check the leaderboard to see the top creators from this challenge.' },
    ],
  },
  {
    id: 'e-waste',
    status: 'active',
    icon: '🔋',
    title: 'E-Waste Innovation',
    desc: 'Safely repurpose electronic components into new functional devices or art installations. Tech meets sustainability!',
    rewards: ['🏆 750 Points', '💻 Tech Eco Badge', '🌟 Hall of Fame'],
    timer: '⏰ 20 days remaining',
    xpReward: 750,
    badgeEmoji: '💻',
    participants: { count: '456 participants', pct: 30, barColor: 'linear-gradient(90deg,#f39c12,#e74c3c)' },
    difficulty: 'Hard',
    timeEst: '4–10 hours',
    materials: ['Old circuit boards', 'Broken keyboards/mice', 'Old cables', 'Epoxy resin (optional)', 'LED lights'],
    steps: [
      { emoji: '⚠️', title: 'Safety first', detail: 'Wear gloves when handling circuit boards. Never dismantle batteries or CRT monitors. Work in a ventilated area.' },
      { emoji: '🔍', title: 'Sort components', detail: 'Separate circuit boards, keys, cables, chips, and screens. Identify which are safe to use creatively.' },
      { emoji: '🎨', title: 'Design your piece', detail: 'Ideas: a circuit board picture frame, keyboard clock, cable plant pot, LED lamp, or resin-cast jewelry.' },
      { emoji: '🔧', title: 'Build & assemble', detail: 'Glue, solder (if experienced), or embed components in resin. Wire up any LEDs with a small battery pack.' },
      { emoji: '✨', title: 'Finishing touches', detail: 'Sand resin pieces smooth. Add labels or a display stand. Test any electronic functions.' },
      { emoji: '📸', title: 'Photograph & submit', detail: 'Show your creation clearly — bonus points for showing it in use or lit up! Upload below to claim your 750 XP.' },
    ],
  },
];

const STATUS_STYLE = {
  active:    { bg: 'rgba(46,204,113,0.15)',  color: '#2ecc71', label: '🔴 Active Now' },
  upcoming:  { bg: 'rgba(52,152,219,0.15)',  color: '#3498db', label: '🔵 Coming Soon' },
  completed: { bg: 'rgba(155,89,182,0.15)', color: '#9b59b6', label: '✅ Completed' },
};

const DIFF_COLOR = { Easy: '#2ecc71', Medium: '#f39c12', Hard: '#e74c3c' };

// ── Detail Overlay ────────────────────────────────────────────────────────────
function ChallengeOverlay({
  challenge,
  onClose,
}: {
  challenge: ChallengeData;
  onClose: () => void;
}) {
  const { joinChallenge, joinedChallenges, challengePhotos, submitChallengePhoto, showNotification } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(!!challengePhotos[challenge.id]);
  const [activeStep, setActiveStep] = useState(0);

  const isJoined   = joinedChallenges.includes(challenge.id);
  const isActive   = challenge.status === 'active';
  const isCompleted = challenge.status === 'completed';
  const existingPhoto = challengePhotos[challenge.id];

  const handleJoin = () => {
    joinChallenge(challenge.id);
    showNotification({ icon: '🎯', text: `Joined "${challenge.title}"!`, sub: 'Follow the steps and upload your photo to earn XP!' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotification({ icon: '⚠️', text: 'Invalid file', sub: 'Please pick a JPG, PNG, or image file.' });
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = ev => {
      setPreviewSrc(ev.target?.result as string);
      setUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = () => {
    if (!previewSrc) return;
    submitChallengePhoto(challenge.id, previewSrc, challenge.xpReward);
    setSubmitted(true);
  };

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '20px 10px 0',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(60px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>

      <div style={{
        background: 'linear-gradient(180deg, #1a2744 0%, #16213e 100%)',
        border: '1px solid rgba(46,204,113,0.25)',
        borderRadius: '24px 24px 0 0',
        width: '100%', maxWidth: 700,
        maxHeight: '92vh', overflowY: 'auto',
        padding: '32px 28px 40px',
        animation: 'slideUp 0.35s cubic-bezier(0.175,0.885,0.32,1.1)',
        scrollbarWidth: 'thin',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              fontSize: '3rem', width: 68, height: 68, borderRadius: 18, flexShrink: 0,
              background: 'rgba(46,204,113,0.1)', border: '1px solid rgba(46,204,113,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{challenge.icon}</div>
            <div>
              <div style={{
                display: 'inline-block', padding: '3px 12px', borderRadius: 20,
                fontSize: '0.75rem', fontWeight: 700, marginBottom: 6,
                background: STATUS_STYLE[challenge.status].bg,
                color: STATUS_STYLE[challenge.status].color,
              }}>{STATUS_STYLE[challenge.status].label}</div>
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.3rem', margin: 0 }}>{challenge.title}</h2>
              <div style={{ display: 'flex', gap: 12, marginTop: 5, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', color: DIFF_COLOR[challenge.difficulty], fontWeight: 700 }}>
                  ● {challenge.difficulty}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#888' }}>⏱ {challenge.timeEst}</span>
                <span style={{ fontSize: '0.78rem', color: '#888' }}>{challenge.timer}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.07)', border: 'none', color: '#aaa',
            width: 36, height: 36, borderRadius: '50%', cursor: 'pointer',
            fontSize: '1.1rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(231,76,60,0.2)'; (e.currentTarget as HTMLElement).style.color = '#e74c3c'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.color = '#aaa'; }}
          >✕</button>
        </div>

        <p style={{ color: '#aaa', lineHeight: 1.65, marginBottom: 22, fontSize: '0.95rem' }}>{challenge.desc}</p>

        {/* Rewards */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {challenge.rewards.map((r, i) => (
            <span key={i} style={{
              background: 'rgba(243,156,18,0.12)', border: '1px solid rgba(243,156,18,0.3)',
              color: '#f39c12', padding: '5px 13px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600,
            }}>{r}</span>
          ))}
        </div>

        {/* Materials */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ color: '#2ecc71', fontWeight: 700, fontSize: '0.85rem', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
            🛠️ Materials Needed
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {challenge.materials.map((m, i) => (
              <span key={i} style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#ccc', padding: '5px 12px', borderRadius: 20, fontSize: '0.82rem',
              }}>{m}</span>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ color: '#2ecc71', fontWeight: 700, fontSize: '0.85rem', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
            📋 Step-by-Step Guide
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {challenge.steps.map((step, i) => {
              const isActive2 = activeStep === i;
              const isPast    = i < activeStep;
              return (
                <div
                  key={i}
                  onClick={() => setActiveStep(isActive2 ? -1 : i)}
                  style={{
                    borderRadius: 14, overflow: 'hidden',
                    border: `1px solid ${isActive2 ? 'rgba(46,204,113,0.4)' : 'rgba(255,255,255,0.07)'}`,
                    background: isActive2 ? 'rgba(46,204,113,0.06)' : 'rgba(255,255,255,0.02)',
                    transition: 'all 0.25s',
                    cursor: 'pointer',
                  }}
                >
                  {/* Step header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: isPast ? 'rgba(46,204,113,0.2)' : isActive2 ? 'rgba(46,204,113,0.15)' : 'rgba(255,255,255,0.06)',
                      border: `2px solid ${isPast || isActive2 ? '#2ecc71' : 'rgba(255,255,255,0.12)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: isPast ? '0.85rem' : '0.9rem', fontWeight: 800,
                      color: isPast || isActive2 ? '#2ecc71' : '#666',
                      transition: 'all 0.25s',
                    }}>
                      {isPast ? '✓' : i + 1}
                    </div>
                    <span style={{ fontSize: '1.1rem' }}>{step.emoji}</span>
                    <span style={{ color: isActive2 ? 'white' : '#ccc', fontWeight: isActive2 ? 700 : 500, flex: 1, fontSize: '0.95rem' }}>
                      {step.title}
                    </span>
                    <span style={{ color: '#555', fontSize: '0.8rem', transform: isActive2 ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                  </div>

                  {/* Expanded detail */}
                  {isActive2 && (
                    <div style={{ padding: '0 16px 14px 60px' }}>
                      <p style={{ color: '#aaa', lineHeight: 1.7, margin: 0, fontSize: '0.9rem' }}>{step.detail}</p>
                      {i < challenge.steps.length - 1 && (
                        <button
                          onClick={e => { e.stopPropagation(); setActiveStep(i + 1); }}
                          style={{
                            marginTop: 10, background: 'rgba(46,204,113,0.12)',
                            border: '1px solid rgba(46,204,113,0.3)',
                            color: '#2ecc71', borderRadius: 20,
                            padding: '5px 14px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600,
                          }}
                        >
                          Next Step →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Photo upload section — only for active challenges */}
        {isActive && (
          <div style={{
            background: 'rgba(46,204,113,0.05)',
            border: '1px solid rgba(46,204,113,0.25)',
            borderRadius: 18, padding: 24,
          }}>
            <div style={{ color: '#2ecc71', fontWeight: 700, fontSize: '0.85rem', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
              📸 Submit Your Creation
            </div>

            {submitted || existingPhoto ? (
              /* Already submitted */
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <img
                  src={existingPhoto || previewSrc || ''}
                  alt="Your submission"
                  style={{ maxWidth: '100%', maxHeight: 260, borderRadius: 14, objectFit: 'cover', marginBottom: 14, border: '2px solid #2ecc71' }}
                />
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎉</div>
                <p style={{ color: '#2ecc71', fontWeight: 800, fontSize: '1.1rem', marginBottom: 4 }}>Challenge Submitted!</p>
                <p style={{ color: '#888', fontSize: '0.88rem', margin: 0 }}>
                  You earned <strong style={{ color: '#f39c12' }}>+{challenge.xpReward} XP</strong> and the photo has been added to your gallery.
                </p>
              </div>
            ) : (
              <>
                <input
                  ref={fileRef} type="file" accept="image/*"
                  onChange={handleFileChange} style={{ display: 'none' }}
                />

                {/* Preview or drop zone */}
                {previewSrc ? (
                  <div style={{ position: 'relative', marginBottom: 14 }}>
                    <img
                      src={previewSrc} alt="preview"
                      style={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 14, border: '2px solid rgba(46,204,113,0.4)' }}
                    />
                    <button
                      onClick={() => setPreviewSrc(null)}
                      style={{
                        position: 'absolute', top: 8, right: 8,
                        background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white',
                        width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', fontSize: '0.8rem',
                      }}
                    >✕</button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileRef.current?.click()}
                    style={{
                      border: '2px dashed rgba(46,204,113,0.35)', borderRadius: 14,
                      padding: '28px 20px', textAlign: 'center', cursor: 'pointer',
                      transition: 'all 0.25s', marginBottom: 14,
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2ecc71'; (e.currentTarget as HTMLElement).style.background = 'rgba(46,204,113,0.07)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(46,204,113,0.35)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    {uploading ? (
                      <><div style={{ fontSize: '2rem', marginBottom: 6 }}>⏳</div><p style={{ color: '#2ecc71', margin: 0, fontWeight: 600 }}>Processing…</p></>
                    ) : (
                      <>
                        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>📤</div>
                        <p style={{ color: 'white', fontWeight: 700, margin: '0 0 5px', fontSize: '0.95rem' }}>Tap to upload your photo</p>
                        <p style={{ color: '#666', margin: 0, fontSize: '0.8rem' }}>JPG, PNG, WEBP from gallery or camera</p>
                      </>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => fileRef.current?.click()}
                    style={{
                      flex: 1, padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(46,204,113,0.35)',
                      background: 'rgba(46,204,113,0.1)', color: '#2ecc71', fontWeight: 600,
                      cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(46,204,113,0.2)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(46,204,113,0.1)'; }}
                  >
                    📷 {previewSrc ? 'Change Photo' : 'Choose from Gallery'}
                  </button>

                  {previewSrc && (
                    <button
                      onClick={handleSubmit}
                      style={{
                        flex: 1, padding: '12px 16px', borderRadius: 12, border: 'none',
                        background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
                        color: 'white', fontWeight: 700, cursor: 'pointer',
                        fontSize: '0.9rem', transition: 'all 0.2s',
                        boxShadow: '0 4px 15px rgba(46,204,113,0.3)',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                    >
                      🚀 Submit & Earn {challenge.xpReward} XP
                    </button>
                  )}
                </div>

                {!isJoined && (
                  <p style={{ color: '#555', fontSize: '0.78rem', marginTop: 10, textAlign: 'center' }}>
                    You'll automatically join the challenge when you submit a photo.
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* Upcoming reminder / completed view */}
        {!isActive && !isCompleted && (
          <button
            onClick={() => {
              showNotification({ icon: '🔔', text: 'Reminder Set!', sub: `We'll notify you when "${challenge.title}" starts.` });
              onClose();
            }}
            style={{
              width: '100%', padding: 14, borderRadius: 14, border: 'none',
              background: 'linear-gradient(135deg, #3498db, #9b59b6)',
              color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '1rem',
            }}
          >🔔 Notify Me When It Starts</button>
        )}
        {isCompleted && (
          <div style={{ textAlign: 'center', padding: '10px 0', color: '#888' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🏁</div>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>This challenge has ended. Stay tuned for the next one!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Challenges page ──────────────────────────────────────────────────────
export default function Challenges() {
  const { joinedChallenges, challengePhotos } = useApp();
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeData | null>(null);

  return (
    <section style={{ minHeight: '100vh', padding: '100px 24px 50px', background: '#1a1a2e' }}>
      {selectedChallenge && (
        <ChallengeOverlay challenge={selectedChallenge} onClose={() => setSelectedChallenge(null)} />
      )}

      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div className="section-tag">🎯 Monthly Challenges</div>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'white', marginBottom: 12 }}>Creative Challenges</h2>
        <p style={{ color: '#888', fontSize: '1rem', maxWidth: 560, margin: '0 auto' }}>
          Join challenges, follow the steps, upload your creation, and win amazing rewards!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 22, maxWidth: 1200, margin: '0 auto' }}>
        {CHALLENGES.map((c, i) => {
          const ss = STATUS_STYLE[c.status];
          const isJoined  = joinedChallenges.includes(c.id);
          const hasPhoto  = !!challengePhotos[c.id];
          const isActive  = c.status === 'active';

          return (
            <div
              key={c.id}
              className="eco-card eco-card-hover"
              style={{
                padding: 28, position: 'relative', overflow: 'hidden',
                borderColor: c.status === 'completed' ? 'rgba(155,89,182,0.3)' : 'rgba(46,204,113,0.2)',
              }}
              data-testid={`challenge-card-${i}`}
            >
              {/* Bottom accent */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
                background: c.status === 'active'
                  ? 'linear-gradient(90deg, #2ecc71, #f39c12)'
                  : c.status === 'upcoming'
                    ? 'linear-gradient(90deg, #3498db, #9b59b6)'
                    : 'linear-gradient(90deg, #9b59b6, #7d3c98)',
              }} />

              {/* Completed badge overlay */}
              {hasPhoto && (
                <div style={{
                  position: 'absolute', top: 14, right: 14,
                  background: '#2ecc71', color: 'white',
                  fontSize: '0.7rem', fontWeight: 700,
                  padding: '3px 10px', borderRadius: 20,
                }}>✓ Submitted</div>
              )}

              <span style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, marginBottom: 14, background: ss.bg, color: ss.color }}>
                {ss.label}
              </span>

              <div style={{ fontSize: '2.8rem', marginBottom: 12 }}>{c.icon}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: 8 }}>{c.title}</div>
              <div style={{ color: '#888', lineHeight: 1.6, marginBottom: 16, fontSize: '0.9rem' }}>{c.desc}</div>

              {/* Difficulty + time */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: DIFF_COLOR[c.difficulty], fontWeight: 700, background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: 20 }}>
                  ● {c.difficulty}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#888', background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: 20 }}>
                  ⏱ {c.timeEst}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                {c.rewards.map((r, j) => (
                  <span key={j} style={{
                    background: 'rgba(243,156,18,0.12)', border: '1px solid rgba(243,156,18,0.3)',
                    color: '#f39c12', padding: '4px 10px', borderRadius: 20, fontSize: '0.76rem', fontWeight: 600,
                  }}>{r}</span>
                ))}
              </div>

              <div style={{ color: '#888', fontSize: '0.85rem', marginBottom: c.participants ? 8 : 12 }}>{c.timer}</div>

              {c.participants && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#888', marginBottom: 5 }}>
                    <span>👥 {c.participants.count}</span>
                    <span>{c.participants.pct}%</span>
                  </div>
                  <div className="xp-bar-track">
                    <div style={{
                      height: '100%', width: `${c.participants.pct}%`,
                      background: c.participants.barColor || 'linear-gradient(90deg, #2ecc71, #f39c12)',
                      borderRadius: 10, transition: 'width 1s ease',
                    }} />
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedChallenge(c)}
                data-testid={`challenge-btn-${i}`}
                style={{
                  width: '100%', padding: '11px 16px', borderRadius: 12, border: 'none',
                  background: hasPhoto
                    ? 'linear-gradient(135deg, #27ae60, #1e8449)'
                    : isJoined && isActive
                      ? 'linear-gradient(135deg, #2980b9, #1a5276)'
                      : c.status === 'upcoming'
                        ? 'linear-gradient(135deg,#3498db,#9b59b6)'
                        : c.status === 'completed'
                          ? 'linear-gradient(135deg,#9b59b6,#7d3c98)'
                          : 'linear-gradient(135deg, #2ecc71, #27ae60)',
                  color: 'white', fontWeight: 700, cursor: 'pointer',
                  fontSize: '0.9rem', transition: 'all 0.3s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(46,204,113,0.3)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                {hasPhoto
                  ? '✅ View Submission'
                  : isJoined && isActive
                    ? '📸 Upload Your Photo'
                    : c.status === 'upcoming'
                      ? '🔔 Remind Me'
                      : c.status === 'completed'
                        ? '📊 View Results'
                        : '🚀 Join Challenge'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

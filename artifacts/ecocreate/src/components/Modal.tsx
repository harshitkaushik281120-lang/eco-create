import { useApp } from '@/context/AppContext';

export default function Modal() {
  const { modalOpen, modalTitle, modalBody, closeModal } = useApp();

  if (!modalOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.8)',
        zIndex: 1500,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(5px)',
      }}
      onClick={closeModal}
      data-testid="modal-overlay"
    >
      <div
        style={{
          background: '#0f3460',
          borderRadius: 25, padding: 40,
          maxWidth: 500, width: '90%',
          border: '1px solid rgba(46,204,113,0.3)',
          animation: 'modalIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
        data-testid="modal-content"
      >
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: 20, textAlign: 'center' }}>
          {modalTitle}
        </div>
        <div style={{ color: '#e0e0e0', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: modalBody }} />
        <button
          className="eco-btn-primary"
          style={{ width: '100%', marginTop: 20, justifyContent: 'center' }}
          onClick={closeModal}
          data-testid="modal-close-btn"
        >
          Awesome! 🌟
        </button>
      </div>
    </div>
  );
}

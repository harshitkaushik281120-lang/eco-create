import { useApp } from '@/context/AppContext';

export default function NotificationToast() {
  const { notification } = useApp();

  if (!notification) return null;

  return (
    <div
      data-testid="notification-toast"
      style={{
        position: 'fixed', top: 90, right: 20,
        background: 'linear-gradient(135deg, #0f3460, #1a4a7a)',
        border: '1px solid #2ecc71',
        borderRadius: 15, padding: '18px 25px',
        minWidth: 300,
        display: 'flex', alignItems: 'center', gap: 12,
        zIndex: 2000,
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        animation: 'slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
    >
      <div style={{ fontSize: '1.5rem' }}>{notification.icon}</div>
      <div>
        <div style={{ fontWeight: 600, color: 'white' }}>{notification.text}</div>
        <div style={{ fontSize: '0.85rem', color: '#888' }}>{notification.sub}</div>
      </div>
    </div>
  );
}

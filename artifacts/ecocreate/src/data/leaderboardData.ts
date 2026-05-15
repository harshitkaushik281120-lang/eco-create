export interface LeaderboardEntry {
  name: string;
  emoji: string;
  level: string;
  points: number;
  badges: string;
  color: string;
}

export interface LeaderboardData {
  weekly: LeaderboardEntry[];
  monthly: LeaderboardEntry[];
  alltime: LeaderboardEntry[];
}

export const leaderboardData: LeaderboardData = {
  weekly: [
    { name: 'GreenQueen', emoji: '🌟', level: 'Eco Master', points: 3420, badges: '🏆♻️🌿', color: '#27ae60' },
    { name: 'OceanSaver', emoji: '🌊', level: 'Ocean Guardian', points: 2890, badges: '🐋🌊💧', color: '#2980b9' },
    { name: 'EcoNinja', emoji: '🌺', level: 'Recycle Expert', points: 2340, badges: '🥷♻️⚡', color: '#8e44ad' },
    { name: 'EcoWarrior_Alex', emoji: '🌱', level: 'Green Champion', points: 2100, badges: '🌱🏅✨', color: '#27ae60' },
    { name: 'PlasticFighter', emoji: '💪', level: 'Plastic Buster', points: 1890, badges: '💪🔥🎯', color: '#e74c3c' },
    { name: 'TreeHugger22', emoji: '🌳', level: 'Forest Guardian', points: 1650, badges: '🌳🍃💚', color: '#27ae60' },
    { name: 'ZeroWasteZara', emoji: '⭐', level: 'Waste Warrior', points: 1420, badges: '⭐🌟💫', color: '#f39c12' },
    { name: 'RecycleKing', emoji: '👑', level: 'Recycle Pro', points: 1200, badges: '👑🏆🥇', color: '#f39c12' },
  ],
  monthly: [
    { name: 'EcoNinja', emoji: '🌺', level: 'Recycle Expert', points: 12450, badges: '🥷♻️⚡', color: '#8e44ad' },
    { name: 'GreenQueen', emoji: '🌟', level: 'Eco Master', points: 11200, badges: '🏆♻️🌿', color: '#27ae60' },
    { name: 'OceanSaver', emoji: '🌊', level: 'Ocean Guardian', points: 9800, badges: '🐋🌊💧', color: '#2980b9' },
    { name: 'PlasticFighter', emoji: '💪', level: 'Plastic Buster', points: 8900, badges: '💪🔥🎯', color: '#e74c3c' },
    { name: 'EcoWarrior_Alex', emoji: '🌱', level: 'Green Champion', points: 8340, badges: '🌱🏅✨', color: '#27ae60' },
  ],
  alltime: [
    { name: 'EcoWarrior_Alex', emoji: '🌱', level: 'Green Champion', points: 52340, badges: '🌱🏅✨', color: '#27ae60' },
    { name: 'GreenQueen', emoji: '🌟', level: 'Eco Master', points: 48200, badges: '🏆♻️🌿', color: '#27ae60' },
    { name: 'OceanSaver', emoji: '🌊', level: 'Ocean Guardian', points: 41500, badges: '🐋🌊💧', color: '#2980b9' },
    { name: 'EcoNinja', emoji: '🌺', level: 'Recycle Expert', points: 38900, badges: '🥷♻️⚡', color: '#8e44ad' },
    { name: 'TreeHugger22', emoji: '🌳', level: 'Forest Guardian', points: 32100, badges: '🌳🍃💚', color: '#27ae60' },
  ],
};

export const getPasswordStrength = (password = '') => {
  if (!password) return { score: 0, label: '', percent: 0, color: '#666' };

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const levels = [
    { label: 'Too weak', percent: 20, color: '#e74c3c' },
    { label: 'Weak', percent: 40, color: '#ff6b35' },
    { label: 'Fair', percent: 60, color: '#ffb347' },
    { label: 'Good', percent: 80, color: '#4ecdc4' },
    { label: 'Strong', percent: 100, color: '#2ecc71' },
  ];

  const level = levels[Math.min(score, 4)];
  return { score, ...level };
};

export const isPasswordStrongEnough = (password) => password.length >= 6;

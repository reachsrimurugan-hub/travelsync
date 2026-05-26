export const validateEmail = (email) => {
  if (!email?.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return '';
};

export const validateSignup = ({ name, email, password, confirm }) => {
  const errors = {};
  if (!name?.trim()) errors.name = 'Full name is required';
  const emailErr = validateEmail(email);
  if (emailErr) errors.email = emailErr;
  const passErr = validatePassword(password);
  if (passErr) errors.password = passErr;
  if (password !== confirm) errors.confirm = 'Passwords do not match';
  return errors;
};

const ERROR_MAP = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/popup-closed-by-user': 'Sign-in popup was closed before completing.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'auth/missing-password': 'Please enter your password.',
};

export const getAuthErrorMessage = (error) => {
  if (!error) return 'Something went wrong. Please try again.';
  const code = error.code || '';
  if (ERROR_MAP[code]) return ERROR_MAP[code];
  return error.message?.replace('Firebase: ', '').replace(/\(auth\/.*\)\.?/, '').trim() || 'Authentication failed.';
};
